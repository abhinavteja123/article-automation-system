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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Article Library
          </h1>
          <p className="text-gray-600 text-lg">
            Explore our collection of AI-enhanced articles
          </p>
        </div>
        <Link 
          to="/automation"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all"
        >
          Run Automation
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search articles by title, content, or URL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-primary-600 mb-1">
            {stats.total}
          </div>
          <div className="text-gray-600 text-sm font-medium">Total Articles</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {stats.original}
          </div>
          <div className="text-gray-600 text-sm font-medium">Original Articles</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-green-600 mb-1">
            {stats.updated}
          </div>
          <div className="text-gray-600 text-sm font-medium">AI Enhanced</div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            filter === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          All Articles ({stats.total})
        </button>
        <button
          onClick={() => setFilter('original')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            filter === 'original'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Original ({stats.original})
        </button>
        <button
          onClick={() => setFilter('updated')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            filter === 'updated'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          AI Enhanced ({stats.updated})
        </button>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No articles found
          </h3>
          <p className="text-gray-500">
            Try running the scraper to populate the database.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
