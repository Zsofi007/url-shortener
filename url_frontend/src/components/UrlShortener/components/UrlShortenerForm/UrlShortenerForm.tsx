import React from 'react';
import { useUrlShortener } from '../../useUrlShortener';
import { UrlInput } from '../UrlInput/UrlInput';
import { AdvancedSettings } from '../AdvancedSettings/AdvancedSettings';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { SuccessMessage } from '../SuccessMessage/SuccessMessage';

export const UrlShortenerForm: React.FC = () => {
  const {
    longUrl,
    setLongUrl,
    useCustomUrl,
    setUseCustomUrl,
    customCode,
    setCustomCode,
    expiresInDays,
    setExpiresInDays,
    maxClicks,
    setMaxClicks,
    showAdvancedSettings,
    setShowAdvancedSettings,
    handleSubmit,
    reset,
    data,
    loading,
    error,
    expirationOptions,
    clickOptions,
  } = useUrlShortener();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(longUrl);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
        {/* URL Input */}
        <UrlInput
          value={longUrl}
          onChange={setLongUrl}
          loading={loading}
        />

        {/* Advanced Settings */}
        <AdvancedSettings
          showAdvancedSettings={showAdvancedSettings}
          setShowAdvancedSettings={setShowAdvancedSettings}
          useCustomUrl={useCustomUrl}
          setUseCustomUrl={setUseCustomUrl}
          customCode={customCode}
          setCustomCode={setCustomCode}
          expiresInDays={expiresInDays}
          setExpiresInDays={setExpiresInDays}
          maxClicks={maxClicks}
          setMaxClicks={setMaxClicks}
          expirationOptions={expirationOptions}
          clickOptions={clickOptions}
          loading={loading}
        />
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !longUrl.trim() || (useCustomUrl && !customCode.trim())}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 sm:py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>{useCustomUrl ? 'Creating Custom URL...' : 'Shortening URL...'}</span>
            </div>
          ) : (
            useCustomUrl ? 'Create Custom URL' : 'Shorten URL'
          )}
        </button>
      </form>

      {/* Error Message */}
      {error && <ErrorMessage error={error} />}

      {/* Success Result */}
      {data && <SuccessMessage data={data} onReset={reset} />}
    </div>
  );
};