import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { friendApi } from '@/features/freind/api/friendApi';

const ITEMS_PER_PAGE = 8;

export const FRIEND_KEYS = {
  all: ['friends'] as const,
  list: () => [...FRIEND_KEYS.all, 'list'] as const,
};

export const useFriendList = (searchTerm: string) => {
  const [displayedItems, setDisplayedItems] = useState(ITEMS_PER_PAGE);

  const { data: allFriends = [], isLoading } = useQuery({
    queryKey: FRIEND_KEYS.list(),
    queryFn: friendApi.getFriendsList,
  });

  // 검색어로 필터링
  const filteredFriends = allFriends.filter(friend =>
    friend.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.loginId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 현재 화면에 보여줄 친구들
  const visibleFriends = filteredFriends.slice(0, displayedItems);
  const hasMore = displayedItems < filteredFriends.length;

  const loadMore = () => {
    setDisplayedItems(prev => prev + ITEMS_PER_PAGE);
  };

  const resetDisplayedItems = () => {
    setDisplayedItems(ITEMS_PER_PAGE);
  };

  return {
    friends: visibleFriends,
    isLoading,
    hasMore,
    loadMore,
    resetDisplayedItems,
    totalCount: filteredFriends.length
  };
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
    },
  });
};