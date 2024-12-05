import { baseApi } from '@/shared/api/base';
import { AttendanceResponse } from '@/features/mainpage/model/types';

export const checkAttendance = async (): Promise<AttendanceResponse> => {
  const response = await baseApi.post('/wallet/attendance');
  return response.data;
};
