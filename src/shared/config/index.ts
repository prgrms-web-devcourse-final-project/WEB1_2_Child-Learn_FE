export const API_CONFIG = {
  baseURL: '/api/v1',
  endpoints: {
    login: '/member/login',
    refresh: '/member/refresh',
    join: '/member/join',
  },
} as const;

export const AUTH_CONFIG = {
  refreshTokenExpiresIn: 7, // days
  accessTokenKey: 'accessToken',
  refreshTokenKey: 'refreshToken',
} as const;
