import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { NotificationItem } from '@/features/notification/ui/NotificationItem';
import { notificationApi } from '@/features/notification/api/notificationApi';
import { useRespondToFriendRequest } from '@/features/freind/lib/quries';

export const NotificationList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getNotifications(),
  });

  const respondToRequest = useRespondToFriendRequest();

  const handleAccept = async (notificationId: number) => {
    try {
      await respondToRequest.mutateAsync({
        requestId: notificationId,
        status: 'ACCEPT',
      });
    } catch (error) {
      console.error('친구 수락 실패:', error);
    }
  };

  const handleReject = async (notificationId: number) => {
    try {
      await respondToRequest.mutateAsync({
        requestId: notificationId,
        status: 'REJECT',
      });
    } catch (error) {
      console.error('친구 거절 실패:', error);
    }
  };

  if (isLoading) return <LoadingContainer>로딩중...</LoadingContainer>;

  return (
    <ListContainer>
      {data?.content.map((notification) => (
        <NotificationItem
          key={notification.notificationId}
          notification={notification}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      ))}
      {data?.content.length === 0 && (
        <EmptyMessage>알림이 없습니다.</EmptyMessage>
      )}
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