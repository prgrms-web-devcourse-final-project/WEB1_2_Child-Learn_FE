import axios from 'axios';
import { baseApi } from '@/shared/api/base';
import { TokenService } from '@/shared/lib/token';
import { loginApi } from './loginApi';

export const setupAuthInterceptors = () => {
  baseApi.interceptors.request.use(
    (config) => {
      const token = TokenService.getAccessToken();
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

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = TokenService.getRefreshToken();
          const { accessToken, refreshToken: newRefreshToken } =
            await loginApi.refresh(refreshToken);

          TokenService.setAccessToken(accessToken);
          TokenService.setRefreshToken(newRefreshToken);

          return baseApi(originalRequest);
        } catch (refreshError) {
          TokenService.clearTokens();
          // refreshError가 axios 에러인지 체크
          if (axios.isAxiosError(refreshError)) {
            throw new Error(
              refreshError.response?.data?.message || '인증이 만료되었습니다.'
            );
          }
          throw new Error('인증이 만료되었습니다.');
        }
      }

      // 일반적인 에러 처리
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || '요청 처리 중 오류가 발생했습니다.'
        );
      }
      return Promise.reject(error);
    }
  );
};
