import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleService } from '../services/api';
import ReactMarkdown from 'react-markdown';

function ComparePage() {
  const { id } = useParams();
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('side-by-side'); // 'side-by-side' or 'stacked'

  useEffect(() => {
    fetchComparison();
  }, [id]);

  const fetchComparison = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await articleService.getComparison(id);
      setComparison(response.data);
    } catch (err) {
      console.error('Error fetching comparison:', err);
      setError(err.message || 'Failed to load comparison');
    } finally {
      setLoading(false);
    }
  };

  const getWordCount = (text) => {
    return text ? text.split(/\s+/).filter(word => word.length > 0).length : 0;
  };

  const getReadingTime = (text) => {
    const words = getWordCount(text);
    const minutes = Math.ceil(words / 200);
    return minutes;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading comparison...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Comparison</h3>
          <p className="text-red-700">{error}</p>
          <Link to="/articles" className="mt-4 inline-block text-blue-600 hover:underline">
            ← Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  const { original, enhanced } = comparison || {};

  if (!original && !enhanced) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800">No comparison data available</p>
          <Link to="/articles" className="mt-4 inline-block text-blue-600 hover:underline">
            ← Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <Link 
            to="/articles" 
            className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-2 font-medium mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Articles
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Article Comparison</h1>
              <p className="text-gray-600 mt-1">Compare original vs AI-enhanced version</p>
            </div>
            
            {/* View Mode Toggle */}
            <div className="bg-white rounded-lg shadow-sm p-1 flex gap-1">
              <button
                onClick={() => setViewMode('side-by-side')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'side-by-side'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Side by Side
              </button>
              <button
                onClick={() => setViewMode('stacked')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'stacked'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Stacked
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Original Words</p>
                <p className="text-2xl font-bold text-gray-900">{getWordCount(original?.content)}</p>
              </div>
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Enhanced Words</p>
                <p className="text-2xl font-bold text-gray-900">{getWordCount(enhanced?.content)}</p>
              </div>
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Improvement</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enhanced && original 
                    ? `+${Math.round(((getWordCount(enhanced.content) - getWordCount(original.content)) / getWordCount(original.content)) * 100)}%`
                    : 'N/A'
                  }
                </p>
              </div>
              <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Comparison Content */}
        <div className={viewMode === 'side-by-side' ? 'grid md:grid-cols-2 gap-6' : 'space-y-6'}>
          {/* Original Version */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white">
                    ORIGINAL
                  </span>
                  <span className="text-white/80 text-sm">{getReadingTime(original?.content)} min read</span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {original ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{original.title}</h2>
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <ReactMarkdown>{original.content}</ReactMarkdown>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      <span className="font-medium">Source:</span>{' '}
                      <a href={original.source_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {original.source_url}
                      </a>
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-center py-12">No original version available</p>
              )}
            </div>
          </div>

          {/* Enhanced Version */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    AI ENHANCED
                  </span>
                  <span className="text-white/80 text-sm">{getReadingTime(enhanced?.content)} min read</span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {enhanced ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{enhanced.title}</h2>
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <ReactMarkdown>{enhanced.content}</ReactMarkdown>
                  </div>
                  {enhanced.references && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-sm text-gray-900 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        References
                      </h4>
                      <div className="space-y-1">
                        {JSON.parse(enhanced.references).map((ref, idx) => (
                          <a
                            key={idx}
                            href={ref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-xs text-blue-600 hover:text-blue-800 hover:underline truncate"
                          >
                            {ref}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <p className="text-gray-500 mb-4">No enhanced version yet</p>
                  <Link 
                    to="/automation"
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Run Enhancement
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComparePage;
