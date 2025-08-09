import React from 'react';
import { useDarkMode } from '../../shared/contexts/DarkModeContext';

export const DarkModeToggleV3: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div
      onClick={toggleDarkMode}
      className="cursor-pointer relative transition-all duration-500 ease-in-out"
      style={{
        height: '32px', // Header-friendly size
        width: '64px',  // 2:1 ratio
        borderRadius: '32px',
        background: !isDarkMode ? '#ffbf71' : '#1e293b', // day vs night background
        padding: '2px',
      }}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleDarkMode();
        }
      }}
    >
      {/* Moon/Sun circle */}
      <div
        className="absolute block rounded-full transition-all duration-400 ease-in-out"
        style={{
          // Convert em to px for header sizing
          top: !isDarkMode ? '4.5px' : '3px',
          left: !isDarkMode ? '33px' : '3px', // 18em scaled down
          transform: !isDarkMode ? 'rotate(0deg)' : 'rotate(-75deg)',
          width: !isDarkMode ? '22px' : '26px', // Scaled down proportionally
          height: !isDarkMode ? '23px' : '26px',
          background: !isDarkMode ? '#fff' : '#1e293b',
          transition: 'all 400ms ease-in-out',
          boxShadow: !isDarkMode
            ? `
              /* Sun - better proportioned rays */
              6px 6px 0 10px #fff inset,
              0 -14px 0 -10px #fff,
              10px -10px 0 -10px #fff,
              14px 0 0 -10px #fff,
              10px 10px 0 -10px #fff,
              0 14px 0 -10px #fff,
              -10px 10px 0 -10px #fff,
              -14px 0 0 -10px #fff,
              -10px -10px 0 -10px #fff
            `
            : `
              /* Moon - small distinct stars */
              5px 4px 0 0px #94a3b8 inset,
              rgba(255, 255, 255, 0.3) 0px -8px 0 -12px,
              rgba(255, 255, 255, 0.3) 6px 40px 0 -12px,
              rgba(255, 255, 255, 0.3) 4px 20px 0 -12px,
              rgba(255, 255, 255, 0.3) 10px 24px 0 -12px,
              rgba(255, 255, 255, 0.3) 14px 29px 0 -12px,
              rgba(255, 255, 255, 0.3) 14px 20px 0 -12px,
              rgba(255, 255, 255, 0.3) -4px 28px 0 -12px,
              rgba(255, 255, 255, 0.3) 3px 33px 0 -12px
            `
        }}
      />
    </div>
  );
};