import axios from 'axios';
import { loginApi } from './loginApi';
import { useAuthStore } from '@/entities/User/model/store/authStore';
import showToast from '@/shared/lib/toast';

let isRefreshing = false;

// 👇 setupAuthInterceptors 함수 추가 및 export
export const setupAuthInterceptors = () => {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          await silentRefresh();
          return axios(originalRequest);
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
    useAuthStore.getState().setAuth(
      {
        accessToken: response.accessToken,
        refreshToken: '',
      },
      response.user
    );
  } catch (error) {
    useAuthStore.getState().logout();
    showToast.error('세션이 만료되었습니다. 다시 로그인해주세요.');
  } finally {
    isRefreshing = false;
  }
};
