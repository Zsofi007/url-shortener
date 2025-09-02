import React from 'react';

interface ExpiryOption {
  value: number;
  label: string;
}

interface ExpiryOptionsProps {
  expiresInDays: number;
  setExpiresInDays: (value: number) => void;
  maxClicks: number;
  setMaxClicks: (value: number) => void;
  expirationOptions: ExpiryOption[];
  clickOptions: ExpiryOption[];
  loading: boolean;
}

export const ExpiryOptions: React.FC<ExpiryOptionsProps> = ({
  expiresInDays,
  setExpiresInDays,
  maxClicks,
  setMaxClicks,
  expirationOptions,
  clickOptions,
  loading,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Expiration Days Selector */}
      <div>
        <label htmlFor="expires-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Expires in
        </label>
        <select
          id="expires-select"
          value={expiresInDays}
          onChange={(e) => setExpiresInDays(Number(e.target.value))}
          className="w-full px-3 py-3 text-slate-800 dark:text-gray-100 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600"
          disabled={loading}
        >
          {expirationOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Link will expire after this period
        </p>
      </div>

      {/* Max Clicks Selector */}
      <div>
        <label htmlFor="clicks-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Max clicks
        </label>
        <select
          id="clicks-select"
          value={maxClicks}
          onChange={(e) => setMaxClicks(Number(e.target.value))}
          className="w-full px-3 py-3 text-slate-800 dark:text-gray-100 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600"
          disabled={loading}
        >
          {clickOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Link will stop working after this many clicks
        </p>
      </div>
    </div>
  );
};