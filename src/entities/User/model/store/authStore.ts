import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TokenService } from '@/shared/lib/token';
import { User } from '@/entities/User/model/types';

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;

  setAuth: (
    tokens: { accessToken: string; refreshToken: string },
    user: User
  ) => void;
  logout: () => void;
  updateTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: !!TokenService.getAccessToken(),
      accessToken: TokenService.getAccessToken(),
      refreshToken: TokenService.getRefreshToken(),
      user: null,

      setAuth: (tokens, user) => {
        TokenService.setAccessToken(tokens.accessToken);
        TokenService.setRefreshToken(tokens.refreshToken);
        set({
          isAuthenticated: true,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user,
        });
      },

      logout: () => {
        TokenService.clearTokens();
        set({
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
          user: null,
        });
      },

      updateTokens: (tokens) => {
        TokenService.setAccessToken(tokens.accessToken);
        TokenService.setRefreshToken(tokens.refreshToken);
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
