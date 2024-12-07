import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { friendApi } from '@/features/freind/api/friendApi';
import { Friend } from '@/features/freind/model/types';
import showToast from '@/shared/lib/toast';

interface FriendListResponse {
  content: Friend[];
  totalElements: number;
  totalPages: number;
  last: boolean;
  number: number;
  size: number;
  empty: boolean;
}

export const FRIEND_KEYS = {
  all: ['friends'] as const,
  list: (page: number, searchKeyword?: string) =>
    [...FRIEND_KEYS.all, 'list', page, searchKeyword] as const,
};

export const useFriendList = (searchKeyword: string, page: number = 0) => {
  return useQuery<FriendListResponse>({
    queryKey: FRIEND_KEYS.list(page, searchKeyword),
    queryFn: () => friendApi.getFriendsList(page, 8, searchKeyword),
    // enabled 조건 제거 - 항상 쿼리 실행되도록
    staleTime: 1000 * 60,
  });
};

export const useRemoveFriend = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: friendApi.removeFriend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIEND_KEYS.all });
      showToast.success('친구가 삭제되었습니다.');
    },
    onError: () => {
      showToast.error('친구 삭제에 실패했습니다.');
    },
  });
};

// 새로 추가하는 친구 요청 응답 hook
export const useRespondToFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: friendApi.respondToFriendRequest,
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: FRIEND_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      showToast.success(
        status === 'ACCEPT'
          ? '친구 요청을 수락했습니다.'
          : '친구 요청을 거절했습니다.'
      );
    },
    onError: () => {
      showToast.error('친구 요청 처리에 실패했습니다.');
    },
  });
};
