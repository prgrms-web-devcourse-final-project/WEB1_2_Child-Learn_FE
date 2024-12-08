import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { NotificationItem } from '@/features/notification/ui/NotificationItem';
import { notificationApi } from '@/features/notification/api/notificationApi';
import { useRespondToFriendRequest } from '@/features/freind/lib/quries';
import { Notification } from '@/features/notification/model/types';

export const NotificationList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getNotifications(),
    select: (data) => {
      console.log('알림 데이터:', data);
      return data;
    },
  });

  console.log('현재 data:', data);
  console.log('isLoading:', isLoading);

  if (error) {
    console.error('알림 조회 에러:', error);
  }

  const respondToRequest = useRespondToFriendRequest();

  const handleAccept = async (notification: Notification) => {
    try {
      await respondToRequest.mutateAsync({
        requestId: notification.senderLoginId, // notificationId 대신 senderLoginId 사용
        status: 'ACCEPTED',
      });
    } catch (error) {
      console.error('친구 수락 실패:', error);
    }
  };

  const handleReject = async (notification: Notification) => {
    try {
      await respondToRequest.mutateAsync({
        requestId: notification.senderLoginId, // 여기도 마찬가지로 수정
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
          onAccept={() => handleAccept(notification)} // 전체 notification 객체 전달
          onReject={() => handleReject(notification)} // 전체 notification 객체 전달
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
