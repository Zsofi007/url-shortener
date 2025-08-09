import React from 'react';
import { UrlShortenerFeatures } from './components/UrlShortenerFeatures/UrlShortenerFeatures';
import { UrlShortenerForm } from './components/UrlShortenerForm/UrlShortenerForm';
import { UrlShortenerHero } from './components/UrlShortenerHero/UrlShortenerHero';

export const UrlShortener: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12">
      {/* Hero Section */}
      <UrlShortenerHero />
      
      {/* URL Shortening Form */}
      <UrlShortenerForm />

      {/* Features Section */}
      <UrlShortenerFeatures />
    </div>
  );
};