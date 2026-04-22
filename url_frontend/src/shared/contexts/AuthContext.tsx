import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import type {
  UserLoginRequest,
  UserProfileResponse,
  UserRegistrationRequest,
  AuthResponse,
} from '../api/types';

interface AuthContextType {
  state: {
    user: UserProfileResponse | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  };
  actions: {
    register: (data: UserRegistrationRequest) => Promise<AuthResponse>;
    login: (data: UserLoginRequest) => Promise<AuthResponse>;
    logout: () => Promise<void>;
    confirmEmail: (token: string) => Promise<{ access_token: string; message: string }>;
    clearError: () => void;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
