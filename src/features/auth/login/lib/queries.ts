import { useMutation } from '@tanstack/react-query';
import { loginApi } from './loginApi';
import { useAuthStore } from '@/entities/User/model/store/authStore';
import { LoginRequest, LoginResponse } from '../model/types';

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<LoginResponse, Error, LoginRequest>({
    // 타입 명시
    mutationFn: loginApi.login,
    onSuccess: (data) => {
      setAuth(
        {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        },
        data
      );
    },
  });
};

export const useRefreshToken = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: loginApi.refresh,
    onSuccess: (data) => {
      setAuth(
        {
          accessToken: data.accessToken,
          refreshToken: '',
        },
        data.user
      );
    },
    retry: 3,
    retryDelay: 1000,
  });
};
