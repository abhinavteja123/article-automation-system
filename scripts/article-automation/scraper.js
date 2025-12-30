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

// TODO: make this configurable
const TARGET_ARTICLE_COUNT = 5;

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

        // More specific selectors for BeyondChats blog listing
        const articleSelectors = [
            'article h2 a',
            'article .post-title a',
            '.blog-post h2 a',
            '.post-item h2 a',
            'h2.entry-title a',
            '.article-title a',
            'article a[href*="/blogs/"]'
        ];

        for (const selector of articleSelectors) {
            $(selector).each((i, elem) => {
                const $link = $(elem);
                const href = $link.attr('href');
                const title = $link.text().trim();

                if (href && title &&
                    href.includes('/blogs/') &&
                    !href.includes('/tag/') &&
                    !href.includes('/page/') &&
                    !href.includes('/category/') &&
                    title.length > 10 && // More substantial titles
                    !articles.some(a => a.url === href)) {

                    const fullUrl = href.startsWith('http') ? href : `https://beyondchats.com${href}`;
                    console.log(`  Found article: ${title.substring(0, 50)}...`);
                    articles.push({
                        title: title,
                        url: fullUrl
                    });
                }
            });

            // If we found articles with this selector, break to avoid duplicates
            if (articles.length > 0) break;
        }

        // Remove duplicates based on URL
        const uniqueArticles = articles.filter((article, index, self) =>
            index === self.findIndex(a => a.url === article.url)
        );

        console.log(`Found ${uniqueArticles.length} unique blog articles on page ${pageNum}`);
        return uniqueArticles;
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

        // Remove unwanted elements that might contain other article content
        $('script, style, nav, header, footer, aside, .sidebar, .advertisement, .ad, .social-share, .comments, .related-posts, iframe, form, .newsletter, .author-bio, .tags, .categories').remove();

        // Also remove elements that might contain multiple article previews
        $('.post-preview, .article-preview, .blog-preview, .recent-posts, .popular-posts, .featured-posts').remove();

        // Try to find article content with more specific selectors for BeyondChats
        let content = '';
        const contentSelectors = [
            '.article-content',
            '.post-content',
            '.entry-content',
            '.content-area',
            'article .content',
            'article p', // Get all paragraphs within article
            '.single-post-content',
            '.blog-content',
            'main .content',
            '.post-body'
        ];

        for (const selector of contentSelectors) {
            const element = $(selector);
            if (element.length) {
                // Get text from paragraphs only, not from headings or other elements
                const paragraphs = element.find('p').length ?
                    element.find('p').map((i, el) => $(el).text().trim()).get().join('\n\n') :
                    element.text().trim();

                if (paragraphs.length > 500) { // Require substantial content
                    content = paragraphs;
                    console.log(`  Found content with selector: ${selector} (${content.length} chars)`);
                    break;
                }
            }
        }

        // If still no good content, try getting all paragraphs from the main content area
        if (!content || content.length < 500) {
            const mainContent = $('main, .main-content, .content').first();
            if (mainContent.length) {
                const paragraphs = mainContent.find('p').map((i, el) => $(el).text().trim()).get();
                // Filter out very short paragraphs (likely navigation or metadata)
                const filteredParagraphs = paragraphs.filter(p => p.length > 50);
                content = filteredParagraphs.join('\n\n');
                console.log(`  Fallback: extracted ${filteredParagraphs.length} paragraphs (${content.length} chars)`);
            }
        }

        // Final cleanup
        content = content
            .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
            .replace(/\n\s*\n/g, '\n\n')  // Clean up line breaks
            .trim();

        if (content.length < 200) {
            console.log(`  ⚠ Warning: Content too short (${content.length} chars)`);
        } else {
            console.log(`  ✓ Extracted ${content.length} characters of content`);
        }

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
                console.log(`\n--- Processing Article ---`);
                console.log(`Title: ${article.title}`);
                console.log(`URL: ${article.url}`);

                // Scrape full content
                const content = await scrapeArticleContent(article.url);

                if (!content || content.length < 100) {
                    console.log(`⚠ Skipping article (insufficient content): ${article.title} (${content.length} chars)`);
                    continue;
                }

                console.log(`Content preview: ${content.substring(0, 200)}...`);

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
                console.error(`Failed to process article: ${article.title}`, error.message);
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
