import { useState } from 'react';
import { loginApi } from '../lib/loginApi';
import { LoginRequest } from './types';
import { useAuthStore } from '@/entities/User/model/store/authStore';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setAuth = useAuthStore((state) => state.setAuth);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const { accessToken, refreshToken, ...userData } =
        await loginApi.login(credentials);

      setAuth({ accessToken, refreshToken }, userData);
      return userData;
    } catch (err) {
      setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
