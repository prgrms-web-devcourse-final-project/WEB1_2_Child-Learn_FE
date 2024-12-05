import { useMutation, useQueryClient } from '@tanstack/react-query';
import { checkAttendance } from '@/features/mainpage/api/attendanceApi';
import { AttendanceResponse } from '@/features/mainpage/model/types';
import showToast from '@/shared/lib/toast';
import axios from 'axios';

export const useAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation<AttendanceResponse, Error>({
    mutationFn: checkAttendance,
    onSuccess: (data) => {
      showToast.success(
        `출석체크 완료! ${data.currentPoints} 포인트가 적립되었습니다.`
      );
      queryClient.invalidateQueries({ queryKey: ['userInfo'] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        showToast.error(
          error.response?.data?.message || '출석체크에 실패했습니다.'
        );
      } else {
        showToast.error('출석체크에 실패했습니다.');
      }
    },
  });
};
