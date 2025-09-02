export type UserRole = 'ROOT' | 'ADMIN' | 'MODERATOR' | 'USER';

export interface UserDetails {
  id: number;
  username: string;
  email: string;
  fullName: string | null;
  enabled: boolean;
  notBanned: boolean;
  roles: UserRole[];
}

export interface AuthResponse {
  userDetails: UserDetails;
  accessToken: string;
  refreshToken: string;
}
