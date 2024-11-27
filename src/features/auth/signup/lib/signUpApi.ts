import axios from 'axios';
import { baseApi } from '@/shared/api/base';
import { JoinRequest, JoinResponse } from '../model/types';

export const signUpApi = {
  join: async (data: JoinRequest): Promise<JoinResponse> => {
    try {
      const response = await baseApi.post<JoinResponse>('/member/join', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error('회원가입에 실패했습니다.');
    }
  },
};
