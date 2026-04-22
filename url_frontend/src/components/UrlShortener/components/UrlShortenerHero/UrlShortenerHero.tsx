import React from 'react';

export const UrlShortenerHero: React.FC = () => {
  return (
    <div className="text-center mb-6 sm:mb-8 lg:mb-12">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-3 sm:mb-4">
        Short links, <span className="text-indigo-700 dark:text-indigo-300">clean sharing</span>.
      </h1>
      <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
        Shorten URLs with expiry and click limits, plus QR codes—built for speed and clarity.
      </p>
    </div>
  );
};