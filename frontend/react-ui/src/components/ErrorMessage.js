import React from 'react';

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-5xl mb-4">⚠</div>
        <h3 className="text-xl font-semibold text-red-800 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-red-600 mb-4">
          {message || 'Failed to load data. Please try again.'}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors font-medium"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
