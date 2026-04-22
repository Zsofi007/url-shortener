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
    <div className="bg-white/80 dark:bg-slate-900/40 rounded-2xl shadow-xl border border-slate-200/70 dark:border-slate-700/60 p-4 sm:p-6 lg:p-8 backdrop-blur-md">
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
          className="w-full rounded-xl bg-indigo-600 text-white py-3 sm:py-4 px-6 font-semibold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
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