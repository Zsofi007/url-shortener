const API_BASE_URL = 'http://localhost:8000';

export interface ShortenedUrl {
  short_code: string;
  long_url: string;
  short_url: string;
  expires_at: string;
  max_clicks: number;
  clicks: number;
  created_at: string;
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

// Shorten a URL with custom limits
export const shortenUrl = async (request: ShortenUrlRequest): Promise<ShortenedUrl> => {
  console.log('Shortening URL with request:', request);
  const response = await fetch(`${API_BASE_URL}/api/shorten`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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
    headers: {
      'Content-Type': 'application/json',
    },
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
