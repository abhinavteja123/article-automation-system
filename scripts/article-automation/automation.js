import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000/api';
const SERPAPI_KEY = process.env.SERPAPI_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MAX_RETRIES = parseInt(process.env.MAX_RETRIES || '3');
const RETRY_DELAY = parseInt(process.env.RETRY_DELAY || '2000');

// Validate required environment variables
if (!SERPAPI_KEY) {
    console.error('Error: SERPAPI_KEY is required in .env file');
    process.exit(1);
}

if (!GEMINI_API_KEY) {
    console.error('Error: GEMINI_API_KEY is required in .env file');
    process.exit(1);
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// quick logger i made for debugging
const logger = {
    info: (msg) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`),
    error: (msg) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`),
    success: (msg) => console.log(`[SUCCESS] ${new Date().toISOString()} - ${msg}`),
    warn: (msg) => console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`)
};

// TODO: add better error logging
// TODO: maybe save logs to file?

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
            logger.warn(`Attempt ${i + 1} failed for ${url}: ${error.message}`);
            if (i < retries - 1) {
                await delay(RETRY_DELAY * (i + 1));
            } else {
                throw error;
            }
        }
    }
}

/**
 * Fetch all original articles from backend API
 */
async function fetchOriginalArticles() {
    try {
        logger.info('Fetching original articles from API...');
        const response = await axios.get(`${API_BASE_URL}/articles`, {
            timeout: 30000
        });
        
        const originalArticles = response.data.data.filter(
            article => article.version === 'original'
        );
        
        logger.success(`Found ${originalArticles.length} original articles`);
        return originalArticles;
    } catch (error) {
        logger.error(`Failed to fetch articles: ${error.message}`);
        throw error;
    }
}

/**
 * Search Google using SerpAPI
 */
async function searchGoogle(query) {
    try {
        logger.info(`Searching Google for: "${query}"`);
        
        const response = await axios.get('https://serpapi.com/search', {
            params: {
                q: query,
                api_key: SERPAPI_KEY,
                engine: 'google',
                num: 10
            },
            timeout: 30000
        });
        
        const organicResults = response.data.organic_results || [];
        
        // Filter out beyondchats.com and get first 2 blog/article results
        const competitorArticles = organicResults
            .filter(result => {
                const url = result.link.toLowerCase();
                return !url.includes('beyondchats.com') &&
                       (url.includes('blog') || url.includes('article') || 
                        result.title.toLowerCase().includes('guide') ||
                        result.title.toLowerCase().includes('tutorial'));
            })
            .slice(0, 2)
            .map(result => ({
                title: result.title,
                url: result.link,
                snippet: result.snippet
            }));
        
        logger.success(`Found ${competitorArticles.length} competitor articles`);
        return competitorArticles;
    } catch (error) {
        logger.error(`Google search failed: ${error.message}`);
        return [];
    }
}

/**
 * Scrape and clean article content from URL
 */
async function scrapeCompetitorArticle(url) {
    try {
        logger.info(`Scraping competitor article: ${url}`);
        
        const response = await fetchWithRetry(url);
        const $ = cheerio.load(response.data);
        
        // Remove unwanted elements
        $(
            'script, style, nav, header, footer, aside, .sidebar, ' +
            '.advertisement, .ad, .social-share, .comments, ' +
            '.related-posts, iframe, form'
        ).remove();
        
        // Try to find main content
        let content = '';
        const contentSelectors = [
            'article .content',
            'article .post-content',
            'article .entry-content',
            '.article-content',
            '.post-body',
            'article main',
            'article',
            'main article',
            'main'
        ];
        
        for (const selector of contentSelectors) {
            const element = $(selector);
            if (element.length) {
                // Extract text while preserving some structure
                content = element
                    .find('h1, h2, h3, h4, h5, h6, p, li')
                    .map((i, el) => {
                        const tag = el.tagName.toLowerCase();
                        const text = $(el).text().trim();
                        
                        if (tag.startsWith('h')) {
                            return `\n\n## ${text}\n`;
                        } else if (tag === 'li') {
                            return `- ${text}\n`;
                        } else {
                            return `${text}\n`;
                        }
                    })
                    .get()
                    .join('');
                
                if (content.length > 300) break;
            }
        }
        
        // Clean up content
        content = content
            .replace(/\s+/g, ' ')
            .replace(/\n\s+/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
        
        logger.success(`Scraped ${content.length} characters from competitor article`);
        return content;
    } catch (error) {
        logger.error(`Failed to scrape ${url}: ${error.message}`);
        return '';
    }
}

/**
 * Call OpenAI API to rewrite article
 */
async function rewriteArticleWithAI(originalArticle, competitorContents) {
    try {
        logger.info(`Rewriting article: "${originalArticle.title}"`);
        
        const prompt = `You are an expert content writer and SEO specialist. 

I have an original article and content from two top-ranking competitor articles on the same topic.

ORIGINAL ARTICLE:
Title: ${originalArticle.title}
Content: ${originalArticle.content.substring(0, 3000)}

COMPETITOR ARTICLE 1:
${competitorContents[0] ? competitorContents[0].substring(0, 2000) : 'Not available'}

COMPETITOR ARTICLE 2:
${competitorContents[1] ? competitorContents[1].substring(0, 2000) : 'Not available'}

TASK:
Rewrite the original article to make it competitive with top-ranking articles. 

REQUIREMENTS:
1. Improve formatting with clear headings (use ## for H2, ### for H3)
2. Enhance clarity and readability
3. Match or exceed the depth of competitor articles
4. Maintain professional tone
5. Keep the original topic and intent
6. Avoid plagiarism - create unique content
7. Add valuable insights where appropriate
8. Structure: Introduction, main sections with headings, conclusion
9. Length: At least as comprehensive as the original

Return ONLY the rewritten article content in markdown format. Do not include the title or references section.`;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 4000,
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 120000
            }
        );
        
        const rewrittenContent = response.data.candidates[0].content.parts[0].text.trim();
        logger.success(`Article rewritten successfully (${rewrittenContent.length} characters)`);
        
        return rewrittenContent;
    } catch (error) {
        if (error.response) {
            logger.error(`Gemini API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else {
            logger.error(`Failed to rewrite article: ${error.message}`);
        }
        throw error;
    }
}

/**
 * Post updated article to backend API
 */
async function postUpdatedArticle(originalArticle, rewrittenContent, references) {
    try {
        const referencesSection = `\n\n## References\n\nThis article was enhanced using insights from:\n${references.map((ref, i) => `${i + 1}. [${ref.title}](${ref.url})`).join('\n')}`;
        
        const fullContent = rewrittenContent + referencesSection;
        
        const payload = {
            title: originalArticle.title + ' (Updated)',
            content: fullContent,
            source_url: originalArticle.source_url,
            version: 'updated',
            original_article_id: originalArticle.id,
            references: JSON.stringify(references.map(ref => ref.url))
        };
        
        logger.info(`Posting updated article to API...`);
        const response = await axios.post(`${API_BASE_URL}/articles`, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 30000
        });
        
        logger.success(`Updated article saved (ID: ${response.data.data.id})`);
        return response.data.data;
    } catch (error) {
        if (error.response) {
            logger.error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else {
            logger.error(`Error posting updated article: ${error.message}`);
        }
        throw error;
    }
}

/**
 * Process a single article
 */
async function processArticle(article) {
    try {
        logger.info(`\n${'='.repeat(60)}`);
        logger.info(`Processing: ${article.title}`);
        logger.info('='.repeat(60));
        
        // Step 1: Search Google for competitor articles
        const competitorArticles = await searchGoogle(article.title);
        
        if (competitorArticles.length === 0) {
            logger.warn('No competitor articles found, skipping...');
            return null;
        }
        
        // Step 2: Scrape competitor articles
        const competitorContents = [];
        for (const competitor of competitorArticles) {
            const content = await scrapeCompetitorArticle(competitor.url);
            if (content) {
                competitorContents.push(content);
            }
            await delay(2000); // Respectful delay
        }
        
        if (competitorContents.length === 0) {
            logger.warn('Failed to scrape competitor content, skipping...');
            return null;
        }
        
        // Step 3: Rewrite article using AI
        const rewrittenContent = await rewriteArticleWithAI(article, competitorContents);
        
        // Step 4: Post updated article
        const updatedArticle = await postUpdatedArticle(
            article,
            rewrittenContent,
            competitorArticles
        );
        
        logger.success(`✓ Article processed successfully: ${article.title}`);
        return updatedArticle;
        
    } catch (error) {
        logger.error(`Failed to process article "${article.title}": ${error.message}`);
        return null;
    }
}

/**
 * Main automation function
 */
async function main() {
    try {
        console.log('\n' + '='.repeat(70));
        console.log('  ARTICLE AUTOMATION SERVICE - PHASE 2');
        console.log('  Google Search + LLM Article Rewriting');
        console.log('='.repeat(70) + '\n');
        
        // Fetch all original articles
        const originalArticles = await fetchOriginalArticles();
        
        if (originalArticles.length === 0) {
            logger.warn('No original articles found. Please run the scraper first.');
            return;
        }
        
        // Process each article
        const results = {
            total: originalArticles.length,
            successful: 0,
            failed: 0
        };
        
        for (const article of originalArticles) {
            try {
                const updatedArticle = await processArticle(article);
                
                if (updatedArticle) {
                    results.successful++;
                } else {
                    results.failed++;
                }
                
                // Delay between articles to avoid rate limits
                await delay(3000);
                
            } catch (error) {
                logger.error(`Error processing article: ${error.message}`);
                results.failed++;
            }
        }
        
        // Summary
        console.log('\n' + '='.repeat(70));
        console.log('  AUTOMATION COMPLETE');
        console.log('='.repeat(70));
        console.log(`Total articles processed: ${results.total}`);
        console.log(`Successful: ${results.successful}`);
        console.log(`Failed: ${results.failed}`);
        console.log('='.repeat(70) + '\n');
        
    } catch (error) {
        logger.error(`Fatal error: ${error.message}`);
        process.exit(1);
    }
}

// Run the automation
main();
