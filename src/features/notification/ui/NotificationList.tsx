import styled from 'styled-components';
import { NotificationItem } from '@/features/notification/ui/NotificationItem';
import { useRespondToFriendRequest } from '@/features/freind/lib/quries';
import { Notification } from '@/features/notification/model/types';
import {
  useNotifications,
  useReceivedFriendRequests,
} from '@/features/notification/lib/queries';

export const NotificationList = () => {
  const { data } = useNotifications(0);
  const { data: receivedRequests } = useReceivedFriendRequests();
  const respondToRequest = useRespondToFriendRequest();

  const handleAccept = async (notification: Notification) => {
    if (
      notification.status === 'ACCEPTED' ||
      notification.status === 'REJECTED'
    ) {
      return;
    }

    const request = receivedRequests?.find(
      (req) => req.senderUsername === notification.senderUsername
    );

    if (!request) {
      console.error('해당하는 친구 요청을 찾을 수 없습니다.');
      return;
    }

    try {
      await respondToRequest.mutateAsync({
        requestId: request.id,
        status: 'ACCEPTED',
        notificationId: notification.notificationId,
        senderUsername: notification.senderUsername,
      });
    } catch (error) {
      console.error('친구 수락 실패:', error);
    }
  };

  const handleReject = async (notification: Notification) => {
    if (
      notification.status === 'ACCEPTED' ||
      notification.status === 'REJECTED'
    ) {
      return;
    }

    const request = receivedRequests?.find(
      (req) => req.senderUsername === notification.senderUsername
    );

    if (!request) {
      console.error('해당하는 친구 요청을 찾을 수 없습니다.');
      return;
    }

    try {
      await respondToRequest.mutateAsync({
        requestId: request.id,
        status: 'REJECTED',
        notificationId: notification.notificationId,
        senderUsername: notification.senderUsername,
      });
    } catch (error) {
      console.error('친구 거절 실패:', error);
    }
  };

  if (!data || !data.content) {
    return <EmptyMessage>알림이 없습니다.</EmptyMessage>;
  }

  return (
    <ListContainer>
      {data?.content.map((notification) => (
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
