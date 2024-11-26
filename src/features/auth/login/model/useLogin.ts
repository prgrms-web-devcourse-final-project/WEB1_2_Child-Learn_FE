import { useState } from 'react';
import { loginApi } from '../lib/loginApi';
import { LoginRequest } from './types';
import { TokenService } from '@/shared/lib/token';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      // loginApi.login이 이미 response.data를 반환하므로 바로 구조분해할당
      const { accessToken, refreshToken, ...user } =
        await loginApi.login(credentials);

      TokenService.setAccessToken(accessToken);
      TokenService.setRefreshToken(refreshToken);

      return user;
    } catch (err) {
      setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
