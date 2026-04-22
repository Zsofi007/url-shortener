import { useState, useEffect, useCallback } from 'react';
import { useUrlApi } from '../../shared/api/useUrlApi';
import type { ListUrlsParams } from '../../shared/api/urlApi.service';

export const useDashboard = (initialPageSize: number = 20) => {
  const { state, actions } = useUrlApi();
  const { getUserUrls } = actions;

  // Local state for pagination, search, and sorting
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'created_at' | 'clicks' | 'expires_at'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Fetch URLs when dependencies change
  const fetchUrls = useCallback(async () => {
    const params: ListUrlsParams = {
      page,
      page_size: pageSize,
      search: search.trim() || undefined,
      sort_by: sortBy,
      sort_order: sortOrder
    };
    
    await getUserUrls(params);
  }, [page, pageSize, search, sortBy, sortOrder, getUserUrls]);

  // Execute fetches when dependencies change
  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  // Reset to page 1 when search or sorting changes
  useEffect(() => {
    setPage(1);
  }, [search, sortBy, sortOrder]);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleSort = useCallback((field: 'created_at' | 'clicks' | 'expires_at') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  }, [sortBy, sortOrder]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  }, []);

  const refresh = useCallback(() => {
    fetchUrls();
  }, [fetchUrls]);

  // Calculate pagination info
  const total = state.userUrls?.total || 0;
  const totalPages = state.userUrls?.total_pages || 1;
  const urls = state.userUrls?.urls || [];

  return {
    state: {
      page,
      pageSize,
      search,
      sortBy,
      sortOrder,
      urls,
      total,
      totalPages,
      isLoading: state.isUserUrlsLoading,
      error: state.userUrlsError,
    },
    actions: {
      setPage,
      setPageSize,
      setSearch,
      setSortBy,
      setSortOrder,
      handleSearch,
      handleSort,
      handlePageChange,
      handlePageSizeChange,
      refresh,
    }
  };
}; 