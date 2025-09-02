import React from 'react';
import { CustomUrlSection } from '../CustomUrlSection/CustomUrlSection';
import { ExpiryOptions } from '../ExpiryOptions/ExpiryOptions';

interface ExpiryOption {
  value: number;
  label: string;
}

interface AdvancedSettingsProps {
  showAdvancedSettings: boolean;
  setShowAdvancedSettings: (value: boolean) => void;
  useCustomUrl: boolean;
  setUseCustomUrl: (value: boolean) => void;
  customCode: string;
  setCustomCode: (value: string) => void;
  expiresInDays: number;
  setExpiresInDays: (value: number) => void;
  maxClicks: number;
  setMaxClicks: (value: number) => void;
  expirationOptions: ExpiryOption[];
  clickOptions: ExpiryOption[];
  loading: boolean;
}

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  showAdvancedSettings,
  setShowAdvancedSettings,
  useCustomUrl,
  setUseCustomUrl,
  customCode,
  setCustomCode,
  expiresInDays,
  setExpiresInDays,
  maxClicks,
  setMaxClicks,
  expirationOptions,
  clickOptions,
  loading,
}) => {
  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
        className="flex items-center justify-between w-full px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-all duration-200"
        disabled={loading}
        aria-expanded={showAdvancedSettings}
        aria-controls="advanced-settings"
      >
        <div className="flex items-center space-x-2">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Advanced Settings</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {useCustomUrl && customCode ? customCode : expirationOptions.find(opt => opt.value === expiresInDays)?.label} • {clickOptions.find(opt => opt.value === maxClicks)?.label}
          </span>
          <svg
            className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${showAdvancedSettings ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Collapsible Advanced Settings Panel */}
      {showAdvancedSettings && (
        <div
          id="advanced-settings"
          className="space-y-4 overflow-hidden transition-all duration-300 ease-out"
          style={{
            animation: 'slideDown 0.3s ease-out forwards'
          }}
        >
          {/* Custom URL Section */}
          <CustomUrlSection
            useCustomUrl={useCustomUrl}
            setUseCustomUrl={setUseCustomUrl}
            customCode={customCode}
            setCustomCode={setCustomCode}
            loading={loading}
          />

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-slate-600"></div>

          {/* Expiration Settings */}
          <ExpiryOptions
            expiresInDays={expiresInDays}
            setExpiresInDays={setExpiresInDays}
            maxClicks={maxClicks}
            setMaxClicks={setMaxClicks}
            expirationOptions={expirationOptions}
            clickOptions={clickOptions}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};