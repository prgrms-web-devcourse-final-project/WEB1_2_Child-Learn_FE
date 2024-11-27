import axios from 'axios';
import { FindIdRequest, ResetPasswordRequest } from '../model/types';
import { API_CONFIG } from '@/shared/config';

export const findId = async (data: FindIdRequest) => {
  const response = await axios.post(
    `${API_CONFIG.baseURL}${API_CONFIG.endpoints.findId}`,
    data
  );
  return response.data;
};

export const resetPassword = async (data: ResetPasswordRequest) => {
  const response = await axios.post(
    `${API_CONFIG.baseURL}${API_CONFIG.endpoints.resetPw}`,
    data
  );
  return response.data;
};
