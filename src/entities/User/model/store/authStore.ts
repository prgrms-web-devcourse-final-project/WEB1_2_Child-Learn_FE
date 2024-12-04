import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TokenService } from '@/shared/lib/token';
import { User } from '@/entities/User/model/types';
import { logoutApi } from '@/features/mypage/api/logoutApi';
import { isTokenExpiringSoon, silentRefresh } from '@/entities/User/lib/tokenUtils';

let refreshTimer: NodeJS.Timeout | null = null;

const startTokenRefreshTimer = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }

  refreshTimer = setInterval(() => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken && isTokenExpiringSoon(accessToken)) {
      silentRefresh();
    }
  }, 60 * 1000); // 1분마다 체크
};

const stopTokenRefreshTimer = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
};

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: User | null;
  setAuth: (
    tokens: { accessToken: string; refreshToken: string },
    user: User
  ) => void;
  logout: () => Promise<void>;
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
        startTokenRefreshTimer();
      },

      logout: async () => {
        try {
          await logoutApi.logout();
        } catch (error) {
          console.error('Logout failed:', error);
        } finally {
          stopTokenRefreshTimer();
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
