import { useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { NotificationItem } from '@/features/notification/ui/NotificationItem';
import { useRespondToFriendRequest } from '@/features/freind/lib/quries';
import {
  Notification,
  NotificationResponse,
} from '@/features/notification/model/types';
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

  const updateNotificationCache = (
    notification: Notification,
    newStatus: 'ACCEPTED' | 'REJECTED'
  ) => {
    const updatedNotification = {
      ...notification,
      status: newStatus,
    };

    queryClient.setQueryData<NotificationResponse>(
      NOTIFICATION_KEYS.list(0),
      (old) => {
        if (!old) return undefined;
        return {
          ...old,
          content: old.content.map((n) =>
            n.notificationId === notification.notificationId
              ? updatedNotification
              : n
          ),
        };
      }
    );

    // 캐시 설정이 즉시 반영되도록 보장
    queryClient.setQueriesData(
      { queryKey: NOTIFICATION_KEYS.list(0) },
      (old: any) => {
        if (!old) return old;
        return {
          ...old,
          content: old.content.map((n: Notification) =>
            n.notificationId === notification.notificationId
              ? updatedNotification
              : n
          ),
        };
      }
    );
  };

  const handleAccept = async (notification: Notification) => {
    try {
      const request = receivedRequests?.find(
        (req) => req.senderUsername === notification.senderUsername
      );

      if (!request) {
        throw new Error('해당하는 친구 요청을 찾을 수 없습니다.');
      }

      // 먼저 UI 업데이트
      updateNotificationCache(notification, 'ACCEPTED');

      // 서버 요청
      await respondToRequest.mutateAsync({
        requestId: request.id,
        status: 'ACCEPTED',
      });

      // 성공 시 캐시 유지를 위해 refetch 방지
      queryClient.cancelQueries({ queryKey: NOTIFICATION_KEYS.list(0) });
    } catch (error) {
      console.error('친구 수락 실패:', error);
      // 실패시에만 쿼리 무효화하여 원래 상태로 복구
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_KEYS.list(0),
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

      // 먼저 UI 업데이트
      updateNotificationCache(notification, 'REJECTED');

      // 서버 요청
      await respondToRequest.mutateAsync({
        requestId: request.id,
        status: 'REJECTED',
      });

      // 성공 시 캐시 유지를 위해 refetch 방지
      queryClient.cancelQueries({ queryKey: NOTIFICATION_KEYS.list(0) });
    } catch (error) {
      console.error('친구 거절 실패:', error);
      // 실패시에만 쿼리 무효화하여 원래 상태로 복구
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_KEYS.list(0),
      });
    }
  };

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

export default NotificationList;
