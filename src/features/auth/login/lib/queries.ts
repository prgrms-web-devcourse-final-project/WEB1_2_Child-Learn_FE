import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginApi } from './loginApi';
import { useAuthStore } from '@/entities/User/model/store/authStore';
import { LoginRequest, LoginResponse } from '../model/types';

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: loginApi.login,
    onSuccess: (data) => {
      setAuth(
        {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        },
        data
      );
      // 로그인 성공 시 유저 정보 쿼리 실행
      queryClient.invalidateQueries({ queryKey: ['userInfo'] });
    },
  });
};

export const useRefreshToken = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const queryClient = useQueryClient();

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
      // 토큰 갱신 성공 시 유저 정보도 갱신
      queryClient.invalidateQueries({ queryKey: ['userInfo'] });
    },
    retry: 3,
    retryDelay: 1000,
  });
};
