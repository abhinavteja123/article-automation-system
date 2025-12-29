import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleService } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await articleService.getAllArticles();
      console.log('Articles fetched:', response.data); // keeping this for debugging
      setArticles(response.data || []);
    } catch (err) {
      console.error('Error fetching articles:', err); // debug
      setError(err.message || 'Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    // filter by version
    if (filter !== 'all' && article.version !== filter) {
      return false;
    }
    
    // filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        article.title?.toLowerCase().includes(search) ||
        article.content?.toLowerCase().includes(search) ||
        article.url?.toLowerCase().includes(search)
      );
    }
    
    return true;
  });

  // calculate stats
  const stats = {
    total: articles.length,
    original: articles.filter(a => a.version === 'original').length,
    updated: articles.filter(a => a.version === 'updated').length,
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchArticles} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
              <p className="text-gray-600 mt-1">Browse and search through all articles</p>
            </div>
            <Link 
              to="/automation"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 shadow-md transition-all font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Run Automation
            </Link>
          </div>

          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search articles by title, content, or URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Articles</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-gray-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Original</p>
                <p className="text-3xl font-bold text-gray-900">{stats.original}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">AI Enhanced</p>
                <p className="text-3xl font-bold text-gray-900">{stats.updated}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md p-1 mb-6 inline-flex">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              filter === 'all' 
                ? 'bg-blue-600 text-white shadow' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilter('original')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              filter === 'original' 
                ? 'bg-blue-600 text-white shadow' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Original ({stats.original})
          </button>
          <button
            onClick={() => setFilter('updated')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              filter === 'updated' 
                ? 'bg-blue-600 text-white shadow' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Enhanced ({stats.updated})
          </button>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No articles found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or run the scraper to add articles</p>
            <Link 
              to="/automation" 
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Run Scraper
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
