import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutApi } from '../api/logoutApi';
import { useAuthStore } from '@/entities/User/model/store/authStore';
import { useNavigate } from 'react-router-dom';

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
