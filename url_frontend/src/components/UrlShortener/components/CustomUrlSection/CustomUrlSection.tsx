import React from 'react';
import { API_BASE_URL } from '../../../../config/api';

interface CustomUrlSectionProps {
  useCustomUrl: boolean;
  setUseCustomUrl: (value: boolean) => void;
  customCode: string;
  setCustomCode: (value: string) => void;
  loading: boolean;
}

export const CustomUrlSection: React.FC<CustomUrlSectionProps> = ({
  useCustomUrl,
  setUseCustomUrl,
  customCode,
  setCustomCode,
  loading,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          id="custom-url-checkbox"
          type="checkbox"
          checked={useCustomUrl}
          onChange={(e) => setUseCustomUrl(e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
          disabled={loading}
        />
        <label htmlFor="custom-url-checkbox" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Use custom short code
        </label>
      </div>

      {/* Custom Code Input - Only shown when checkbox is checked */}
      {useCustomUrl && (
        <div className="transition-all duration-300 ease-out">
          <label htmlFor="custom-code-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Custom short code
          </label>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-500 dark:text-gray-400 px-3 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-l-xl">
              {API_BASE_URL}/
            </span>
            <input
              id="custom-code-input"
              type="text"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              placeholder="my-custom-link"
              className="flex-1 px-3 sm:px-4 py-3 sm:py-4 text-slate-800 dark:text-gray-100 placeholder-slate-500 dark:placeholder-gray-400 border border-slate-300 dark:border-slate-600 rounded-r-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600"
              disabled={loading}
              aria-describedby="custom-code-help"
              pattern="[a-zA-Z0-9_-]{3,50}"
            />
          </div>
          <p id="custom-code-help" className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            3-50 characters: letters, numbers, hyphens, and underscores only
          </p>
        </div>
      )}
    </div>
  );
};