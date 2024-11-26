import { Cookies } from 'react-cookie';
import { AUTH_CONFIG } from '@/shared/config';

const cookies = new Cookies();

export const TokenService = {
  // refreshToken만 쿠키로 관리
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
    // refreshToken만 제거
    TokenService.removeRefreshToken();
  },
};
