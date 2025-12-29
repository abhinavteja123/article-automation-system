import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              Powered by AI
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Article Automation<br />
            <span className="text-blue-600">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Scrape articles from BeyondChats, enhance them with AI, and manage everything in one powerful dashboard.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              to="/articles" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all font-medium"
            >
              View Articles →
            </Link>
            <Link 
              to="/automation" 
              className="bg-white border-2 border-gray-300 px-8 py-3 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all font-medium"
            >
              Run Automation
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Scraping</h3>
            <p className="text-gray-600">
              Automatically fetch the latest articles from BeyondChats blog with a single click.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">AI Enhancement</h3>
            <p className="text-gray-600">
              Improve content quality using OpenAI based on top-ranking competitor articles.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Compare & Analyze</h3>
            <p className="text-gray-600">
              View original and enhanced versions side-by-side with detailed statistics.
            </p>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Scrape Articles</h3>
                <p className="text-gray-600">
                  The scraper fetches the last 5 articles from BeyondChats blog and stores them in your MySQL database.
                </p>
              </div>
            </div>
            
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">AI Processing</h3>
                <p className="text-gray-600">
                  Search Google for similar top-ranking articles, analyze them, and use OpenAI to create enhanced versions.
                </p>
              </div>
            </div>
            
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">View & Compare</h3>
                <p className="text-gray-600">
                  Browse all articles, search through content, and compare original vs enhanced versions with detailed metrics.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-gray-600 mb-6">Start automating your content workflow today</p>
          <Link 
            to="/articles" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 shadow-lg font-medium"
          >
            Browse Articles
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
