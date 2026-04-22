import { useState, useCallback } from 'react';

interface ApiResponse<T, S> {
    data: S | null;
    loading: boolean;
    error: Error | null;
    execute: (payload: T) => Promise<S | null>;
}

export function useApi<T, S>(
  apiFunction: (payload: T) => Promise<S>
): ApiResponse<T, S> {
  const [data, setData] = useState<S | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const resetState = () => {
    setData(null);
    setError(null);
  }

  const execute = useCallback(
    async (payload: T) => {
        let result: S | null = null;
        try {
            resetState();
            setLoading(true);

            const response = await apiFunction(payload);
            setData(response);
            result = response;
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
        return result;
    },
    [apiFunction]
  );


  return {
      data,
      error,
      loading,
      execute
    }
  
}; 