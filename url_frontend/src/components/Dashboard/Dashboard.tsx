import React from 'react';
import { useDashboard } from './useDashboard';
import { useToast } from '../../shared/contexts/ToastContext';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const {
    state: {
      page,
      pageSize,
      search,
      sortBy,
      sortOrder,
      urls,
      total,
      totalPages,
      isLoading,
      error,
    },
    actions: {
      handleSearch,
      handleSort,
      handlePageChange,
      handlePageSizeChange,
      refresh,
    }
  } = useDashboard();

  const { showError, showSuccess } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccess('URL copied to clipboard!', 'success');
    } catch (err) {
      showError('Failed to copy URL', 'error');
    }
  };

  const getStatusBadge = (url: any) => {
    if (url.expires_at && new Date(url.expires_at) < new Date()) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Expired</span>;
    }
    if (url.max_clicks && url.clicks >= url.max_clicks) {
      return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Max Clicks Reached</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = date.getTime() - now.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) return 'Expired';
    if (diffInDays === 0) return 'Expires today';
    if (diffInDays === 1) return 'Expires tomorrow';
    return `Expires in ${diffInDays} days`;
  };

  if (isLoading && page === 1) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading URLs</h3>
                <div className="mt-2 text-sm text-red-700">
                  {error.message || 'An error occurred'}
                </div>
                <div className="mt-4">
                  <button
                    onClick={refresh}
                    className="bg-red-100 text-red-800 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-200"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My URLs</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your shortened URLs
            </p>
          </div>

          {/* Controls */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search URLs..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="dashboard-search-input dashboard-form-control w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              {/* Sort */}
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value as 'created_at' | 'clicks' | 'expires_at')}
                  className="dashboard-sort-select dashboard-form-control px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="created_at">Created</option>
                  <option value="clicks">Clicks</option>
                  <option value="expires_at">Expires</option>
                </select>
                <button
                  onClick={() => handleSort(sortBy)}
                  className="dashboard-sort-button px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>

              {/* Page Size */}
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="dashboard-page-size-select dashboard-form-control px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
            </div>
          </div>

          {/* URLs List */}
          <div className="px-6 py-6">
            {urls.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">No URLs found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {urls.map((url) => (
                  <div
                    key={url.short_code}
                    className="dashboard-url-item group border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {/* Header Row - Short Code and Status */}
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="dashboard-url-title text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            <span className="group-hover:hidden">{url.short_code}</span>
                            <span className="hidden group-hover:inline">{url.short_url}</span>
                          </h3>
                          {getStatusBadge(url)}
                        </div>
                        
                        {/* Long URL - More prominent positioning */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="dashboard-url-description text-sm text-gray-600 dark:text-gray-400 break-all group-hover:text-gray-700 dark:group-hover:text-gray-300 leading-relaxed">
                            {url.long_url}
                            </div>
                        </div>
                        
                        {/* Metadata Row - Stats with better spacing */}
                        <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                            <span className="font-medium">Created</span>
                            <span>{formatDate(url.created_at)}</span>
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                            <span className="font-medium">Clicks</span>
                            <span className="font-semibold text-gray-700 dark:text-gray-300">{url.clicks}</span>
                          </span>
                          {url.expires_at && (
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                              <span className="font-medium">Expires</span>
                              <span>{formatExpiryDate(url.expires_at)}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Buttons - Right side */}
                      <div className="dashboard-action-buttons flex flex-col gap-2 ml-6 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => copyToClipboard(url.short_url)}
                          className="dashboard-action-button px-4 py-2 text-sm bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 font-medium"
                        >
                          Copy
                        </button>
                        <a
                          href={url.short_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="dashboard-action-button px-4 py-2 text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800 font-medium text-center"
                        >
                          Visit
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} results
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="dashboard-pagination-button px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:hover:scale-100"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="dashboard-pagination-button px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:hover:scale-100"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 