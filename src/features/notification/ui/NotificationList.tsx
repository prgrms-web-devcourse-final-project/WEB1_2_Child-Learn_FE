import { useQueryClient } from '@tanstack/react-query'; // 추가
import styled from 'styled-components';
import { NotificationItem } from '@/features/notification/ui/NotificationItem';
import { useRespondToFriendRequest } from '@/features/freind/lib/quries';
import { Notification } from '@/features/notification/model/types';
import {
  useNotifications,
  useReceivedFriendRequests,
  NOTIFICATION_KEYS,
} from '@/features/notification/lib/queries';

export const NotificationList = () => {
  const queryClient = useQueryClient();
  const { data } = useNotifications(0);
  const { data: receivedRequests } = useReceivedFriendRequests();
  const respondToRequest = useRespondToFriendRequest();

  const handleAccept = async (notification: Notification) => {
    try {
      const request = receivedRequests?.find(
        (req) => req.senderUsername === notification.senderUsername
      );

      if (!request) {
        throw new Error('해당하는 친구 요청을 찾을 수 없습니다.');
      }

      // 즉시 UI 상태 업데이트
      const updatedNotification = {
        ...notification,
        status: 'ACCEPTED' as const,
      };

      // 낙관적 업데이트
      queryClient.setQueryData(['notifications', 'list', 0], (old: any) => {
        if (!old) return old;
        const newData = {
          ...old,
          content: old.content.map((n: Notification) =>
            n.notificationId === notification.notificationId
              ? updatedNotification
              : n
          ),
        };
        return newData;
      });

      // 서버 요청 처리
      await respondToRequest.mutateAsync({
        requestId: request.id,
        status: 'ACCEPTED',
      });

      // 다른 쿼리들의 무효화는 유지 (친구 목록 등이 업데이트 되어야 하므로)
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_KEYS.friendRequests,
      });
    } catch (error) {
      console.error('친구 수락 실패:', error);
      // 실패시에만 쿼리 무효화하여 원래 상태로 복구
      queryClient.invalidateQueries({
        queryKey: ['notifications', 'list', 0],
      });
    }
  };

  const handleReject = async (notification: Notification) => {
    try {
      const request = receivedRequests?.find(
        (req) => req.senderUsername === notification.senderUsername
      );

      if (!request) {
        throw new Error('해당하는 친구 요청을 찾을 수 없습니다.');
      }

      // 즉시 UI 상태 업데이트
      const updatedNotification = {
        ...notification,
        status: 'REJECTED' as const,
      };

      // 낙관적 업데이트
      queryClient.setQueryData(['notifications', 'list', 0], (old: any) => {
        if (!old) return old;
        const newData = {
          ...old,
          content: old.content.map((n: Notification) =>
            n.notificationId === notification.notificationId
              ? updatedNotification
              : n
          ),
        };
        return newData;
      });

      // 서버 요청 처리
      await respondToRequest.mutateAsync({
        requestId: request.id,
        status: 'REJECTED',
      });

      // 다른 쿼리들의 무효화는 유지
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_KEYS.friendRequests,
      });
    } catch (error) {
      console.error('친구 거절 실패:', error);
      // 실패시에만 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['notifications', 'list', 0],
      });
    }
  };

  // 나머지 코드는 동일
  if (!data || !data.content) {
    return <EmptyMessage>알림이 없습니다.</EmptyMessage>;
  }

  return (
    <ListContainer>
      {data.content.map((notification) => (
        <NotificationItem
          key={notification.notificationId}
          notification={notification}
          onAccept={() => handleAccept(notification)}
          onReject={() => handleReject(notification)}
        />
      ))}
    </ListContainer>
  );
};

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const EmptyMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #999;
`;
