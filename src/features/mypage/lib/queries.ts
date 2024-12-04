import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { logoutApi } from '@/features/mypage/api/logoutApi';
import { useAuthStore } from '@/entities/User/model/store/authStore';
import { useNavigate } from 'react-router-dom';
import { userApi } from '@/entities/User/api/userApi';
import { UserInfo } from '@/entities/User/model/types';
import { silentRefresh } from '@/features/auth/login/lib/setupInterceptors';
import { useEffect, useState } from 'react';

export const useMypageInfo = () => {
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
    staleTime: 1000 * 60,
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

  useEffect(() => {
    if (query.data) {
      localStorage.setItem('user-info', JSON.stringify(query.data));
    }
  }, [query.data]);

  return query;
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutApi.logout,
    onSuccess: () => {
      logout(); // 기존 authStore의 logout 함수 사용
      queryClient.removeQueries({ queryKey: ['userInfo'] }); // 유저 정보 캐시 제거
      navigate('/'); // 홈으로 리다이렉트
    },
    onError: (error) => {
      console.error('로그아웃 실패:', error);
    },
  });
};
