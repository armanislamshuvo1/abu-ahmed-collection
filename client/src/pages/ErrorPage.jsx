import React, { useState } from 'react';
import { AlertTriangle, Home, RefreshCw, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const ErrorPage = ({
  code = 404,
  title,
  message,
  error,
  resetErrorBoundary,
  onNavigate
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const is404 = code === 404;

  const defaultTitle = is404 ? 'Page Not Found' : 'Something Went Wrong';
  const defaultMessage = is404
    ? "The page you are looking for doesn't exist, has been removed, or is temporarily unavailable."
    : 'An unexpected error occurred while rendering this page. Our team has been notified.';

  const handleHomeClick = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    }
    if (onNavigate) {
      onNavigate('/');
    } else {
      window.location.href = '/';
    }
  };

  const handleReload = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    }
    window.location.reload();
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-cream">
      <div className="max-w-lg w-full text-center bg-white rounded-2xl shadow-xl p-8 border border-gold/20">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-maroon/10 text-maroon mb-6">
          {is404 ? (
            <HelpCircle className="w-10 h-10 text-maroon" />
          ) : (
            <AlertTriangle className="w-10 h-10 text-maroon" />
          )}
        </div>

        <div className="text-5xl font-serif font-bold text-maroon mb-2">
          {code}
        </div>

        <h1 className="text-2xl font-serif font-bold text-royal-black mb-3">
          {title || defaultTitle}
        </h1>

        <p className="text-charcoal/80 text-sm leading-relaxed mb-8">
          {message || defaultMessage}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={handleHomeClick}
            variant="primary"
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Homepage
          </Button>

          {!is404 && (
            <Button
              onClick={handleReload}
              variant="outline"
              className="w-full sm:w-auto flex items-center justify-center gap-2 border-maroon text-maroon hover:bg-maroon/5"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Page
            </Button>
          )}
        </div>

        {error && (
          <div className="mt-8 text-left border-t border-cream-dark pt-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center justify-between w-full text-xs text-charcoal/60 hover:text-charcoal font-medium py-1"
            >
              <span>Technical details</span>
              {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showDetails && (
              <pre className="mt-2 p-3 bg-cream-dark/50 rounded-lg text-xs font-mono text-charcoal overflow-x-auto whitespace-pre-wrap max-h-48">
                {error.toString()}
                {error.componentStack && `\n\nStack:\n${error.componentStack}`}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
