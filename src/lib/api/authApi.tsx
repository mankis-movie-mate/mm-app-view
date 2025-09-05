import { AuthResponse } from '@/types/auth';
import { fetchApi } from '@/lib/api/fetchApi';
import { IS_DEV } from '@/lib/constants/global';
import { MOCK_AUTH_RESPONSE, MOCK_REFRESH_RESPONSE } from '@/lib/mock/authMockData';

export interface LoginInput {
  identifier: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;

}



export async function login(data: LoginInput): Promise<AuthResponse> {
  if (IS_DEV) {
    // Simple mock logic: any user/password succeeds
    return Promise.resolve(MOCK_AUTH_RESPONSE);
  }

  return fetchApi<AuthResponse>(`${process.env.NEXT_PUBLIC_AUTH_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function register(data: RegisterInput): Promise<AuthResponse> {
  if (IS_DEV) {
    return Promise.resolve(MOCK_AUTH_RESPONSE);
  }

  return fetchApi<AuthResponse>(`${process.env.NEXT_PUBLIC_AUTH_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
  if (IS_DEV) {
    return Promise.resolve(MOCK_REFRESH_RESPONSE);
  }
  return fetchApi<RefreshTokenResponse>(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/refresh-token?refreshToken=${refreshToken}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
  );
}
