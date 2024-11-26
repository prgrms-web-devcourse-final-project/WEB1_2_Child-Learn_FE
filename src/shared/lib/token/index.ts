import { Cookies } from 'react-cookie';
import { AUTH_CONFIG } from '@/shared/config';

const cookies = new Cookies();

export const TokenService = {
  getAccessToken: () => localStorage.getItem(AUTH_CONFIG.accessTokenKey),

  setAccessToken: (token: string) =>
    localStorage.setItem(AUTH_CONFIG.accessTokenKey, token),

  removeAccessToken: () => localStorage.removeItem(AUTH_CONFIG.accessTokenKey),

  setRefreshToken: (token: string) => {
    cookies.set(AUTH_CONFIG.refreshTokenKey, token, {
      path: '/',
      secure: true,
      sameSite: 'strict',
      httpOnly: true,
      expires: new Date(
        Date.now() + AUTH_CONFIG.refreshTokenExpiresIn * 24 * 60 * 60 * 1000
      ),
    });
  },

  getRefreshToken: () => cookies.get(AUTH_CONFIG.refreshTokenKey),

  removeRefreshToken: () => cookies.remove(AUTH_CONFIG.refreshTokenKey),

  clearTokens: () => {
    TokenService.removeAccessToken();
    TokenService.removeRefreshToken();
  },
};
