import axios from 'axios';
import { baseApi } from '@/shared/api/base';
import { JoinRequest, JoinResponse } from '../model/types';

export const signUpApi = {
  join: async (data: JoinRequest): Promise<JoinResponse> => {
    try {
      const response = await baseApi.post<JoinResponse>('/member/join', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const errorMessage =
          error.response.data.message || '회원가입에 실패했습니다.';

        // 메시지 내용으로 어떤 중복 에러인지 판단
        if (errorMessage === '이미 존재하는 아이디입니다.') {
          throw { field: 'loginId', message: errorMessage };
        }
        if (errorMessage === '해당 이메일로 가입한 계정이 이미 존재합니다.') {
          throw { field: 'email', message: errorMessage };
        }
        if (errorMessage === '이미 존재하는 닉네임입니다.') {
          throw { field: 'username', message: errorMessage };
        }

        throw new Error(errorMessage);
      }
      throw new Error('회원가입에 실패했습니다.');
    }
  },
};
