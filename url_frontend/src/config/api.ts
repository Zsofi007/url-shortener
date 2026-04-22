// API Configuration
export const API_CONFIG = {
  // Use environment variable if available, fallback to localhost for development
  // If not set, default to same-origin (works well with Vercel rewrites)
  BASE_URL: (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '',
} as const;

// Export the base URL for use in API services
export const API_BASE_URL = API_CONFIG.BASE_URL;

// Public base URL used for displaying short links in the UI.
// In production this should be your short domain (e.g. https://short.abcd.com).
// Defaults to the current origin so it "just works" on Vercel previews/domains.
export const PUBLIC_BASE_URL =
  (import.meta.env.VITE_PUBLIC_BASE_URL as string | undefined) ?? window.location.origin;
