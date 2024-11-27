import axios from 'axios';
import { API_CONFIG } from '@/shared/config';
import { UserInfo } from '../model/types';

export const userApi = {
  getUserInfo: async (): Promise<UserInfo> => {
    const response = await axios.get(`${API_CONFIG.baseURL}/member/my-info`);
    return response.data;
  },
};
