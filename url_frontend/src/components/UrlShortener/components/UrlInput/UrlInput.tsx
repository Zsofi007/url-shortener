import React from 'react';

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  loading: boolean;
}

export const UrlInput: React.FC<UrlInputProps> = ({ value, onChange, loading }) => {
  return (
    <div>
      <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Enter your long URL
      </label>
      <div className="relative">
        <input
          id="url-input"
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/very-long-url-that-needs-shortening"
          className="w-full px-3 sm:px-4 py-3 sm:py-4 text-slate-800 dark:text-gray-100 placeholder-slate-500 dark:placeholder-gray-400 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600"
          disabled={loading}
          aria-describedby="url-help"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
      <p id="url-help" className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        We'll create a short, shareable link for you
      </p>
    </div>
  );
};