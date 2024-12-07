// features/notification/ui/NotificationList.tsx
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { NotificationItem } from '@/features/notification/ui/NotificationItem';
import { notificationApi } from '@/features/notification/api/notificationApi';

export const NotificationList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getNotifications(),
  });

  const handleAccept = async (notificationId: number) => {
    try {
      // TODO: 친구 수락 API 호출
      console.log('수락:', notificationId);
    } catch (error) {
      console.error('친구 수락 실패:', error);
    }
  };

  const handleReject = async (notificationId: number) => {
    try {
      // TODO: 친구 거절 API 호출
      console.log('거절:', notificationId);
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
