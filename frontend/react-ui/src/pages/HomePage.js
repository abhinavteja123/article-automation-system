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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Articles</h1>
        <Link 
          to="/automation"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Run Automation
        </Link>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search articles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded mb-6 focus:outline-none focus:border-blue-500"
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 p-4 rounded">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded">
          <div className="text-2xl font-bold">{stats.original}</div>
          <div className="text-sm text-gray-600">Original</div>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded">
          <div className="text-2xl font-bold">{stats.updated}</div>
          <div className="text-sm text-gray-600">Enhanced</div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('original')}
          className={`px-4 py-2 rounded ${
            filter === 'original' ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
        >
          Original
        </button>
        <button
          onClick={() => setFilter('updated')}
          className={`px-4 py-2 rounded ${
            filter === 'updated' ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
        >
          Enhanced
        </button>
      </div>

      {/* Articles */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No articles found.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
