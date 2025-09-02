import { API_BASE_URL } from '../../config/api';

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

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch user URLs');
  }

  const urls = await response.json();
  
  // Calculate pagination info
  const total = await getUserUrlsCount(params.search);
  const page = params.page || 1;
  const page_size = params.page_size || 20;
  const total_pages = Math.ceil(total / page_size);

  return {
    urls,
    total,
    page,
    page_size,
    total_pages
  };
};

// Get total count of user URLs
export const getUserUrlsCount = async (search?: string): Promise<number> => {
  const searchParams = new URLSearchParams();
  if (search) searchParams.append('search', search);

  const response = await fetch(`${API_BASE_URL}/api/urls/count?${searchParams.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch URL count');
  }

  return response.json();
};

// Shorten a URL with custom limits
export const shortenUrl = async (request: ShortenUrlRequest): Promise<ShortenedUrl> => {
  console.log('Shortening URL with request:', request);
  const response = await fetch(`${API_BASE_URL}/api/shorten`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to shorten URL');
  }

  const data = await response.json();
  console.log('Shorten URL response:', data);
  
  // Transform the response to include short_url
  return {
    ...data,
    short_url: `${API_BASE_URL}/${data.short_code}`
  };
};

// Create a custom URL with custom limits
export const createCustomUrl = async (request: CustomUrlRequest): Promise<ShortenedUrl> => {
  console.log('Creating custom URL with request:', request);
  const response = await fetch(`${API_BASE_URL}/api/custom`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create custom URL');
  }

  const data = await response.json();
  console.log('Custom URL response:', data);
  
  // Transform the response to include short_url
  return {
    ...data,
    short_url: `${API_BASE_URL}/${data.short_code}`
  };
};

// Generate QR code for an existing short URL
export const generateQrCode = async (request: QrCodeRequest): Promise<QrCodeResponse> => {
  console.log('Generating QR code with request:', request);
  const response = await fetch(`${API_BASE_URL}/api/qr-code`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to generate QR code');
  }

  const data = await response.json();
  console.log('QR code response:', data);
  
  return data;
};
