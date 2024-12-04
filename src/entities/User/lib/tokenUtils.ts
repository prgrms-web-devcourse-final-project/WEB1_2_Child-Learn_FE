import { jwtDecode} from 'jwt-decode';
import { loginApi } from '@/features/auth/login/lib/loginApi';
import { useAuthStore } from '@/entities/User/model/store/authStore';
import showToast from '@/shared/lib/toast';

let isRefreshingToken = false;

export const isTokenExpiringSoon = (token: string): boolean => {
  if (!token) return false;
  try {
    const decodedToken = jwtDecode(token);
    const expirationTime = (decodedToken.exp || 0) * 1000;
    const currentTime = Date.now();
    // 만료 2분 전에 미리 갱신 시도
    return expirationTime - currentTime <= 2 * 60 * 1000;
  } catch {
    return false;
  }
};

export const silentRefresh = async () => {
  if (isRefreshingToken) return;

  try {
    isRefreshingToken = true;
    const response = await loginApi.refresh();

    if (!response.accessToken) {
      throw new Error('No access token received');
    }

    useAuthStore.getState().setAuth(
      {
        accessToken: response.accessToken,
        refreshToken: '', // 쿠키에서 관리되므로 빈 문자열
      },
      response.user
    );

    return response;
  } catch (error) {
    useAuthStore.getState().logout();
    showToast.error('세션이 만료되었습니다. 다시 로그인해주세요.');
    throw error;
  } finally {
    isRefreshingToken = false;
  }
};
