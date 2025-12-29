import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { articleService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function ArticleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await articleService.getArticleById(id);
      setArticle(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch article');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Parse and render markdown-style content
  const renderContent = (content) => {
    if (!content) return null;

    // Split content into sections
    const lines = content.split('\n');
    const elements = [];
    let currentParagraph = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Handle headings
      if (trimmedLine.startsWith('## ')) {
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${index}`} className="mb-4 text-gray-700 leading-relaxed">
              {currentParagraph.join(' ')}
            </p>
          );
          currentParagraph = [];
        }
        elements.push(
          <h2 key={`h2-${index}`} className="text-2xl font-bold mt-6 mb-4 text-gray-900">
            {trimmedLine.replace('## ', '')}
          </h2>
        );
      } else if (trimmedLine.startsWith('### ')) {
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${index}`} className="mb-4 text-gray-700 leading-relaxed">
              {currentParagraph.join(' ')}
            </p>
          );
          currentParagraph = [];
        }
        elements.push(
          <h3 key={`h3-${index}`} className="text-xl font-semibold mt-5 mb-3 text-gray-800">
            {trimmedLine.replace('### ', '')}
          </h3>
        );
      } else if (trimmedLine.startsWith('- ')) {
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${index}`} className="mb-4 text-gray-700 leading-relaxed">
              {currentParagraph.join(' ')}
            </p>
          );
          currentParagraph = [];
        }
        elements.push(
          <li key={`li-${index}`} className="mb-2 text-gray-700 ml-6">
            {trimmedLine.replace('- ', '')}
          </li>
        );
      } else if (trimmedLine === '') {
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${index}`} className="mb-4 text-gray-700 leading-relaxed">
              {currentParagraph.join(' ')}
            </p>
          );
          currentParagraph = [];
        }
      } else {
        currentParagraph.push(trimmedLine);
      }
    });

    if (currentParagraph.length > 0) {
      elements.push(
        <p key="p-final" className="mb-4 text-gray-700 leading-relaxed">
          {currentParagraph.join(' ')}
        </p>
      );
    }

    return elements;
  };

  // Parse references
  const parseReferences = (references) => {
    if (!references) return [];
    
    try {
      if (typeof references === 'string') {
        return JSON.parse(references);
      }
      return references;
    } catch {
      return [];
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchArticle} />;
  if (!article) return <ErrorMessage message="Article not found" />;

  const isUpdated = article.version === 'updated';
  const references = parseReferences(article.references);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-primary-600 hover:text-primary-800 font-medium flex items-center"
      >
        ← Back to Articles
      </button>

      {/* Article Header */}
      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          {/* Version Badge */}
          <div className="mb-4">
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                isUpdated
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {isUpdated ? '✓ AI Enhanced Version' : 'Original Version'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center">
              <span className="font-medium">Published:</span>
              <span className="ml-2">{formatDate(article.created_at)}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium">Source:</span>
              <a
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-primary-600 hover:text-primary-800 underline"
              >
                View Original
              </a>
            </div>
          </div>

          {/* Version Navigation */}
          {isUpdated && article.original_article && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 mb-2">
                This is an AI-enhanced version. 
              </p>
              <Link
                to={`/article/${article.original_article.id}`}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                → View Original Version
              </Link>
            </div>
          )}

          {article.version === 'original' && article.updated_versions?.length > 0 && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800 mb-2">
                An AI-enhanced version is available!
              </p>
              <Link
                to={`/article/${article.updated_versions[0].id}`}
                className="text-green-600 hover:text-green-800 font-medium text-sm"
              >
                → View AI Enhanced Version
              </Link>
            </div>
          )}

          {/* Article Content */}
          <div className="article-content prose max-w-none">
            {renderContent(article.content)}
          </div>

          {/* References Section */}
          {references.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                References
              </h2>
              <p className="text-gray-600 mb-4">
                This article was enhanced using insights from:
              </p>
              <ul className="space-y-2">
                {references.map((ref, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary-600 font-medium mr-2">
                      {index + 1}.
                    </span>
                    <a
                      href={ref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-800 underline break-all"
                    >
                      {ref}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </article>

      {/* Footer Navigation */}
      <div className="mt-8 text-center">
        <Link
          to="/"
          className="inline-block bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors font-medium"
        >
          Browse More Articles
        </Link>
      </div>
    </div>
  );
}

export default ArticleDetailPage;
