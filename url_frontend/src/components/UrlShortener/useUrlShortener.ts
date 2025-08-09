import { useEffect, useState } from 'react';
import { useUrlApi } from '../../shared/api/useUrlApi';

export const useUrlShortener = () => {
  const [longUrl, setLongUrl] = useState('');
  const [useCustomUrl, setUseCustomUrl] = useState(false);
  const [customCode, setCustomCode] = useState('');
  const { state, actions } = useUrlApi();

  const handleSubmit = async (url: string) => {
    if (!url.trim()) return;
    
    if (useCustomUrl) {
      if (!customCode.trim()) {
        throw new Error('Custom code is required when using custom URLs');
      }
      await actions.createCustomUrl({ longUrl: url, customCode: customCode.trim() });
    } else {
      await actions.shortenUrl(url);
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
  };

  // Get the current result (either from regular shortening or custom URL)
  const currentData = useCustomUrl ? state.customUrl : state.shortenedUrl;
  const currentError = useCustomUrl ? state.customUrlError : state.urlShortenerError;
  const currentLoading = useCustomUrl ? state.isCustomUrlLoading : state.isUrlShortenerLoading;

  return {
    longUrl,
    setLongUrl,
    useCustomUrl,
    setUseCustomUrl,
    customCode,
    setCustomCode,
    handleSubmit,
    reset,
    loading: currentLoading,
    data: currentData,
    error: currentError,
  };
}; 