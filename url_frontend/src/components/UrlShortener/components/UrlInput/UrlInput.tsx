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
          type="text"
          inputMode="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/very-long-url-that-needs-shortening"
          className="w-full px-3 sm:px-4 py-3 sm:py-4 text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 border border-slate-300/80 dark:border-slate-700 rounded-xl bg-white/80 dark:bg-slate-950/30 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent backdrop-blur-sm"
          disabled={loading}
          aria-describedby="url-help"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-500/30 border-t-indigo-600"></div>
          </div>
        )}
      </div>
      <p id="url-help" className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        You can paste a full URL, or just a domain like <span className="font-medium">www.example.com</span> — we’ll add <span className="font-medium">https://</span>.
      </p>
    </div>
  );
};