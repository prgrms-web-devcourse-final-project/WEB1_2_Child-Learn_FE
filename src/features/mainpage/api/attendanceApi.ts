import { baseApi } from '@/shared/api/base';
import { AttendanceResponse } from '@/features/mainpage/model/types';

export const checkAttendance = async (
  userId: number
): Promise<AttendanceResponse> => {
  const response = await baseApi.post('/wallet/attendance', {
    memberId: userId,
    points: 100, // API 스펙에 맞춰 포함
    isCheckIn: true,
  });          
  return response.data;
};
