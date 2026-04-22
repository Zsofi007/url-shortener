import { API_BASE_URL } from '../../config/api';
import { parseApiResponse } from './apiClient';

export interface ShortenedUrl {
  short_code: string;
  long_url: string;
  short_url: string;
  expires_at: string;
  max_clicks: number;
  clicks: number;
  created_at: string;
  qr_code_data?: string;
}

export interface ShortenUrlRequest {
  long_url: string;
  expires_in_days?: number;
  max_clicks?: number;
}

export interface CustomUrlRequest {
  long_url: string;
  custom_code: string;
  expires_in_days?: number;
  max_clicks?: number;
}

export interface QrCodeRequest {
  short_code: string;
  size?: number;
}

export interface QrCodeResponse {
  short_code: string;
  qr_code_data: string;
  short_url: string;
}

export interface UserUrl {
  short_code: string;
  long_url: string;
  short_url: string;
  expires_at: string;
  max_clicks: number;
  clicks: number;
  created_at: string;
  qr_code_data?: string;
}

export interface UserUrlsResponse {
  urls: UserUrl[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ListUrlsParams {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: 'created_at' | 'clicks' | 'expires_at';
  sort_order?: 'asc' | 'desc';
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Get user URLs with pagination, search, and sorting
export const getUserUrls = async (params: ListUrlsParams = {}): Promise<UserUrlsResponse> => {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.page_size) searchParams.append('page_size', params.page_size.toString());
  if (params.search) searchParams.append('search', params.search);
  if (params.sort_by) searchParams.append('sort_by', params.sort_by);
  if (params.sort_order) searchParams.append('sort_order', params.sort_order);

  const response = await fetch(`${API_BASE_URL}/api/urls?${searchParams.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return parseApiResponse<UserUrlsResponse>(response);
};

// Get total count of user URLs
export const getUserUrlsCount = async (search?: string): Promise<number> => {
  const searchParams = new URLSearchParams();
  if (search) searchParams.append('search', search);

  const response = await fetch(`${API_BASE_URL}/api/urls/count?${searchParams.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return parseApiResponse<number>(response);
};

// Shorten a URL with custom limits
export const shortenUrl = async (request: ShortenUrlRequest): Promise<ShortenedUrl> => {
  const response = await fetch(`${API_BASE_URL}/api/shorten`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(request),
  });

  const data = await parseApiResponse<ShortenedUrl>(response);
  
  return data;
};

// Create a custom URL with custom limits
export const createCustomUrl = async (request: CustomUrlRequest): Promise<ShortenedUrl> => {
  const response = await fetch(`${API_BASE_URL}/api/custom`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(request),
  });

  const data = await parseApiResponse<ShortenedUrl>(response);
  
  return data;
};

// Generate QR code for an existing short URL
export const generateQrCode = async (request: QrCodeRequest): Promise<QrCodeResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/qr-code`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(request),
  });

  return parseApiResponse<QrCodeResponse>(response);
};
