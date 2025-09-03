import {AuthResponse} from "@/types/auth";
import {RefreshTokenResponse} from "@/lib/api/authApi";

export const MOCK_AUTH_RESPONSE: AuthResponse = {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    userDetails: {
        id: 'user123',
        username: 'devuser',
        email: 'dev@movie-mate.com',
        roles: ['USER'],
        fullName: null,
        enabled: false,
        notBanned: false,
    },
};
export const MOCK_REFRESH_RESPONSE: RefreshTokenResponse = {
    accessToken: 'mock-access-token-refreshed',
    refreshToken: 'mock-refresh-token-refreshed',
};