import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleService } from '../services/api';

function ComparePage() {
  const { id } = useParams();
  const [original, setOriginal] = useState(null);
  const [updated, setUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, [id]);

  const fetchArticles = async () => {
    try {
      const response = await articleService.getAllArticles();
      const articles = response.data || [];
      
      // find matching articles
      const orig = articles.find(a => a.id == id);
      if (orig && orig.version === 'original') {
        setOriginal(orig);
        const upd = articles.find(a => a.title === orig.title && a.version === 'updated');
        setUpdated(upd);
      } else if (orig && orig.version === 'updated') {
        setUpdated(orig);
        const org = articles.find(a => a.title === orig.title && a.version === 'original');
        setOriginal(org);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link to="/articles" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back
      </Link>
      
      <h1 className="text-3xl font-bold mb-6">Compare Versions</h1>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Original */}
        <div className="border border-gray-200 p-4 rounded">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">Original</span>
          {original ? (
            <div className="mt-3">
              <h3 className="font-bold mb-2">{original.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {original.content?.substring(0, 300)}...
              </p>
              <p className="text-xs text-gray-500">
                Words: {original.content?.split(' ').length || 0}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-gray-500">No original version</p>
          )}
        </div>

        {/* Enhanced */}
        <div className="border border-gray-200 p-4 rounded">
          <span className="text-xs bg-green-100 px-2 py-1 rounded">Enhanced</span>
          {updated ? (
            <div className="mt-3">
              <h3 className="font-bold mb-2">{updated.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {updated.content?.substring(0, 300)}...
              </p>
              <p className="text-xs text-gray-500">
                Words: {updated.content?.split(' ').length || 0}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-gray-500">No enhanced version yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ComparePage;
