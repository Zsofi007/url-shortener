const API_BASE_URL = 'http://localhost:8000';

export interface ShortenedUrl {
  short_code: string;
  long_url: string;
  short_url: string;
}

// Shorten a URL
export const shortenUrl = async (longUrl: string): Promise<ShortenedUrl> => {
  console.log(longUrl);
  const response = await fetch(`${API_BASE_URL}/api/shorten?long_url=${longUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to shorten URL');
  }

  const data = await response.json();
  console.log(data);
  // Transform the response to match our interface
  return {
    short_code: data.short_code,
    long_url: longUrl,
    short_url: `${API_BASE_URL}/${data.short_code}`
  };
};

// Create a custom URL
export const createCustomUrl = async (longUrl: string, customCode: string): Promise<ShortenedUrl> => {
  console.log('Creating custom URL:', { longUrl, customCode });
  const response = await fetch(`${API_BASE_URL}/api/custom?long_url=${encodeURIComponent(longUrl)}&custom_code=${encodeURIComponent(customCode)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create custom URL');
  }

  const data = await response.json();
  console.log('Custom URL response:', data);
  
  // Return the response (already matches our interface)
  return {
    short_code: data.short_code,
    long_url: data.long_url,
    short_url: data.short_url
  };
};
