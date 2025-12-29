import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { articleService } from '../services/api';

function AutomationPage() {
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const addLog = (message) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const runAutomation = async () => {
    setRunning(true);
    setLogs([]);
    setSuccess(false);
    
    try {
      addLog('🚀 Starting article enhancement automation...');
      addLog('📡 Connecting to automation server...');
      
      const response = await fetch('http://localhost:3001/run-automation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to connect to automation server');
      }

      addLog('✅ Connected to automation server');
      addLog('⚙️ Processing articles...');
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
                  addLog('📊 All articles have been enhanced and saved!');
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
      addLog('ℹ️ Then try clicking "Run Automation" again');
      console.error('Automation error:', error);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link 
          to="/articles" 
          className="text-blue-600 hover:text-blue-800 mb-6 inline-flex items-center gap-2 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Articles
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Article Enhancement</h1>
              <p className="text-gray-600 mt-1">Powered by Google Gemini 2.5 Flash</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">What this does:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                <span>Fetches all original articles from the database</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                <span>Searches Google for top-ranking competitor articles on the same topic</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                <span>Scrapes competitor content to understand what makes them rank well</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                <span>Uses AI (Google Gemini) to rewrite articles with better formatting and insights</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                <span>Saves enhanced versions with references to competitor articles</span>
              </li>
            </ul>
          </div>

          <button
            onClick={runAutomation}
            disabled={running}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg shadow-lg transform transition-all ${
              running 
                ? 'bg-gray-400 cursor-not-allowed' 
                : success
                  ? 'bg-green-600 hover:bg-green-700 hover:scale-105 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 text-white'
            }`}
          >
            {running ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Running Automation... Please wait
              </span>
            ) : success ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                Success! Redirecting to articles...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Start AI Enhancement
              </span>
            )}
          </button>
        </div>

        {/* Logs Console */}
        {logs.length > 0 && (
          <div className="bg-gray-900 rounded-2xl shadow-xl p-6 font-mono text-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-700">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 ml-2">Console Output</span>
            </div>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {logs.map((log, idx) => (
                <div key={idx} className="text-green-400 hover:bg-gray-800 px-2 py-1 rounded">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manual Instructions */}
        <div className="mt-6 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Run Manually (Optional)
          </h3>
          <div className="space-y-2">
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">1. Scrape original articles:</p>
              <code className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                cd scripts/article-automation && node scraper.js
              </code>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">2. Enhance with AI:</p>
              <code className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                cd scripts/article-automation && node automation.js
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AutomationPage;
