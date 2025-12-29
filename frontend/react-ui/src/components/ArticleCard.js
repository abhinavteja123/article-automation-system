import React from 'react';
import { Link } from 'react-router-dom';

function ArticleCard({ article }) {
  const isUpdated = article.version === 'updated';
  
  // Truncate content for preview
  const getPreview = (content, maxLength = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover-scale">
      <div className="p-6 animate-fade-in">
        {/* Version Badge */}
        <div className="mb-3">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              isUpdated
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {isUpdated ? '✓ Updated' : 'Original'}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-primary-600 transition-colors">
          <Link to={`/article/${article.id}`}>
            {article.title}
          </Link>
        </h2>

        {/* Preview */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {getPreview(article.content)}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>{formatDate(article.created_at)}</span>
          {isUpdated && (
            <span className="text-green-600 font-medium">AI Enhanced</span>
          )}
        </div>

        {/* Action Button */}
        <Link
          to={`/article/${article.id}`}
          className="inline-block w-full text-center bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors font-medium"
        >
          Read Article
        </Link>
      </div>

      {/* Footer for Updated Articles */}
      {isUpdated && article.original_article_id && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <Link
            to={`/article/${article.original_article_id}`}
            className="text-xs text-primary-600 hover:text-primary-800 font-medium"
          >
            → View Original Version
          </Link>
        </div>
      )}
    </div>
  );
}

export default ArticleCard;
