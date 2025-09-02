import type { ApiError } from '@/types/api';
import { refreshToken as refreshAccessToken } from '@/lib/api/authApi';
import { ROUTES } from '@/lib/constants/routes';

// Accepts the request, parses response, throws typed errors
export async function fetchApi<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);

  let data: any;
  try {
    data = await res.json();
  } catch {
    if (!res.ok) throw new Error(res.statusText || 'Unknown error');
    return {} as T;
  }

  if (!res.ok) {
    console.warn('[API Error]', data);
    if (data && typeof data === 'object' && 'userMessage' in data && 'message' in data) {
      throw data as ApiError;
    }
    throw new Error(data?.message || res.statusText || 'API Error');
  }

  return data as T;
}

/**
 * Reads access token from localStorage and injects into headers.
 */
function getAccessToken(): string | null {
  return localStorage.getItem('accessToken');
}

function mergeHeaders(initHeaders?: HeadersInit, authHeader?: string): Headers {
  const h = new globalThis.Headers(initHeaders);
  h.set('Authorization', `Bearer ${authHeader}`);
  return h;
}

function getRefreshToken(): string | null {
  return localStorage.getItem('refreshToken');
}

/**
 * Tries to refresh token using refreshToken from localStorage.
 */
async function tryRefreshToken(): Promise<boolean> {
  const rt = getRefreshToken();
  if (!rt) return false;

  try {
    const result = await refreshAccessToken(rt);
    if (result?.accessToken && result?.refreshToken) {
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Failed to refresh token', err);
    return false;
  }
}

export async function fetchApiWithAuth<T>(input: RequestInfo, init: RequestInit = {}): Promise<T> {
  let token = getAccessToken();
  const headers = mergeHeaders(init.headers, token || undefined);

  try {
    return await fetchApi<T>(input, {
      ...init,
      headers,
    });
  } catch (err: any) {
    // Refresh if unauthorized
    if (err?.message?.includes('401') || err?.status === 401 || err?.errorCode === 401) {
      const didRefresh = await tryRefreshToken();
      if (!didRefresh) {
        console.warn('Redirecting to login...');
        window.location.href = ROUTES.LOGIN;
        return Promise.reject(
          new Error('Session expired / token malformed. Redirecting to login.'),
        );
      }

      // Retry the original request with new token
      const newToken = getAccessToken();
      const newHeaders = mergeHeaders(init.headers, newToken || undefined);

      return fetchApi<T>(input, {
        ...init,
        headers: newHeaders,
      });
    }

    throw err;
  }
}
