import { useQuery, useMutation } from '@tanstack/react-query';
import { userApi } from '../api/userApi';
import showToast from '@/shared/lib/toast';
import { UserSearchResponse } from '@/features/search/model/types';

export const useSearchUsers = (username: string) => {
  return useQuery<UserSearchResponse, Error>({
    queryKey: ['userSearch', username],
    queryFn: () => userApi.searchUsers(username),
    enabled: !!username,
    staleTime: 1000 * 60,
  });
};

export const useSendFriendRequest = () => {
  return useMutation({
    mutationFn: userApi.sendFriendRequest,
    onSuccess: () => {
      showToast.success('친구 요청을 보냈습니다.');
    },
    onError: () => {
      showToast.error('친구 요청에 실패했습니다.');
    },
  });
};
