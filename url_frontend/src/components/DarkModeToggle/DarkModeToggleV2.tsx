import React from 'react';
import { useDarkMode } from '../../shared/contexts/DarkModeContext';

export const DarkModeToggleV2: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className={`relative w-20 h-10 rounded-full transition-all duration-500 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 hover:scale-105 ${
        isDarkMode 
          ? 'bg-slate-800' 
          : 'bg-yellow-300'
      }`}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Moon/Sun circle */}
      <div
        className={`absolute top-1 w-8 h-8 rounded-full transition-all duration-400 ease-in-out ${
          isDarkMode 
            ? 'sun' 
            : 'moon'
        }`}
        style={{
          left: isDarkMode ? '48px' : '8px',
          transform: isDarkMode ? 'rotate(0deg)' : 'rotate(-75deg)',
          width: '32px',
          height: '32px',
          background: isDarkMode ? '#fff' : '#1e293b',
          transition: 'all 400ms ease-in-out',
          boxShadow: isDarkMode
            ? `
              /* Sun center and rays */
              24px 24px 0 40px #fff inset,
              0 -40px 0 -21.6px #fff,
              28px -28px 0 -24px #fff,
              40px 0 0 -21.6px #fff,
              28px 28px 0 -24px #fff,
              0 40px 0 -21.6px #fff,
              -28px 28px 0 -24px #fff,
              -40px 0 0 -21.6px #fff,
              -28px -28px 0 -24px #fff
            `
            : `
              /* Moon crescent */
              24px 20px 0 0px #94a3b8 inset,
              /* Stars */
              rgba(255, 255, 255, 0.1) 0px -56px 0 -36px,
              rgba(255, 255, 255, 0.1) 24px 56px 0 -36px,
              rgba(255, 255, 255, 0.1) 16px 104px 0 -32px,
              rgba(255, 255, 255, 0.1) 48px 16px 0 -32.8px,
              rgba(255, 255, 255, 0.1) 64px 64px 0 -36px,
              rgba(255, 255, 255, 0.1) 48px 104px 0 -36px,
              rgba(255, 255, 255, 0.1) -32px 56px 0 -36px,
              rgba(255, 255, 255, 0.1) -8px 80px 0 -36px
            `
        }}
      />
    </button>
  );
};