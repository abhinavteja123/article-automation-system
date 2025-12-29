import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000/api';
const BLOG_URL = process.env.BLOG_URL || 'https://beyondchats.com/blogs/';
const MAX_RETRIES = parseInt(process.env.MAX_RETRIES || '3');
const RETRY_DELAY = parseInt(process.env.RETRY_DELAY || '2000');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url, options = {}, retries = MAX_RETRIES) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.get(url, {
                ...options,
                timeout: 30000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    ...options.headers
                }
            });
            return response;
        } catch (error) {
            console.log(`Attempt ${i + 1} failed for ${url}: ${error.message}`);
            if (i < retries - 1) {
                await delay(RETRY_DELAY * (i + 1));
            } else {
                throw error;
            }
        }
    }
}

// find last page from pagination
async function getLastPageNumber() {
    try {
        console.log('Fetching blog listing page...');
        const response = await fetchWithRetry(BLOG_URL);
        const $ = cheerio.load(response.data);
        
        // Find pagination elements - adjust selectors based on actual site structure
        let lastPage = 1;
        
        // Try different common pagination selectors
        const paginationSelectors = [
            '.pagination a',
            '.pagination li a',
            '.page-numbers',
            'a[aria-label*="page"]',
            'nav[aria-label*="pagination"] a'
        ];
        
        for (const selector of paginationSelectors) {
            $(selector).each((i, elem) => {
                const text = $(elem).text().trim();
                const pageNum = parseInt(text);
                if (!isNaN(pageNum) && pageNum > lastPage) {
                    lastPage = pageNum;
                }
            });
            
            if (lastPage > 1) break;
        }
        
        console.log(`Last page found: ${lastPage}`);
        return lastPage;
    } catch (error) {
        console.error('Error finding last page:', error.message);
        return 1;
    }
}

/**
 * Extract article links from a page
 */
async function getArticleLinksFromPage(pageNum) {
    try {
        const pageUrl = pageNum === 1 ? BLOG_URL : `${BLOG_URL}page/${pageNum}/`;
        console.log(`Fetching articles from: ${pageUrl}`);
        
        const response = await fetchWithRetry(pageUrl);
        const $ = cheerio.load(response.data);
        
        const articles = [];
        
        // Extract only main content articles, NOT featured/sidebar links
        // Look for article titles in the main content area
        $('article, .post, .blog-post, main').find('h1, h2, h3').each((i, elem) => {
            const $heading = $(elem);
            const $link = $heading.find('a').length > 0 ? $heading.find('a') : $heading.parent('a').length > 0 ? $heading.parent('a') : $heading.next('a');
            
            if ($link.length === 0) return;
            
            const link = $link.attr('href');
            const title = $heading.text().trim() || $link.text().trim();
            
            // Filter: Must have href, title, contain /blogs/, but NOT /tag/ or /page/
            if (link && title && 
                link.includes('/blogs/') && 
                !link.includes('/tag/') && 
                !link.includes('/page/') &&
                title.length > 15 &&
                !articles.some(a => a.url === link)) {
                
                const fullUrl = link.startsWith('http') ? link : `https://beyondchats.com${link}`;
                console.log(`  Found article: ${title} - ${fullUrl}`);
                articles.push({
                    title: title,
                    url: fullUrl
                });
            }
        });
        
        // Fallback: if no articles found with above method, try direct article links
        if (articles.length === 0) {
            $('article a, .post-title a, h2.entry-title a, h1 a').each((i, elem) => {
                const link = $(elem).attr('href');
                const title = $(elem).text().trim();
                
                if (link && title && 
                    link.includes('/blogs/') && 
                    !link.includes('/tag/') && 
                    !link.includes('/page/') &&
                    title.length > 15 &&
                    !articles.some(a => a.url === link)) {
                    
                    const fullUrl = link.startsWith('http') ? link : `https://beyondchats.com${link}`;
                    console.log(`  Found article: ${title} - ${fullUrl}`);
                    articles.push({
                        title: title,
                        url: fullUrl
                    });
                }
            });
        }
        
        console.log(`Found ${articles.length} valid blog articles on page ${pageNum}`);
        return articles;
    } catch (error) {
        console.error(`Error fetching articles from page ${pageNum}:`, error.message);
        return [];
    }
}

/**
 * Scrape full content from an article page
 */
async function scrapeArticleContent(url) {
    try {
        console.log(`Scraping article: ${url}`);
        const response = await fetchWithRetry(url);
        const $ = cheerio.load(response.data);
        
        // Remove unwanted elements
        $('script, style, nav, header, footer, aside, .sidebar, .advertisement').remove();
        
        // Try to find article content with various selectors
        let content = '';
        const contentSelectors = [
            'article .content',
            'article .post-content',
            'article .entry-content',
            '.article-content',
            '.post-body',
            'article',
            'main article'
        ];
        
        for (const selector of contentSelectors) {
            const element = $(selector);
            if (element.length) {
                content = element.text().trim();
                if (content.length > 200) break;
            }
        }
        
        // If no content found, try getting text from main content area
        if (!content || content.length < 200) {
            content = $('main').text().trim() || $('body').text().trim();
        }
        
        // Clean up content
        content = content
            .replace(/\s+/g, ' ')
            .replace(/\n+/g, '\n')
            .trim();
        
        return content;
    } catch (error) {
        console.error(`Error scraping article ${url}:`, error.message);
        return '';
    }
}

/**
 * Post article to backend API
 */
async function postArticleToAPI(article) {
    try {
        const payload = {
            title: article.title,
            content: article.content,
            source_url: article.url,
            version: 'original',
            original_article_id: null,
            references: null
        };
        
        console.log(`Posting article to API: ${article.title}`);
        const response = await axios.post(`${API_BASE_URL}/articles`, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 30000
        });
        
        console.log(`✓ Article saved: ${article.title} (ID: ${response.data.data.id})`);
        return response.data.data;
    } catch (error) {
        if (error.response) {
            console.error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else {
            console.error(`Error posting article: ${error.message}`);
        }
        throw error;
    }
}

/**
 * Main scraping function
 */
async function main() {
    try {
        console.log('=== BeyondChats Blog Scraper ===\n');
        
        // Step 1: Find the last page number
        const lastPage = await getLastPageNumber();
        console.log(`Total pages: ${lastPage}\n`);
        
        // Step 2: Collect articles from last pages until we have 5
        let articles = [];
        let currentPage = lastPage;
        
        while (articles.length < 5 && currentPage > 0) {
            console.log(`Fetching articles from page ${currentPage}...`);
            const pageArticles = await getArticleLinksFromPage(currentPage);
            console.log(`  Found ${pageArticles.length} articles on page ${currentPage}`);
            
            // Calculate how many more articles we need
            const needed = 5 - articles.length;
            
            // If this page has more articles than we need, take from the end
            if (pageArticles.length > needed) {
                const lastArticles = pageArticles.slice(-needed); // Get last N articles
                articles = [...articles, ...lastArticles];
            } else {
                articles = [...articles, ...pageArticles];
            }
            
            currentPage--;
            
            // Small delay between page requests
            if (articles.length < 5 && currentPage > 0) {
                await delay(500);
            }
        }
        
        console.log(`\nTotal articles collected: ${articles.length}`);
        
        // Step 3: Get exactly 5 oldest articles
        const oldestArticles = articles.slice(0, 5);
        console.log(`Processing ${oldestArticles.length} oldest articles...\n`);
        
        // Step 5: Scrape and save each article
        const savedArticles = [];
        for (const article of oldestArticles) {
            try {
                // Scrape full content
                const content = await scrapeArticleContent(article.url);
                
                if (!content || content.length < 100) {
                    console.log(`⚠ Skipping article (insufficient content): ${article.title}`);
                    continue;
                }
                
                // Save to API
                const savedArticle = await postArticleToAPI({
                    title: article.title,
                    url: article.url,
                    content: content
                });
                
                savedArticles.push(savedArticle);
                
                // Delay between requests to be respectful
                await delay(1000);
            } catch (error) {
                console.error(`Failed to process article: ${article.title}`);
            }
        }
        
        console.log(`\n=== Scraping Complete ===`);
        console.log(`Successfully saved ${savedArticles.length} articles`);
        
    } catch (error) {
        console.error('Fatal error in scraper:', error.message);
        process.exit(1);
    }
}

// Run the scraper
main();
