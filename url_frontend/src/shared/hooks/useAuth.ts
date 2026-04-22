import { useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi.service';
import type { 
  UserRegistrationRequest, 
  UserLoginRequest, 
  AuthResponse, 
  UserProfileResponse 
} from '../api/types';

interface AuthState {
  user: UserProfileResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('accessToken'),
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Check if token is valid on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const result = await authApi.verifyToken(token);
          if (result.valid) {
            const profile = await authApi.getProfile(token);
            setState(prev => ({
              ...prev,
              user: profile,
              isAuthenticated: true,
              isLoading: false,
            }));
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('accessToken');
            setState(prev => ({
              ...prev,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            }));
          }
        } catch {
          // Token verification failed, clear it
          localStorage.removeItem('accessToken');
          setState(prev => ({
            ...prev,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Session expired. Please login again.',
          }));
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuth();
  }, []);

  const register = useCallback(async (data: UserRegistrationRequest): Promise<AuthResponse> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await authApi.register(data);
      
      // If email confirmation is required, don't set as authenticated yet
      if (response.access_token) {
        localStorage.setItem('accessToken', response.access_token);
        
        // Try to get user profile immediately after registration
        try {
          const profile = await authApi.getProfile(response.access_token);
          setState(prev => ({
            ...prev,
            user: profile,
            token: response.access_token,
            isAuthenticated: true,
            isLoading: false,
          }));
        } catch (profileError) {
          // If profile fetch fails, still set as authenticated but without user data
          console.warn('Failed to fetch user profile:', profileError);
          setState(prev => ({
            ...prev,
            token: response.access_token,
            isAuthenticated: true,
            isLoading: false,
          }));
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      throw error;
    }
  }, []);

  const login = useCallback(async (data: UserLoginRequest): Promise<AuthResponse> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await authApi.login(data);
      
      localStorage.setItem('accessToken', response.access_token);
      
      // Try to get user profile immediately after login
      try {
        const profile = await authApi.getProfile(response.access_token);
        setState(prev => ({
          ...prev,
          user: profile,
          token: response.access_token,
          isAuthenticated: true,
          isLoading: false,
        }));
      } catch (profileError) {
        // If profile fetch fails, still set as authenticated but without user data
        console.warn('Failed to fetch user profile:', profileError);
        setState(prev => ({
          ...prev,
          token: response.access_token,
          isAuthenticated: true,
          isLoading: false,
        }));
      }
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        await authApi.logout(token);
      } catch {
        // Even if logout fails, clear local state
      }
    }
    
    localStorage.removeItem('accessToken');
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  const confirmEmail = useCallback(async (token: string): Promise<{ access_token: string; message: string }> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await logout();
      const response = await authApi.confirmEmail(token);
      
      if (response.access_token) {
        localStorage.setItem('accessToken', response.access_token);
        
        // Try to get user profile after confirmation
        try {
          const profile = await authApi.getProfile(response.access_token);
          setState(prev => ({
            ...prev,
            user: profile,
            token: response.access_token,
            isAuthenticated: true,
            isLoading: false,
          }));
        } catch (profileError) {
          // If profile fetch fails, still set as authenticated but without user data
          console.warn('Failed to fetch user profile:', profileError);
          setState(prev => ({
            ...prev,
            token: response.access_token,
            isAuthenticated: true,
            isLoading: false,
          }));
        }
      }
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Email confirmation failed';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      throw error;
    }
  }, [logout]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    state,
    actions: {
      register,
      login,
      logout,
      confirmEmail,
      clearError,
    },
  };
};
