import axios from 'axios';
import { FindIdRequest, ResetPasswordRequest } from '../model/types';
import { API_CONFIG } from '@/shared/config';

export const findId = async (data: FindIdRequest) => {
  const response = await axios.post(
    `${API_CONFIG.baseURL}${API_CONFIG.endpoints.findId}`,
    {
      email: data.email,
      birth: data.birth, // "YYYY-MM-DD" 형식으로 전송
    }
  );
  return response.data;
};

export const resetPassword = async (data: ResetPasswordRequest) => {
  const response = await axios.post(
    `${API_CONFIG.baseURL}${API_CONFIG.endpoints.resetPw}`,
    {
      loginId: data.loginId, // "loginId"로 키 이름 변경
      email: data.email,
    }
  );
  return response.data;
};
