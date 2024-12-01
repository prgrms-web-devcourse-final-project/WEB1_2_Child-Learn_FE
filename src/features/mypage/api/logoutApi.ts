import axios from 'axios';
import { baseApi } from '@/shared/api/base';
import { API_CONFIG } from '@/shared/config';

export const logoutApi = {
  logout: async () => {
    try {
      const response = await baseApi.post(API_CONFIG.endpoints.logout);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error('로그아웃에 실패했습니다.');
    }
  },
};
