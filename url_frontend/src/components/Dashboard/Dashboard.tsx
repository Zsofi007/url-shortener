import React from 'react';
import { useDashboard } from './useDashboard';

export const Dashboard: React.FC = () => {
  const {
    urls,
    loading,
    error,
    deleteLoading,
    handleDeleteUrl,
    refreshUrls,
  } = useDashboard();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
      </div>

      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Dashboard Coming Soon</p>
        <p className="text-gray-400 dark:text-gray-500">URL management features will be added here</p>
      </div>
    </div>
  );
}; 