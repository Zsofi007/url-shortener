import type { 
  UserRegistrationRequest, 
  UserLoginRequest, 
  AuthResponse, 
  UserProfileResponse 
} from './types.ts';

const API_BASE_URL = 'http://localhost:8000';

// Helper function for API calls
async function apiCall<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Auth API functions
export const authApi = {
  // Register a new user
  async register(data: UserRegistrationRequest): Promise<AuthResponse> {
    return apiCall<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Login user
  async login(data: UserLoginRequest): Promise<AuthResponse> {
    return apiCall<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get user profile
  async getProfile(token: string): Promise<UserProfileResponse> {
    return apiCall<UserProfileResponse>('/api/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Verify token
  async verifyToken(token: string): Promise<{ valid: boolean; user: any }> {
    return apiCall<{ valid: boolean; user: any }>('/api/auth/verify', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Logout user
  async logout(token: string): Promise<{ message: string }> {
    return apiCall<{ message: string }>('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Confirm email with token
  async confirmEmail(token: string): Promise<{ access_token: string; message: string }> {
    return apiCall<{ access_token: string; message: string }>(`/api/auth/confirm?access_token=${token}`);
  },
};
