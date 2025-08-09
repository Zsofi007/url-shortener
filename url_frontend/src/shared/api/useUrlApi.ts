import { useApi } from '../hooks/useApi';
import * as urlApiService from './urlApi.service';
import type { ShortenedUrl, ShortenUrlRequest, CustomUrlRequest } from './urlApi.service';

export const useUrlApi = () => {
  // Shorten URL with custom limits
  const {
    loading: isUrlShortenerLoading,
    data: shortenedUrl,
    error: urlShortenerError,
    execute: shortenUrl
  } = useApi<ShortenUrlRequest, ShortenedUrl>(urlApiService.shortenUrl);

  // Custom URL with custom limits
  const {
    loading: isCustomUrlLoading,
    data: customUrl,
    error: customUrlError,
    execute: createCustomUrl
  } = useApi<CustomUrlRequest, ShortenedUrl>(urlApiService.createCustomUrl);

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
      createCustomUrl
    }
  };
}; 