export const API_CONFIG = {
  baseURL: '/api/v1',
  endpoints: {
    login: '/member/login',
    join: '/member/join',
    refresh: '/member/refresh', // refresh 엔드포인트 추가
    findId: '/member/find-id', // 추가
    resetPw: '/member/reset-pw', // 추가
  },
} as const;

export const AUTH_CONFIG = {
  refreshTokenExpiresIn: 3, // 3일
  accessTokenKey: 'accessToken',
  refreshTokenKey: 'refreshToken',
  accessTokenExpiresIn: 15 * 60 * 1000, // 15분 (밀리초)
  refreshTokenGracePeriod: 60 * 1000, // 갱신 여유 시간 1분
} as const;
