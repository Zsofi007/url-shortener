import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../shared/contexts/AuthContext';
import { useToast } from '../../../shared/contexts/ToastContext';

export const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { actions, state } = useAuthContext();
  const { showSuccess, showError, showInfo } = useToast();
  
  // Determine initial mode based on URL path
  const [mode, setMode] = useState<'login' | 'register'>(
    location.pathname === '/auth/register' ? 'register' : 'login'
  );
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailSent, setShowEmailSent] = useState(false);

  // Redirect authenticated users away from auth pages
  useEffect(() => {
    if (state.isAuthenticated && !state.isLoading) {
      navigate('/', { replace: true });
    }
  }, [state.isAuthenticated, state.isLoading, navigate]);

  // Update mode when location changes
  useEffect(() => {
    setMode(location.pathname === '/auth/register' ? 'register' : 'login');
  }, [location.pathname]);

  // Don't render the auth form if user is already authenticated
  if (state.isAuthenticated || state.isLoading) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleModeToggle = () => {
    const newMode = mode === 'login' ? 'register' : 'login';
    setMode(newMode);
    setShowEmailSent(false); // Reset email sent state
    navigate(newMode === 'register' ? '/auth/register' : '/auth');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      showError('Validation Error', 'Please fill in all required fields.');
      return false;
    }
    
    if (mode === 'register' && formData.password !== formData.confirmPassword) {
      showError('Validation Error', 'Passwords do not match.');
      return false;
    }
    
    if (mode === 'register' && formData.password.length < 6) {
      showError('Validation Error', 'Password must be at least 6 characters long.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (mode === 'register') {
        const response = await actions.register(formData);
        
        if (response.access_token) {
          // User was automatically logged in (email already confirmed)
          showSuccess('Registration Successful', 'Welcome! You have been automatically logged in.');
          navigate('/');
        } else {
          // Email confirmation required
          setShowEmailSent(true);
          showInfo('Registration Successful', 'Please check your email to confirm your account.');
        }
      } else {
        // Login mode
        await actions.login(formData);
        showSuccess('Login Successful', 'Welcome back!');
        navigate('/');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      showError('Authentication Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (showEmailSent) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
          <div className="text-center space-y-6">
            {/* Success Icon */}
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">
              Check Your Email!
            </h1>

            {/* Message */}
            <div className="space-y-4">
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                We've sent a confirmation email to <strong>{formData.email}</strong>
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Click the confirmation link in your email to activate your account and start using our service.
                </p>
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Didn't receive the email? Check your spam folder or try registering again.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => setShowEmailSent(false)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
              >
                Back to Login
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Try a different email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {mode === 'login' ? 'Sign in to your account to continue' : 'Join us to start shortening URLs'}
            </p>
          </div>

          {/* Success Message */}
          {/* Error Message */}
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter your email"
                disabled={isLoading}
              />
              {/* {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )} */}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter your password"
                disabled={isLoading}
              />
              {/* {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
              )} */}
            </div>

            {/* Confirm Password Field (Register only) */}
            {mode === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
                {/* {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                )} */}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{mode === 'login' ? 'Signing In...' : 'Creating Account...'}</span>
                </div>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={handleModeToggle}
                className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
                disabled={isLoading}
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
              disabled={isLoading}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
