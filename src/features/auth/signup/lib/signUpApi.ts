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
        // 백엔드에서 보내는 에러 메시지를 field와 함께 처리
        const errorData = error.response.data;

        // 각 중복 에러 케이스에 대한 처리
        if (errorData.code === 'LOGINID_IS_DUPLICATED') {
          throw { field: 'loginId', message: '이미 사용 중인 아이디입니다.' };
        }
        if (errorData.code === 'EMAIL_IS_DUPLICATED') {
          throw { field: 'email', message: '이미 사용 중인 이메일입니다.' };
        }
        if (errorData.code === 'USERNAME_IS_DUPLICATED') {
          throw { field: 'username', message: '이미 사용 중인 닉네임입니다.' };
        }

        // 기타 에러
        throw new Error(errorData.message || '회원가입에 실패했습니다.');
      }
      throw new Error('회원가입에 실패했습니다.');
    }
  },
};
