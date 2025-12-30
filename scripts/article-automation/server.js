import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Enable CORS for frontend
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Automation server is running' });
});

// Run scraper endpoint
app.post('/run-scraper', (req, res) => {
    console.log('Starting scraper...');
    
    // Set headers for streaming response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Spawn the scraper script as a child process
    const scraper = spawn('node', ['scraper.js'], {
        cwd: __dirname,
        shell: true
    });

    let hasError = false;

    // Send output to client in real-time
    scraper.stdout.on('data', (data) => {
        const lines = data.toString().split('\n').filter(line => line.trim());
        lines.forEach(line => {
            res.write(`data: ${JSON.stringify({ type: 'log', message: line })}\n\n`);
        });
    });

    scraper.stderr.on('data', (data) => {
        const lines = data.toString().split('\n').filter(line => line.trim());
        lines.forEach(line => {
            res.write(`data: ${JSON.stringify({ type: 'error', message: line })}\n\n`);
        });
        hasError = true;
    });

    scraper.on('close', (code) => {
        if (code === 0 && !hasError) {
            res.write(`data: ${JSON.stringify({ type: 'complete', success: true, message: 'Scraper completed successfully!' })}\n\n`);
        } else {
            res.write(`data: ${JSON.stringify({ type: 'complete', success: false, message: `Scraper failed with code ${code}` })}\n\n`);
        }
        res.end();
    });

    scraper.on('error', (error) => {
        res.write(`data: ${JSON.stringify({ type: 'error', message: `Failed to start scraper: ${error.message}` })}\n\n`);
        res.write(`data: ${JSON.stringify({ type: 'complete', success: false, message: 'Scraper failed to start' })}\n\n`);
        res.end();
    });
});

// Run automation endpoint
app.post('/run-automation', (req, res) => {
    const { articleIds } = req.body;
    
    if (articleIds && articleIds.length > 0) {
        console.log(`Starting automation for specific articles: ${articleIds.join(', ')}`);
    } else {
        console.log('Starting automation for all articles...');
    }
    
    // Set headers for streaming response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Prepare command with article IDs if provided
    const args = ['automation.js'];
    if (articleIds && articleIds.length > 0) {
        args.push('--articles', articleIds.join(','));
    }

    // Spawn the automation script as a child process
    const automation = spawn('node', args, {
        cwd: __dirname,
        shell: true
    });

    let hasError = false;

    // Send output to client in real-time
    automation.stdout.on('data', (data) => {
        const lines = data.toString().split('\n').filter(line => line.trim());
        lines.forEach(line => {
            res.write(`data: ${JSON.stringify({ type: 'log', message: line })}\n\n`);
        });
    });

    automation.stderr.on('data', (data) => {
        const lines = data.toString().split('\n').filter(line => line.trim());
        lines.forEach(line => {
            res.write(`data: ${JSON.stringify({ type: 'error', message: line })}\n\n`);
        });
        hasError = true;
    });

    automation.on('close', (code) => {
        if (code === 0 && !hasError) {
            res.write(`data: ${JSON.stringify({ type: 'complete', success: true, message: 'Automation completed successfully!' })}\n\n`);
        } else {
            res.write(`data: ${JSON.stringify({ type: 'complete', success: false, message: `Automation failed with code ${code}` })}\n\n`);
        }
        res.end();
    });

    automation.on('error', (error) => {
        res.write(`data: ${JSON.stringify({ type: 'error', message: `Failed to start automation: ${error.message}` })}\n\n`);
        res.write(`data: ${JSON.stringify({ type: 'complete', success: false, message: 'Automation failed to start' })}\n\n`);
        res.end();
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Automation server running on http://localhost:${PORT}`);
    console.log(`📡 Ready to handle automation requests`);
});
