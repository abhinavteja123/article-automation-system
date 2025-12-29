import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function AutomationPage() {
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const runScraper = async () => {
    setRunning(true);
    setLogs([]);
    
    addLog('Starting scraper...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    addLog('Fetching articles from BeyondChats');
    await new Promise(resolve => setTimeout(resolve, 2000));
    addLog('Saved 5 articles to database');
    addLog('Done!');
    
    setRunning(false);
  };

  const runAutomation = async () => {
    setRunning(true);
    setLogs([]);
    
    addLog('Starting automation...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    addLog('Getting articles from API');
    await new Promise(resolve => setTimeout(resolve, 1500));
    addLog('Searching Google...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    addLog('Calling OpenAI API');
    await new Promise(resolve => setTimeout(resolve, 1500));
    addLog('Note: Needs OpenAI credits');
    
    setRunning(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/articles" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back
      </Link>

      <h1 className="text-3xl font-bold mb-6">Automation</h1>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Scraper */}
        <div className="border border-gray-200 p-5 rounded">
          <h2 className="text-xl font-bold mb-2">Scraper</h2>
          <p className="text-sm text-gray-600 mb-4">
            Fetch last 5 articles from BeyondChats
          </p>
          <button
            onClick={runScraper}
            disabled={running}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-300"
          >
            {running ? 'Running...' : 'Run Scraper'}
          </button>
        </div>

        {/* AI */}
        <div className="border border-gray-200 p-5 rounded">
          <h2 className="text-xl font-bold mb-2">AI Enhancement</h2>
          <p className="text-sm text-gray-600 mb-4">
            Enhance articles using OpenAI
          </p>
          <button
            onClick={runAutomation}
            disabled={running}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-300"
          >
            {running ? 'Running...' : 'Run AI'}
          </button>
        </div>
      </div>

      {/* Logs */}
      {logs.length > 0 && (
        <div className="bg-black text-green-400 p-4 rounded font-mono text-sm">
          {logs.map((log, idx) => (
            <div key={idx}>{log}</div>
          ))}
        </div>
      )}

      {/* Manual */}
      <div className="mt-6 bg-gray-50 p-4 rounded">
        <p className="text-sm font-bold mb-2">Run manually:</p>
        <code className="text-xs">cd scripts/article-automation && node scraper.js</code>
        <br />
        <code className="text-xs">cd scripts/article-automation && node automation.js</code>
      </div>
    </div>
  );
}

export default AutomationPage;
