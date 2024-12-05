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
      mutationFn: (userId: number) => checkAttendance(userId),
      onSuccess: (data) => {
        setIsAttendanceChecked(true);
        showToast.success(
          `출석체크 완료! ${data.currentPoints} 포인트가 적립되었습니다.`
        );
        queryClient.invalidateQueries({ queryKey: ['userInfo'] });
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          // 출석체크에 대한 특정 에러 처리
          if (error.response?.data?.code === 'ATTENDANCE_001') {
            showToast.error('오늘은 이미 출석체크를 하셨습니다.');
          } else {
            // 다른 모든 에러는 일반적인 출석체크 실패 메시지로
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
