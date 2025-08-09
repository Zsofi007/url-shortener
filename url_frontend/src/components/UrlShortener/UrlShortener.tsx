import React from 'react';
import { useUrlShortener } from './useUrlShortener';

export const UrlShortener: React.FC = () => {
  const {
    longUrl,
    setLongUrl,
    useCustomUrl,
    setUseCustomUrl,
    customCode,
    setCustomCode,
    handleSubmit,
    reset,
    data,
    loading,
    error,
  } = useUrlShortener();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(longUrl);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12">
      {/* Hero Section */}
      <div className="text-center mb-6 sm:mb-8 lg:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
          Shorten Your Links
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
          Create short, memorable links that are easy to share and track.
        </p>
      </div>
      
      {/* URL Shortening Form */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 lg:p-8">
        <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your long URL
            </label>
            <div className="relative">
              <input
                id="url-input"
                type="url"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="https://example.com/very-long-url-that-needs-shortening"
                className="w-full px-3 sm:px-4 py-3 sm:py-4 text-gray-900 placeholder-gray-500 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                disabled={loading}
                aria-describedby="url-help"
              />
              {loading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
            <p id="url-help" className="mt-2 text-sm text-gray-500">
              We'll create a short, shareable link for you
            </p>
          </div>

          {/* Custom URL Option */}
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="custom-url-checkbox"
                type="checkbox"
                checked={useCustomUrl}
                onChange={(e) => setUseCustomUrl(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                disabled={loading}
              />
              <label htmlFor="custom-url-checkbox" className="ml-2 text-sm font-medium text-gray-700">
                Create custom short link
              </label>
            </div>

            {/* Custom Code Input - Only shown when checkbox is checked */}
            {useCustomUrl && (
              <div className="animate-fade-in-up">
                <label htmlFor="custom-code-input" className="block text-sm font-medium text-gray-700 mb-2">
                  Custom short code
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 px-3 py-3 bg-gray-100 border border-gray-200 rounded-l-xl">
                    {window.location.origin}/
                  </span>
                  <input
                    id="custom-code-input"
                    type="text"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    placeholder="my-custom-link"
                    className="flex-1 px-3 sm:px-4 py-3 sm:py-4 text-gray-900 placeholder-gray-500 border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    disabled={loading}
                    aria-describedby="custom-code-help"
                    pattern="[a-zA-Z0-9_-]{3,50}"
                  />
                </div>
                <p id="custom-code-help" className="mt-2 text-sm text-gray-500">
                  3-50 characters: letters, numbers, hyphens, and underscores only
                </p>
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading || !longUrl.trim() || (useCustomUrl && !customCode.trim())}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 sm:py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {useCustomUrl ? 'Creating custom link...' : 'Creating your link...'}
              </span>
            ) : (
              useCustomUrl ? 'Create Custom Link' : 'Shorten URL'
            )}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-4 sm:mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Result */}
        {data && (
          <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl">
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-base sm:text-lg font-semibold text-green-900">Your shortened link is ready!</h3>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <input
                  type="text"
                  value={data.short_url}
                  placeholder={data.short_url}
                  readOnly
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm text-gray-900 font-mono bg-white border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  aria-label="Shortened URL"
                />
                <button
                  onClick={() => copyToClipboard(data.short_url)}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 font-medium whitespace-nowrap shadow-md hover:shadow-lg"
                  aria-label="Copy shortened URL"
                >
                  Copy
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-green-700 space-y-2 sm:space-y-0">
                <span className="truncate">Original: {data.long_url}</span>
                <button
                  onClick={reset}
                  className="text-green-600 hover:text-green-800 underline whitespace-nowrap transition-colors duration-200"
                >
                  Create another
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="mt-8 sm:mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div className="text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Lightning Fast</h3>
          <p className="text-sm sm:text-base text-gray-600">Create short links instantly with our optimized service</p>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Secure & Reliable</h3>
          <p className="text-sm sm:text-base text-gray-600">Your links are safe with enterprise-grade security</p>
        </div>
        
        <div className="text-center sm:col-span-2 lg:col-span-1">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Analytics Ready</h3>
          <p className="text-sm sm:text-base text-gray-600">Track clicks and engagement with detailed analytics</p>
        </div>
      </div>
    </div>
  );
}; 