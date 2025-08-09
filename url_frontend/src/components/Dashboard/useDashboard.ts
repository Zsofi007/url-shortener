// Dashboard functionality removed since getAllUrls endpoint doesn't exist
// This component can be used for future features or removed entirely

export const useDashboard = () => {
  return {
    urls: [],
    loading: false,
    error: null,
    deleteLoading: false,
    handleDeleteUrl: async () => {},
    refreshUrls: () => {},
  };
}; 