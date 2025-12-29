import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

function ComparePage() {
  const { id } = useParams();
  const [originalArticle, setOriginalArticle] = useState(null);
  const [updatedArticle, setUpdatedArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, [id]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await articleService.getAllArticles();
      const articles = response.data || [];
      
      // find both versions
      const original = articles.find(a => a.title === getTitle() && a.version === 'original');
      const updated = articles.find(a => a.title === getTitle() && a.version === 'updated');
      
      setOriginalArticle(original);
      setUpdatedArticle(updated);
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    // get title from current article
    if (originalArticle) return originalArticle.title;
    if (updatedArticle) return updatedArticle.title;
    return '';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/articles" className="text-blue-600 hover:underline">← Back to Articles</Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-8">Compare Versions</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Original */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Original Version</h2>
            <span className="bg-gray-200 px-3 py-1 rounded text-sm">Original</span>
          </div>
          
          {originalArticle ? (
            <div>
              <h3 className="text-lg font-semibold mb-2">{originalArticle.title}</h3>
              <div className="text-sm text-gray-600 mb-4">
                <p>Words: {originalArticle.content?.split(' ').length || 0}</p>
                <p>Published: {new Date(originalArticle.created_at).toLocaleDateString()}</p>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {originalArticle.content?.substring(0, 500)}...
                </p>
              </div>
              <Link 
                to={`/article/${originalArticle.id}`}
                className="mt-4 inline-block text-blue-600 hover:underline"
              >
                Read full article →
              </Link>
            </div>
          ) : (
            <p className="text-gray-500">No original version found</p>
          )}
        </div>

        {/* Updated */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">AI Enhanced</h2>
            <span className="bg-green-200 px-3 py-1 rounded text-sm">Updated</span>
          </div>
          
          {updatedArticle ? (
            <div>
              <h3 className="text-lg font-semibold mb-2">{updatedArticle.title}</h3>
              <div className="text-sm text-gray-600 mb-4">
                <p>Words: {updatedArticle.content?.split(' ').length || 0}</p>
                <p>Published: {new Date(updatedArticle.created_at).toLocaleDateString()}</p>
                {updatedArticle.reference_links && (
                  <p className="text-green-600">✓ Includes references</p>
                )}
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {updatedArticle.content?.substring(0, 500)}...
                </p>
              </div>
              <Link 
                to={`/article/${updatedArticle.id}`}
                className="mt-4 inline-block text-blue-600 hover:underline"
              >
                Read full article →
              </Link>
            </div>
          ) : (
            <p className="text-gray-500">No enhanced version yet. Run automation to create one.</p>
          )}
        </div>
      </div>

      {/* Stats comparison */}
      {originalArticle && updatedArticle && (
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Statistics</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-gray-600 text-sm">Word Count Change</p>
              <p className="text-2xl font-bold">
                {updatedArticle.content?.split(' ').length - originalArticle.content?.split(' ').length > 0 ? '+' : ''}
                {updatedArticle.content?.split(' ').length - originalArticle.content?.split(' ').length}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Original Length</p>
              <p className="text-2xl font-bold">{originalArticle.content?.split(' ').length}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Enhanced Length</p>
              <p className="text-2xl font-bold">{updatedArticle.content?.split(' ').length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComparePage;
