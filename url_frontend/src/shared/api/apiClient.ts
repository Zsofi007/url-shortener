export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function parseApiResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'error' in payload && payload.error
        ? payload.error
        : `HTTP error! status: ${response.status}`;
    throw new Error(message);
  }

  if (!payload || typeof payload !== 'object' || !('success' in payload)) {
    throw new Error('Unexpected API response');
  }

  if (!payload.success) {
    throw new Error(payload.error || 'Request failed');
  }

  return payload.data;
}

