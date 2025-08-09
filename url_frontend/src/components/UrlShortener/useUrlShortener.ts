import { useEffect, useState } from 'react';
import { useUrlApi } from '../../shared/api/useUrlApi';

// Configuration arrays for easy maintenance
const EXPIRATION_OPTIONS = [
  { value: 1, label: '1 day' },
  { value: 3, label: '3 days' },
  { value: 7, label: '1 week (7 days)' },
  { value: 14, label: '2 weeks (14 days)' },
  { value: 30, label: '1 month (30 days)' },
];

const CLICK_OPTIONS = [
  { value: 1, label: '1 click' },
  { value: 5, label: '5 clicks' },
  { value: 10, label: '10 clicks' },
  { value: 25, label: '25 clicks' },
  { value: 50, label: '50 clicks' },
  { value: 100, label: '100 clicks' },
  { value: 250, label: '250 clicks' },
  { value: 500, label: '500 clicks' },
  { value: 1000, label: '1,000 clicks' },
];

export const useUrlShortener = () => {
  const [longUrl, setLongUrl] = useState('');
  const [useCustomUrl, setUseCustomUrl] = useState(false);
  const [customCode, setCustomCode] = useState('');
  const [expiresInDays, setExpiresInDays] = useState(7); // Default 7 days
  const [maxClicks, setMaxClicks] = useState(10); // Default 10 clicks
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false); // Hidden by default
  const { state, actions } = useUrlApi();

  const handleSubmit = async (url: string) => {
    if (!url.trim()) return;
    
    if (useCustomUrl) {
      if (!customCode.trim()) {
        throw new Error('Custom code is required when using custom URLs');
      }
      await actions.createCustomUrl({
        long_url: url,
        custom_code: customCode.trim(),
        expires_in_days: expiresInDays,
        max_clicks: maxClicks
      });
    } else {
      await actions.shortenUrl({
        long_url: url,
        expires_in_days: expiresInDays,
        max_clicks: maxClicks
      });
    }
  };

  useEffect(() => {
    if (state.shortenedUrl) {
      console.log(state.shortenedUrl);
    }
    if (state.customUrl) {
      console.log(state.customUrl);
    }
  }, [state.shortenedUrl, state.customUrl]);

  const reset = () => {
    setLongUrl('');
    setCustomCode('');
    setUseCustomUrl(false);
    setExpiresInDays(7);
    setMaxClicks(10);
    setShowAdvancedSettings(false);
  };

  // Get the current result (either from regular shortening or custom URL)
  // Preserve the most recent successful result regardless of checkbox state
  const currentData = state.customUrl || state.shortenedUrl;
  const currentError = useCustomUrl ? state.customUrlError : state.urlShortenerError;
  const currentLoading = useCustomUrl ? state.isCustomUrlLoading : state.isUrlShortenerLoading;

  return {
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
    loading: currentLoading,
    data: currentData,
    error: currentError,
    // Configuration options
    expirationOptions: EXPIRATION_OPTIONS,
    clickOptions: CLICK_OPTIONS,
  };
}; 