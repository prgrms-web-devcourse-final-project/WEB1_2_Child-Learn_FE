import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TokenService } from '@/shared/lib/token';
import { User } from '@/entities/User/model/types';

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: User | null;

  setAuth: (
    tokens: { accessToken: string; refreshToken: string },
    user: User
  ) => void;
  logout: () => void;
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

      logout: () => {
        TokenService.clearTokens();
        set({
          isAuthenticated: false,
          accessToken: null,
          user: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }), // accessToken은 저장하지 않음
    }
  )
);
