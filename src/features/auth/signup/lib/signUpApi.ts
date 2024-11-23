import axios from 'axios';
import { JoinRequest, JoinResponse } from '../model/types';
import { BASE_URL } from '@/shared/api/base';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const signUpApi = {
  join: async (data: JoinRequest): Promise<JoinResponse> => {
    try {
      const response = await api.post<JoinResponse>('/member/join', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error('회원가입에 실패했습니다.');
    }
  },
};
