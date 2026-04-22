import React from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useHeader } from './useHeader';
import { useAuthContext } from '../../shared/contexts/AuthContext';
import { useToast } from '../../shared/contexts/ToastContext';
import { DarkModeToggleV3 } from '../DarkModeToggle/DarkModeToggleV3';

export const Header: React.FC = () => {
  const { isMenuOpen, toggleMenu, closeMenu } = useHeader();
  const { state, actions } = useAuthContext();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await actions.logout();
      showSuccess('Logged Out', 'You have been successfully logged out.');
      navigate('/');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      showError('Logout Error', errorMessage);
    }
  };

  return (
    <header className="bg-white/80 dark:bg-slate-950/60 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-600/25">
                <img src="/link.svg" alt="" aria-hidden="true" className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                LinkShort
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation & Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex space-x-1">
              <Link
                to="/"
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-100/70 dark:hover:bg-slate-900 rounded-lg focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 no-underline"
              >
                Home
              </Link>
              {state.isAuthenticated && (
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-100/70 dark:hover:bg-slate-900 rounded-lg focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 no-underline"
                >
                  Dashboard
                </Link>
              )}
            </nav>
            
            {/* Auth Section */}
            <div className="flex items-center space-x-3">
              {state.isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              ) : state.isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-slate-600 dark:text-slate-300 max-w-[18rem] truncate">
                    {state.user?.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 shadow-sm shadow-indigo-600/20"
                >
                  Sign In
                </Link>
              )}
              <DarkModeToggleV3 />
            </div>
          </div>

          {/* Mobile menu button & Dark Mode Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <DarkModeToggleV3 />
            <button
              onClick={toggleMenu}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-900 rounded-lg focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-drawer"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile side drawer (portaled to <body> to avoid backdrop-filter fixed bugs) */}
      {isMenuOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="md:hidden">
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-slate-900/50"
              style={{ zIndex: 9998 }}
              aria-hidden="true"
              onClick={closeMenu}
            />

            {/* Drawer */}
            <aside
              id="mobile-drawer"
              className="fixed right-0 top-0 h-full w-[min(20rem,90vw)] bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
              style={{ zIndex: 9999 }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
            <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200/70 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-600/25">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <span className="font-semibold text-slate-900 dark:text-slate-50">Menu</span>
              </div>
              <button
                type="button"
                onClick={closeMenu}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100/70 dark:text-slate-400 dark:hover:bg-slate-900 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
                aria-label="Close menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="p-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-900 rounded-lg focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 no-underline"
                onClick={closeMenu}
              >
                Home
              </Link>

              {state.isAuthenticated && (
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-base font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-900 rounded-lg focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 no-underline"
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
              )}
            </nav>

            <div className="mt-auto p-3 border-t border-slate-200/70 dark:border-slate-800">
              {state.isAuthenticated ? (
                <div className="space-y-2">
                  <div className="px-3 text-sm text-slate-600 dark:text-slate-300 truncate">
                    {state.user?.email}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="w-full px-3 py-2 text-left text-base font-medium text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="block px-3 py-2 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 shadow-sm shadow-indigo-600/20 text-center"
                  onClick={closeMenu}
                >
                  Sign In
                </Link>
              )}
            </div>
          </aside>
        </div>,
          document.body,
        )}
    </header>
  );
}; 