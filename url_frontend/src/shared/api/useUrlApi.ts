import { useApi } from '../hooks/useApi';
import * as urlApiService from './urlApi.service';
import type { ShortenedUrl } from './urlApi.service';

export const useUrlApi = () => {
  // Shorten URL
  const {
    loading: isUrlShortenerLoading,
    data: shortenedUrl,
    error: urlShortenerError,
    execute: shortenUrl
  } = useApi<string, ShortenedUrl>(urlApiService.shortenUrl);

  // Custom URL
  const {
    loading: isCustomUrlLoading,
    data: customUrl,
    error: customUrlError,
    execute: createCustomUrlExecute
  } = useApi<{ longUrl: string; customCode: string }, ShortenedUrl>(
    ({ longUrl, customCode }) => urlApiService.createCustomUrl(longUrl, customCode)
  );

  return {
    state: {
      isUrlShortenerLoading,
      shortenedUrl,
      urlShortenerError,
      isCustomUrlLoading,
      customUrl,
      customUrlError
    },
    actions: {
      shortenUrl,
      createCustomUrl: createCustomUrlExecute
    }
  };
}; 