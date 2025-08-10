import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../../shared/contexts/AuthContext';
import { useToast } from '../../../shared/contexts/ToastContext';

export const EmailConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { actions } = useAuthContext();
  const { showSuccess, showError, showInfo } = useToast();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('');
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current) {
      return;
    }

    const processConfirmation = async () => {
      // Mark as processed immediately to prevent re-runs
      hasProcessed.current = true;
      
      // Extract parameters from hash fragment (Supabase sends tokens in #)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const error = hashParams.get('error');
      const errorDescription = hashParams.get('error_description');

      if (error) {
        setStatus('error');
        setMessage(errorDescription || error);
        showError('Email Confirmation Failed', errorDescription || error);
        return;
      }

      if (!accessToken) {
        setStatus('error');
        setMessage('No access token found. Please check your confirmation link.');
        showError('Email Confirmation Failed', 'No access token found. Please check your confirmation link.');
        return;
      }

      try {
        showInfo('Processing Email Confirmation', 'Please wait while we confirm your email...');
        await actions.confirmEmail(accessToken);
        setStatus('success');
        setMessage('Email confirmed successfully! You are now logged in.');
        showSuccess('Email Confirmed!', 'Your email has been confirmed successfully. Welcome!');
        
        // Redirect to home page after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Email confirmation failed';
        setStatus('error');
        setMessage(errorMessage);
        showError('Email Confirmation Failed', errorMessage);
      }
    };

    processConfirmation();

    // Cleanup function
    return () => {
      console.log('EmailConfirmation: Component unmounting, cleanup...');
    };
  }, [location, navigate, actions, showSuccess, showError, showInfo]);

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        );
      case 'success':
        return (
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
        <div className="text-center space-y-6">
          {/* Status Icon */}
          {getStatusIcon()}

          {/* Title */}
          <h1 className={`text-3xl font-bold ${getStatusColor()}`}>
            {status === 'processing' && 'Confirming Email...'}
            {status === 'success' && 'Email Confirmed!'}
            {status === 'error' && 'Confirmation Failed'}
          </h1>

          {/* Message */}
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            {message}
          </p>

          {/* Additional Info */}
          {status === 'success' && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-green-700 dark:text-green-300">
                You will be redirected to the home page in a few seconds...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-red-700 dark:text-red-300">
                  If you continue to have issues, please try registering again or contact support.
                </p>
              </div>
              
              <button
                onClick={() => navigate('/auth/login')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
              >
                Go to Login
              </button>
            </div>
          )}

          {/* Loading State */}
          {status === 'processing' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Please wait while we confirm your email address...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
