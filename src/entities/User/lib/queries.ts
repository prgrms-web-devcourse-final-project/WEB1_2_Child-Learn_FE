import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { userApi } from '../api/userApi';
import { useAuthStore } from '@/entities/User/model/store/authStore';
import { UserInfo } from '../model/types';
import { silentRefresh } from '@/features/auth/login/lib/setupInterceptors';

export const useUserInfo = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [isTokenValidated, setIsTokenValidated] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      // 이미 토큰이 있다면 리프레시 불필요
      if (accessToken) {
        setIsTokenValidated(true);
        return;
      }

      // 토큰이 없을 때만 리프레시 시도
      try {
        await silentRefresh();
      } catch (error) {
        console.error('Token refresh failed:', error);
      } finally {
        setIsTokenValidated(true);
      }
    };

    initializeAuth();
  }, [accessToken]); // accessToken이 변경될 때만 실행

  const query = useQuery<UserInfo, Error>({
    queryKey: ['userInfo'],
    queryFn: userApi.getUserInfo,
    staleTime: 1000 * 60, // 1분
    enabled: isAuthenticated && isTokenValidated,
    retry: (failureCount, error: any) => {
      if (error.response?.status === 401) return false;
      return failureCount < 3;
    },
    initialData: () => {
      const cachedData = localStorage.getItem('user-info');
      if (cachedData) {
        try {
          return JSON.parse(cachedData);
        } catch {
          return undefined;
        }
      }
      return undefined;
    },
  });

  // data가 변경될 때마다 localStorage 업데이트
  useEffect(() => {
    if (query.data) {
      localStorage.setItem('user-info', JSON.stringify(query.data));
    }
  }, [query.data]);

  return query;
};
