import React from 'react';
import { useDarkMode } from '../../shared/contexts/DarkModeContext';

export const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className={`relative w-16 h-8 rounded-full focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 hover:scale-105 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-slate-700 to-slate-800' 
          : 'bg-gradient-to-r from-indigo-500 to-purple-600'
      }`}
      style={{
        transition: 'all 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 300ms ease-out'
      }}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Moon/Sun toggle circle */}
      <div
        className={`absolute top-1 w-6 h-6 rounded-full ${
          isDarkMode 
            ? 'bg-slate-200' 
            : 'bg-yellow-300'
        }`}
        style={{
          left: isDarkMode ? '36px' : '4px',
          transition: 'all 800ms cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isDarkMode
            ? `
              /* Moon crescent */
              3px 2px 0 0px rgba(71, 85, 105, 0.8) inset,
              /* Stars */
              rgba(255, 255, 255, 0.3) 0px -10px 0 -6px,
              rgba(255, 255, 255, 0.3) 8px 6px 0 -6px,
              rgba(255, 255, 255, 0.3) 6px 12px 0 -5px,
              rgba(255, 255, 255, 0.3) -6px 8px 0 -6px,
              rgba(255, 255, 255, 0.3) -2px 14px 0 -6px
            `
            : `
              /* Sun rays */
              0 -8px 0 -4px rgba(255, 255, 255, 0.4),
              5.5px -5.5px 0 -4px rgba(255, 255, 255, 0.4),
              8px 0 0 -4px rgba(255, 255, 255, 0.4),
              5.5px 5.5px 0 -4px rgba(255, 255, 255, 0.4),
              0 8px 0 -4px rgba(255, 255, 255, 0.4),
              -5.5px 5.5px 0 -4px rgba(255, 255, 255, 0.4),
              -8px 0 0 -4px rgba(255, 255, 255, 0.4),
              -5.5px -5.5px 0 -4px rgba(255, 255, 255, 0.4)
            `
        }}
      />
      
      {/* Background stars for dark mode */}
      <div 
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{
          opacity: isDarkMode ? 1 : 0,
          transition: 'opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div 
          className="absolute w-0.5 h-0.5 bg-white rounded-full"
          style={{ 
            top: '6px', 
            left: '10px',
            opacity: 0.6,
            transition: 'opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
        <div 
          className="absolute w-0.5 h-0.5 bg-white rounded-full"
          style={{ 
            top: '20px', 
            left: '50px',
            opacity: 0.4,
            transition: 'opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
        <div 
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{ 
            top: '14px', 
            left: '40px',
            opacity: 0.5,
            transition: 'opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      </div>
    </button>
  );
};