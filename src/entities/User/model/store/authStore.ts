import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TokenService } from '@/shared/lib/token';
import { User } from '@/entities/User/model/types';
import { logoutApi } from '@/features/mypage/api/logoutApi';

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: User | null;

  setAuth: (
    tokens: { accessToken: string; refreshToken: string },
    user: User
  ) => void;
  logout: () => Promise<void>; // Promise<void>로 변경
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      accessToken: null,
      user: null,

      setAuth: (tokens, user) => {
        TokenService.setRefreshToken(tokens.refreshToken);
        set({
          isAuthenticated: true,
          accessToken: tokens.accessToken,
          user,
        });
      },

      logout: async () => {
        try {
          // 서버에 로그아웃 요청
          await logoutApi.logout();
        } catch (error) {
          console.error('Logout failed:', error);
        } finally {
          // 로컬 상태 초기화
          TokenService.clearTokens();
          set({
            isAuthenticated: false,
            accessToken: null,
            user: null,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
      }),
    }
  )
);
