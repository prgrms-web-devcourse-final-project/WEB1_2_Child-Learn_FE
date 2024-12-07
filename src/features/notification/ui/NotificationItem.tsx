import styled from 'styled-components';
import { Notification } from '@/features/notification/model/types';
import { useDeleteNotification } from '@/features/notification/lib/queries';

interface NotificationItemProps {
  notification: Notification;
  onAccept: (notificationId: number) => void;
  onReject: (notificationId: number) => void;
}

export const NotificationItem = ({
  notification,
  onAccept,
  onReject,
}: NotificationItemProps) => {
  const { mutateAsync: deleteNotification } = useDeleteNotification();

  // 삭제 핸들러 추가
  const handleDelete = async () => {
    try {
      await deleteNotification(notification.notificationId);
    } catch (error) {
      console.error('알림 삭제 실패:', error);
    }
  };

  const renderMessage = () => {
    switch (notification.type) {
      case 'FRIEND_REQUEST':
        return (
          <>
            <Message>
              {notification.senderUsername}님이 친구 요청을 보냈습니다.
            </Message>
            <ButtonGroup>
              <ActionButton
                onClick={() => onAccept(notification.notificationId)}
              >
                수락하기
              </ActionButton>
              <ActionButton
                onClick={() => onReject(notification.notificationId)}
              >
                거절하기
              </ActionButton>
            </ButtonGroup>
          </>
        );
      case 'FRIEND_ACCEPT':
        return (
          <Message>
            {notification.senderUsername}님이 친구 요청을 수락했습니다.
          </Message>
        );
      case 'MESSAGE':
        return (
          <Message>
            {notification.senderUsername}님이 메시지를 보냈습니다:{' '}
            {notification.content}
          </Message>
        );
    }
  };

  return (
    <ItemContainer>
      <DeleteButton onClick={handleDelete}>
        <img src="/img/close.png" alt="delete" width="16" height="16" />
      </DeleteButton>
      <ProfileContainer>
        {notification.profileImageUrl ? (
          <ProfileImage src={notification.profileImageUrl} alt="profile" />
        ) : (
          <ProfileImagePlaceholder />
        )}
      </ProfileContainer>
      <ContentContainer>
        {renderMessage()}
        <Time>{notification.elapsedTime}</Time>
      </ContentContainer>
    </ItemContainer>
  );
};

const ItemContainer = styled.div`
  position: relative; // 추가
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
  background: white;
`;

const ProfileContainer = styled.div`
  margin-right: 12px;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const ProfileImagePlaceholder = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #eee;
`;

const ContentContainer = styled.div`
  flex: 1;
  min-width: 0;
`;

const Message = styled.p`
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #333;
`;

const Time = styled.span`
  font-size: 12px;
  color: #999;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-left: 12px;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  font-size: 12px;
  cursor: pointer;
  background-color: #f5f5f5;
  color: #333;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  &:focus {
    outline: none;
  }
`;
