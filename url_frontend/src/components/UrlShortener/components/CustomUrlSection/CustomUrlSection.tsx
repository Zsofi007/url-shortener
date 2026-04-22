import React from 'react';
import { PUBLIC_BASE_URL } from '../../../../config/api';

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
  const MAX_CUSTOM_CODE_LENGTH = 50;

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
          <div className="flex items-stretch gap-2 min-w-0">
            <span className="min-w-0 max-w-[45%] sm:max-w-none text-sm text-slate-500 dark:text-slate-400 px-3 py-3 bg-slate-100/80 dark:bg-slate-950/30 border border-slate-300/80 dark:border-slate-700 rounded-l-xl truncate">
              {PUBLIC_BASE_URL}/
            </span>
            <input
              id="custom-code-input"
              type="text"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value.slice(0, MAX_CUSTOM_CODE_LENGTH))}
              placeholder="my-custom-link"
              className="min-w-0 flex-1 px-3 sm:px-4 py-3 sm:py-4 text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 border border-slate-300/80 dark:border-slate-700 rounded-r-xl bg-white/80 dark:bg-slate-950/30 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent backdrop-blur-sm"
              disabled={loading}
              aria-describedby="custom-code-help"
              pattern="[a-zA-Z0-9_-]{3,50}"
              maxLength={MAX_CUSTOM_CODE_LENGTH}
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