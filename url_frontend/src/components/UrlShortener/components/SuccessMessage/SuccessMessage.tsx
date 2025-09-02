import React from 'react';
import { QrCodeDisplay } from '../QrCodeDisplay/QrCodeDisplay';

interface ShortenedUrl {
  short_code: string;
  long_url: string;
  short_url: string;
  expires_at: string;
  max_clicks: number;
  clicks: number;
  created_at: string;
  qr_code_data?: string;
}

interface SuccessMessageProps {
  data: ShortenedUrl;
  onReset: () => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ data, onReset }) => {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-800 rounded-xl">
      <div className="flex items-center mb-3 sm:mb-4">
        <div className="flex-shrink-0">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
            <svg className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <div className="ml-3">
          <h3 className="text-base sm:text-lg font-semibold text-green-900 dark:text-green-100">Your shortened link is ready!</h3>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <input
            type="text"
            value={data.short_url}
            placeholder={data.short_url}
            readOnly
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm text-gray-900 dark:text-gray-100 font-mono bg-white dark:bg-slate-700 border border-green-300 dark:border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            aria-label="Shortened URL"
          />
          <button
            onClick={() => copyToClipboard(data.short_url)}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-all duration-300 font-medium whitespace-nowrap shadow-md hover:shadow-lg"
            aria-label="Copy shortened URL"
          >
            Copy
          </button>
        </div>
        
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-green-700 dark:text-green-300">
            <span className="truncate">Original: {data.long_url}</span>
            <button
              onClick={onReset}
              className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 underline whitespace-nowrap transition-colors duration-200"
            >
              Create another
            </button>
          </div>
          
          {/* Expiration Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-green-200 dark:border-green-700">
            <div className="text-xs">
              <span className="font-medium text-green-800 dark:text-green-200">Expires:</span>
              <span className="ml-1 text-green-600 dark:text-green-400">
                {new Date(data.expires_at).toLocaleDateString()}
              </span>
            </div>
            <div className="text-xs">
              <span className="font-medium text-green-800 dark:text-green-200">Max clicks:</span>
              <span className="ml-1 text-green-600 dark:text-green-400">
                {data.max_clicks.toLocaleString()}
              </span>
            </div>
            <div className="text-xs">
              <span className="font-medium text-green-800 dark:text-green-200">Current:</span>
              <span className="ml-1 text-green-600 dark:text-green-400">
                {data.clicks} clicks
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* QR Code Display */}
      {data.qr_code_data && (
        <QrCodeDisplay
          qrCodeData={data.qr_code_data}
          shortUrl={data.short_url}
          shortCode={data.short_code}
        />
      )}
    </div>
  );
};