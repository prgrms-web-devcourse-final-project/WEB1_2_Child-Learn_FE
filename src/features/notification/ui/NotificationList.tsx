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
  const { data, isLoading } = useNotifications(0);
  const { data: receivedRequests } = useReceivedFriendRequests();
  const respondToRequest = useRespondToFriendRequest();

  const handleAccept = async (notificationId: number) => {
    try {
      const notification = data?.content.find(
        (n) => n.notificationId === notificationId
      );
      const request = receivedRequests?.find(
        (req) => req.senderUsername === notification?.senderUsername
      );

      if (!request || !notification) {
        throw new Error('해당하는 친구 요청을 찾을 수 없습니다.');
      }

      await respondToRequest.mutateAsync({
        requestId: request.id,
        status: 'ACCEPTED',
      });

      queryClient.setQueryData(['notifications', 'list', 0], (old: any) => ({
        ...old,
        content: old.content.map((n: Notification) =>
          n.notificationId === notificationId ? { ...n, status: 'ACCEPTED' } : n
        ),
      }));
    } catch (error) {
      console.error('친구 수락 실패:', error);
    }
  };

  const handleReject = async (notificationId: number) => {
    try {
      const notification = data?.content.find(
        (n) => n.notificationId === notificationId
      );
      const request = receivedRequests?.find(
        (req) => req.senderUsername === notification?.senderUsername
      );

      if (!request || !notification) {
        throw new Error('해당하는 친구 요청을 찾을 수 없습니다.');
      }

      await respondToRequest.mutateAsync({
        requestId: request.id,
        status: 'REJECTED',
      });

      queryClient.setQueryData(['notifications', 'list', 0], (old: any) => ({
        ...old,
        content: old.content.map((n: Notification) =>
          n.notificationId === notificationId ? { ...n, status: 'REJECTED' } : n
        ),
      }));
    } catch (error) {
      console.error('친구 거절 실패:', error);
    }
  };

  if (isLoading && !data) {
    return <LoadingContainer>로딩중...</LoadingContainer>;
  }

  if (!data?.content?.length) {
    return <EmptyMessage>알림이 없습니다.</EmptyMessage>;
  }

  return (
    <ListContainer>
      {data.content.map((notification) => (
        <NotificationItem
          key={notification.notificationId}
          notification={notification}
          onAccept={() => handleAccept(notification.notificationId)} // notification -> notification.notificationId
          onReject={() => handleReject(notification.notificationId)} // notification -> notification.notificationId
        />
      ))}
    </ListContainer>
  );
};

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const LoadingContainer = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
`;

const EmptyMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #999;
`;
