// Auth types matching backend models
export interface UserRegistrationRequest {
  email: string;
  password: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user_id: string;
  email: string;
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserProfileResponse {
  user_id: string;
  email: string;
  created_at: string;
  email_confirmed: boolean;
}

// URL types (existing)
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

export interface ShortenedUrl {
  id: string;
  long_url: string;
  short_code: string;
  short_url: string;
  created_at: string;
  expires_at?: string;
  max_clicks: number;
  clicks: number;
  user_id?: string;
}
