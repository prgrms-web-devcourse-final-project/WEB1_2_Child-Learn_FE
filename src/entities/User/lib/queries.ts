import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { userApi } from '../api/userApi';
import { useAuthStore } from '@/entities/User/model/store/authStore';
import { UserInfo } from '../model/types';
import { silentRefresh } from '@/features/auth/login/lib/setupInterceptors';

export const useUserInfo = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isTokenValidated, setIsTokenValidated] = useState(false);

  useEffect(() => {
    silentRefresh()
      .then(() => {
        setIsTokenValidated(true);
      })
      .catch(() => {
        setIsTokenValidated(true);
      });
  }, []);

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
