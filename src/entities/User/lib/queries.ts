import { useQuery } from '@tanstack/react-query';
import { userApi } from '../api/userApi';
import { useAuthStore } from '@/entities/User/model/store/authStore';
import { UserInfo } from '../model/types'; // UserInfo 타입 추가

export const useUserInfo = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<UserInfo, Error>({
    queryKey: ['userInfo'],
    queryFn: userApi.getUserInfo,
    staleTime: 1000 * 60, // 1분
    enabled: isAuthenticated,
    retry: (failureCount, error: any) => {
      // 401 에러는 retry 하지 않음 (인터셉터가 처리)
      if (error.response?.status === 401) return false;
      return failureCount < 3; // 다른 에러는 3번까지 retry
    },
  });
};
