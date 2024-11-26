import { baseApi } from '@/shared/api/base';
import { useAuthStore } from '@/entities/User/model/store/authStore';
import { loginApi } from './loginApi';
import { AUTH_CONFIG } from '@/shared/config';

export const silentRefresh = async () => {
  try {
    const response = await loginApi.refresh();
    useAuthStore.getState().setAuth(
      {
        accessToken: response.accessToken,
        refreshToken: '',
      },
      response.user
    );

    setTimeout(
      silentRefresh,
      AUTH_CONFIG.accessTokenExpiresIn - AUTH_CONFIG.refreshTokenGracePeriod
    );
  } catch (error) {
    useAuthStore.getState().logout();
    const event = new CustomEvent('AUTH_ERROR', {
      detail: '로그인이 만료되었습니다. 다시 로그인해주세요.',
    });
    window.dispatchEvent(event);
  }
};

export const setupAuthInterceptors = () => {
  baseApi.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  baseApi.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // 로그인 요청 실패는 바로 에러 반환
      if (originalRequest.url?.includes('/member/login')) {
        return Promise.reject(error);
      }

      // 인증된 요청에서 401 발생시에만 토큰 갱신 시도
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await silentRefresh();
          return baseApi(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};
