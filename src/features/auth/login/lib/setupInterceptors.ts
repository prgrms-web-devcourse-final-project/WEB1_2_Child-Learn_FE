import { baseApi } from '@/shared/api/base';
import { loginApi } from './loginApi';
import { useAuthStore } from '@/entities/User/model/store/authStore';
import showToast from '@/shared/lib/toast';

let isRefreshing = false;

export const setupAuthInterceptors = () => {
  baseApi.interceptors.request.use(
    (config) => {
      const { accessToken, isAuthenticated } = useAuthStore.getState();
      // 인증된 상태일 때만 토큰을 헤더에 추가
      if (isAuthenticated && accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  baseApi.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const { isAuthenticated } = useAuthStore.getState();

      // 401 에러이고, 인증된 상태이고, 재시도하지 않은 요청일 때만 토큰 갱신 시도
      if (
        error.response?.status === 401 &&
        isAuthenticated &&
        !originalRequest._retry
      ) {
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

export const silentRefresh = async () => {
  if (isRefreshing) return;

  try {
    isRefreshing = true;
    const response = await loginApi.refresh();

    if (!response.accessToken) {
      throw new Error('No access token received');
    }

    useAuthStore.getState().setAuth(
      {
        accessToken: response.accessToken,
        refreshToken: '', // refreshToken은 쿠키에서 관리되므로 빈 문자열
      },
      response.user
    );

    return response; // 성공 시 응답 반환
  } catch (error) {
    useAuthStore.getState().logout();
    showToast.error('세션이 만료되었습니다. 다시 로그인해주세요.');
    throw error;
  } finally {
    isRefreshing = false;
  }
};
