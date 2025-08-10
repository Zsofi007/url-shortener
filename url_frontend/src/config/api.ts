// API Configuration
export const API_CONFIG = {
  // Use environment variable if available, fallback to localhost for development
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
} as const;

// Export the base URL for use in API services
export const API_BASE_URL = API_CONFIG.BASE_URL;
