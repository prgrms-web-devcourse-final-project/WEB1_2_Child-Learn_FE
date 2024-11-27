import axios from 'axios';
import { baseApi } from '@/shared/api/base';
import { API_CONFIG } from '@/shared/config';
import { LoginRequest, LoginResponse } from '../model/types';
import { User } from '@/entities/User/model/types';

interface RefreshResponse {
  accessToken: string;
  user: User; // User 타입은 기존 타입 사용
}

export const loginApi = {
  // 일반 로그인
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

  // refreshToken은 쿠키에서 자동 전송되므로 파라미터 제거
  refresh: async () => {
    try {
      const response = await baseApi.post<RefreshResponse>(
        API_CONFIG.endpoints.refresh
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
