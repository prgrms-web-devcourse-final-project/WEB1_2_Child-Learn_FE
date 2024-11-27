import { useMutation } from '@tanstack/react-query';
import { findId, resetPassword } from '../api/accountRecovery';
import { FindIdRequest, ResetPasswordRequest } from '../model/types';
import showToast from '@/shared/lib/toast';
import axios from 'axios';

export const useFindId = () => {
  return useMutation({
    mutationFn: (data: FindIdRequest) => findId(data),
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          showToast.error('일치하는 회원 정보가 없습니다.');
        } else {
          showToast.error(
            error.response?.data?.message || '아이디 찾기에 실패했습니다.'
          );
        }
      } else {
        showToast.error('아이디 찾기에 실패했습니다.');
      }
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => resetPassword(data),
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        showToast.error(
          error.response?.data?.message || '비밀번호 찾기에 실패했습니다.'
        );
      } else {
        showToast.error('비밀번호 찾기에 실패했습니다.');
      }
    },
  });
};
