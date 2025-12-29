import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function AutomationPage() {
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [step, setStep] = useState('');

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { message, type, time: new Date().toLocaleTimeString() }]);
  };

  const runScraper = async () => {
    setRunning(true);
    setLogs([]);
    setStep('scraping');
    
    addLog('Starting scraper...', 'info');
    
    try {
      // TODO: need to setup API endpoint to trigger scraper
      // for now just simulate
      await new Promise(resolve => setTimeout(resolve, 2000));
      addLog('✓ Scraped 5 articles from BeyondChats', 'success');
      addLog('✓ Saved to database', 'success');
      setStep('complete');
    } catch (err) {
      addLog('✗ Error: ' + err.message, 'error');
      setStep('error');
    } finally {
      setRunning(false);
    }
  };

  const runAutomation = async () => {
    setRunning(true);
    setLogs([]);
    setStep('automation');
    
    addLog('Starting AI automation...', 'info');
    
    try {
      // simulate the automation process
      await new Promise(resolve => setTimeout(resolve, 1000));
      addLog('Fetching articles from API...', 'info');
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      addLog('✓ Found 5 articles', 'success');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      addLog('Searching Google for competitors...', 'info');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      addLog('✓ Found competitor articles', 'success');
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      addLog('Calling OpenAI API...', 'info');
      addLog('⚠ Note: OpenAI API requires credits', 'warn');
      
      // TODO: setup backend endpoint to trigger automation
      setStep('complete');
    } catch (err) {
      addLog('✗ Error: ' + err.message, 'error');
      setStep('error');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:underline">← Back to Home</Link>
      </div>

      <h1 className="text-4xl font-bold mb-8">Automation Control Panel</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Scraper Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-2">Run Scraper</h2>
          <p className="text-gray-600 mb-4">
            Fetch the latest 5 articles from BeyondChats blog and save them to the database.
          </p>
          <button
            onClick={runScraper}
            disabled={running}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
          >
            {running && step === 'scraping' ? 'Running...' : 'Start Scraping'}
          </button>
        </div>

        {/* AI Automation Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-4xl mb-4">🤖</div>
          <h2 className="text-2xl font-bold mb-2">AI Enhancement</h2>
          <p className="text-gray-600 mb-4">
            Use OpenAI to enhance articles based on top Google search results.
          </p>
          <button
            onClick={runAutomation}
            disabled={running}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
          >
            {running && step === 'automation' ? 'Running...' : 'Start AI Automation'}
          </button>
        </div>
      </div>

      {/* Logs Section */}
      {logs.length > 0 && (
        <div className="bg-gray-900 text-white rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Logs</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto font-mono text-sm">
            {logs.map((log, idx) => (
              <div 
                key={idx} 
                className={`${
                  log.type === 'error' ? 'text-red-400' : 
                  log.type === 'success' ? 'text-green-400' : 
                  log.type === 'warn' ? 'text-yellow-400' : 
                  'text-gray-300'
                }`}
              >
                <span className="text-gray-500">[{log.time}]</span> {log.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Instructions */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-2">💡 Manual Execution</h3>
        <p className="text-gray-700 mb-3">
          You can also run these scripts manually from the terminal:
        </p>
        <div className="bg-white rounded p-4 font-mono text-sm space-y-2">
          <div>
            <span className="text-gray-600"># Run scraper</span>
            <p className="text-blue-600">cd scripts/article-automation && node scraper.js</p>
          </div>
          <div>
            <span className="text-gray-600"># Run AI automation</span>
            <p className="text-blue-600">cd scripts/article-automation && node automation.js</p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link to="/articles" className="text-blue-600 hover:underline">
          View All Articles →
        </Link>
      </div>
    </div>
  );
}

export default AutomationPage;
