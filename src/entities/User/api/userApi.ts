import { baseApi } from '@/shared/api/base';
import { UserInfo } from '../model/types';

export const userApi = {
  getUserInfo: async (): Promise<UserInfo> => {
    const response = await baseApi.get('/member/my-info'); // baseApi 사용, 경로는 /member/my-info만
    return response.data;
  },
};
