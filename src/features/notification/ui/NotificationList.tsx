import { useQueryClient } from '@tanstack/react-query'; // 추가
import styled from 'styled-components';
import { NotificationItem } from '@/features/notification/ui/NotificationItem';
import { useRespondToFriendRequest } from '@/features/freind/lib/quries';
import { Notification } from '@/features/notification/model/types';
import {
  useNotifications,
  useReceivedFriendRequests,
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

      const updatedNotification = {
        ...notification,
        status: 'ACCEPTED' as const,
      };

      queryClient.setQueryData(['notifications', 'list', 0], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          content: old.content.map((n: Notification) =>
            n.notificationId === notification.notificationId
              ? updatedNotification
              : n
          ),
        };
      });

      await respondToRequest.mutateAsync({
        requestId: request.id,
        status: 'ACCEPTED',
      });
    } catch (error) {
      console.error('친구 수락 실패:', error);
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

      const updatedNotification = {
        ...notification,
        status: 'REJECTED' as const,
      };

      queryClient.setQueryData(['notifications', 'list', 0], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          content: old.content.map((n: Notification) =>
            n.notificationId === notification.notificationId
              ? updatedNotification
              : n
          ),
        };
      });

      await respondToRequest.mutateAsync({
        requestId: request.id,
        status: 'REJECTED',
      });
    } catch (error) {
      console.error('친구 거절 실패:', error);
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
