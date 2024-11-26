import axios from 'axios';
import { baseApi } from '@/shared/api/base';
import { API_CONFIG } from '@/shared/config';
import { LoginRequest, LoginResponse, RefreshResponse } from '../model/types';

export const loginApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await baseApi.post<LoginResponse>(
        API_CONFIG.endpoints.login,
        data
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error('로그인에 실패했습니다.');
    }
  },

  refresh: async (refreshToken: string): Promise<RefreshResponse> => {
    try {
      const response = await baseApi.post<RefreshResponse>(
        API_CONFIG.endpoints.refresh,
        { refreshToken }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error('토큰 갱신에 실패했습니다.');
    }
  },
};
