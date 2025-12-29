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
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
            isUpdated 
              ? 'bg-green-100 text-green-700' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {isUpdated ? '✓ AI Enhanced' : 'Original'}
          </span>
          <span className="text-xs text-gray-500">{formatDate(article.created_at)}</span>
        </div>

        {/* Title */}
        <Link to={`/article/${article.id}`}>
          <h3 className="font-bold text-lg mb-3 text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
            {article.title}
          </h3>
        </Link>

        {/* Preview */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {getPreview(article.content)}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>{article.content?.split(' ').length || 0} words</span>
          </div>
          <div className="flex items-center gap-2">
            <Link 
              to={`/compare/${article.id}`} 
              className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
              title="Compare versions"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Compare
            </Link>
            <Link 
              to={`/article/${article.id}`} 
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              Read more
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleCard;
