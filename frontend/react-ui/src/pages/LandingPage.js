import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Article Automation System
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Scrape articles from BeyondChats, enhance them with AI, and view everything in one place.
          </p>
          <div className="flex gap-3">
            <Link 
              to="/articles" 
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              View Articles
            </Link>
            <Link 
              to="/automation" 
              className="border border-gray-300 px-6 py-2 rounded hover:border-gray-400"
            >
              Run Automation
            </Link>
          </div>
        </div>

        </div>

        {/* Simple feature list */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="border border-gray-200 p-5 rounded">
            <h3 className="font-bold mb-2">Scraping</h3>
            <p className="text-sm text-gray-600">
              Gets the last 5 articles from BeyondChats blog
            </p>
          </div>
          
          <div className="border border-gray-200 p-5 rounded">
            <h3 className="font-bold mb-2">AI Enhancement</h3>
            <p className="text-sm text-gray-600">
              Uses OpenAI to improve content based on competitors
            </p>
          </div>
          
          <div className="border border-gray-200 p-5 rounded">
            <h3 className="font-bold mb-2">View & Compare</h3>
            <p className="text-sm text-gray-600">
              See original and enhanced versions side by side
            </p>
          </div>
        </div>

        {/* Quick start */}
        <div className="bg-gray-50 p-6 rounded">
          <h2 className="text-xl font-bold mb-3">Quick Start</h2>
          <ol className="space-y-2 text-gray-700">
            <li>1. Run the scraper to fetch articles</li>
            <li>2. Run automation to enhance with AI</li>
            <li>3. View and compare results</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
