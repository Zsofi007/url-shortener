const API_BASE_URL = 'http://localhost:8000';

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

// Generate QR code for an existing short URL
export const generateQrCode = async (request: QrCodeRequest): Promise<QrCodeResponse> => {
  console.log('Generating QR code with request:', request);
  const response = await fetch(`${API_BASE_URL}/api/qr-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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
