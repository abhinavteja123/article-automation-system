import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ScraperPage() {
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const addLog = (message) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const runScraper = async () => {
    setRunning(true);
    setLogs([]);
    setSuccess(false);
    
    try {
      addLog('🚀 Starting article scraper...');
      addLog('📡 Connecting to automation server...');
      
      const response = await fetch('http://localhost:3001/run-scraper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to connect to automation server');
      }

      addLog('✅ Connected to automation server');
      addLog('🌐 Fetching articles from BeyondChats blog...');
      addLog('');

      // Read the stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n').filter(line => line.trim());
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              
              if (data.type === 'log') {
                addLog(data.message);
              } else if (data.type === 'error') {
                addLog(`❌ ERROR: ${data.message}`);
              } else if (data.type === 'complete') {
                addLog('');
                if (data.success) {
                  addLog('🎉 ' + data.message);
                  addLog('📊 Articles have been scraped and saved to database!');
                  setSuccess(true);
                  
                  // Auto-redirect after 3 seconds
                  setTimeout(() => {
                    navigate('/articles');
                  }, 3000);
                } else {
                  addLog('⚠️ ' + data.message);
                }
              }
            } catch (e) {
              console.error('Failed to parse:', line);
            }
          }
        }
      }
    } catch (error) {
      addLog('');
      addLog('❌ Failed to connect to automation server');
      addLog('💡 Make sure the automation server is running:');
      addLog('');
      addLog('   1. Open a new terminal');
      addLog('   2. cd scripts/article-automation');
      addLog('   3. npm run server');
      addLog('');
      addLog('ℹ️ The server should start on http://localhost:3001');
      addLog('ℹ️ Then try clicking "Run Scraper" again');
      console.error('Scraper error:', error);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link 
          to="/articles" 
          className="text-green-600 hover:text-green-800 mb-6 inline-flex items-center gap-2 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Articles
        </Link>

        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <h1 className="text-3xl font-bold">Article Scraper</h1>
            </div>
            <p className="text-green-100">Fetch articles from BeyondChats blog and store them in your database</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* What it does */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                What This Does
              </h2>
              <div className="bg-green-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-lg">1.</span>
                  <span className="text-gray-700">Visits BeyondChats.com blog page</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-lg">2.</span>
                  <span className="text-gray-700">Extracts the 5 oldest articles from the last page</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-lg">3.</span>
                  <span className="text-gray-700">Scrapes article content (title, author, content, image, URL)</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-lg">4.</span>
                  <span className="text-gray-700">Saves all articles to your MySQL database via API</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={runScraper}
              disabled={running}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all transform ${
                running
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              {running ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Scraping Articles...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Run Scraper
                </span>
              )}
            </button>

            {/* Console Output */}
            {logs.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Console Output
                </h3>
                <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto font-mono text-sm">
                  {logs.map((log, index) => (
                    <div key={index} className="text-green-400 mb-1">
                      {log}
                    </div>
                  ))}
                  {running && (
                    <div className="text-yellow-400 animate-pulse">
                      ▊ Processing...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mt-6 bg-green-100 border-l-4 border-green-600 p-4 rounded">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-green-800">Scraping Complete!</h4>
                    <p className="text-green-700 text-sm">Redirecting to articles page...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Info Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Next Steps</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <span className="text-green-600">→</span>
                  After scraping, go to the <Link to="/automation" className="text-green-600 hover:underline font-medium">Automation page</Link> to enhance articles with AI
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-600">→</span>
                  View all articles on the <Link to="/articles" className="text-green-600 hover:underline font-medium">Articles page</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScraperPage;
