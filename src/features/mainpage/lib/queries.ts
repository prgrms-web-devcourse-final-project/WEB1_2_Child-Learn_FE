import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { checkAttendance } from '@/features/mainpage/api/attendanceApi';
import { AttendanceResponse } from '@/features/mainpage/model/types';
import showToast from '@/shared/lib/toast';
import axios from 'axios';

export const useAttendance = () => {
  const queryClient = useQueryClient();
  const [isAttendanceChecked, setIsAttendanceChecked] = useState(false);

  return {
    attendanceMutation: useMutation<AttendanceResponse, Error, number>({
      mutationFn: (userId: number) => {
        if (isAttendanceChecked) {
          return Promise.reject(new Error('ALREADY_CHECKED'));
        }
        return checkAttendance(userId);
      },
      onSuccess: async (data) => {
        setIsAttendanceChecked(true);
        showToast.success(
          `출석체크 완료! ${data.currentPoints} 포인트가 적립되었습니다.`
        );
        // userInfo만 갱신하고 다른 쿼리는 건들지 않음
        await queryClient.invalidateQueries({
          queryKey: ['userInfo'],
          exact: true,
        });
      },
      onError: (error) => {
        if (error.message === 'ALREADY_CHECKED') {
          return; // 이미 체크된 상태에서의 호출은 무시
        }
        if (axios.isAxiosError(error)) {
          if (error.response?.data?.code === 'ATTENDANCE_001') {
            showToast.error('오늘은 이미 출석체크를 하셨습니다.');
          } else {
            showToast.error('출석체크에 실패했습니다.');
          }
        } else {
          showToast.error('출석체크에 실패했습니다.');
        }
      },
    }),
    isAttendanceChecked,
  };
};
