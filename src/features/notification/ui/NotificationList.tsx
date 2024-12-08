import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { NotificationItem } from '@/features/notification/ui/NotificationItem';
import { notificationApi } from '@/features/notification/api/notificationApi';
import { useRespondToFriendRequest } from '@/features/freind/lib/quries';
import { Notification } from '@/features/notification/model/types';
import { NOTIFICATION_KEYS } from '@/features/notification/lib/queries'; // 추가
import { useReceivedFriendRequests } from '@/features/notification/lib/queries';
import { useNotificationSSE } from '@/features/notification/lib/useNotificationSSE';

export const NotificationList = () => {
  // SSE 연결 추가
  useNotificationSSE();
  const { data, isLoading, error } = useQuery({
    queryKey: NOTIFICATION_KEYS.list(0), // 쿼리 키 상수 사용
    queryFn: () => notificationApi.getNotifications(),
  });

  if (error) {
    console.error('알림 조회 에러:', error);
  }

  const respondToRequest = useRespondToFriendRequest();
  const { data: receivedRequests } = useReceivedFriendRequests(); // 추가

  const handleAccept = async (notification: Notification) => {
    try {
      const request = receivedRequests?.find(
        (req) => req.senderUsername === notification.senderUsername
      );

      if (!request) {
        throw new Error('해당하는 친구 요청을 찾을 수 없습니다.');
      }

      await respondToRequest.mutateAsync({
        requestId: request.id, // 실제 requestId 사용
        status: 'ACCEPTED',
      });
    } catch (error) {
      console.error('친구 수락 실패:', error);
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

      await respondToRequest.mutateAsync({
        requestId: request.id, // notification.notificationId가 아닌 request.id 사용
        status: 'REJECTED',
      });
    } catch (error) {
      console.error('친구 거절 실패:', error);
    }
  };

  if (isLoading) return <LoadingContainer>로딩중...</LoadingContainer>;
  if (!data?.content?.length)
    return <EmptyMessage>알림이 없습니다.</EmptyMessage>;

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
