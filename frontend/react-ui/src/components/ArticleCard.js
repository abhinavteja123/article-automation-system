import React from 'react';
import { Link } from 'react-router-dom';

function ArticleCard({ article }) {
  const isUpdated = article.version === 'updated';
  
  const getPreview = (content, maxLength = 150) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white border border-gray-200 rounded p-4 hover:shadow-md">
      {/* Badge */}
      <span className={`text-xs px-2 py-1 rounded ${
        isUpdated ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
      }`}>
        {isUpdated ? 'Enhanced' : 'Original'}
      </span>

      {/* Title */}
      <h3 className="font-bold text-lg mt-3 mb-2">
        <Link to={`/article/${article.id}`} className="hover:text-blue-600">
          {article.title}
        </Link>
      </h3>

      {/* Preview */}
      <p className="text-sm text-gray-600 mb-3">
        {getPreview(article.content)}
      </p>

      {/* Footer */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500">{formatDate(article.created_at)}</span>
        <Link 
          to={`/article/${article.id}`} 
          className="text-blue-600 hover:underline"
        >
          Read more →
        </Link>
      </div>
    </div>
  );
}

export default ArticleCard;
