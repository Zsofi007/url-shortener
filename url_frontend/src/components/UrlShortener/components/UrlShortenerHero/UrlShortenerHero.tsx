import React from 'react';

export const UrlShortenerHero: React.FC = () => {
  return (
    <div className="text-center mb-6 sm:mb-8 lg:mb-12">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
        Shorten Your Links
      </h1>
      <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Create short, memorable links that are easy to share and track.
      </p>
    </div>
  );
};