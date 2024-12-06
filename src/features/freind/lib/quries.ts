import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { friendApi } from '@/features/freind/api/friendApi';

export const FRIEND_KEYS = {
  all: ['friends'] as const,
  list: () => [...FRIEND_KEYS.all, 'list'] as const,
  detail: (id: number) => [...FRIEND_KEYS.all, 'detail', id] as const,
};

export const useFriends = () => {
  return useQuery({
    queryKey: FRIEND_KEYS.list(),
    queryFn: friendApi.getFriendsList,
  });
};

export const useRemoveFriend = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: friendApi.removeFriend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIEND_KEYS.list() });
    },
    onError: (error) => {
      console.error('친구 삭제 실패:', error);
      // TODO: 에러 처리 (토스트 메시지 등)
    },
  });
};