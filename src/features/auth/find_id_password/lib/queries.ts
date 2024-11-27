import { useMutation } from '@tanstack/react-query';
import { findId, resetPassword } from '../api/accountRecovery';
import { FindIdRequest, ResetPasswordRequest } from '../model/types';
import showToast from '@/shared/lib/toast';
import axios from 'axios';

export const useFindId = () => {
  return useMutation({
    mutationFn: (data: FindIdRequest) => findId(data),
    onSuccess: () => {
      showToast.success('아이디를 이메일로 전송했습니다.');
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        showToast.error(
          error.response?.data?.message || '아이디 찾기에 실패했습니다.'
        );
      } else {
        showToast.error('아이디 찾기에 실패했습니다.');
      }
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => resetPassword(data),
    onSuccess: () => {
      showToast.success('임시 비밀번호를 이메일로 전송했습니다.');
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        showToast.error(
          error.response?.data?.message || '비밀번호 재설정에 실패했습니다.'
        );
      } else {
        showToast.error('비밀번호 재설정에 실패했습니다.');
      }
    },
  });
};
