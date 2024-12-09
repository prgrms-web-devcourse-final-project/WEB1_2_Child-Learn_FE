import styled from 'styled-components';
import { Notification } from '@/features/notification/model/types';
import { useDeleteNotification } from '@/features/notification/lib/queries';

interface NotificationItemProps {
  notification: Notification;
  onAccept: (notification: Notification) => void;
  onReject: (notification: Notification) => void;
}

export const NotificationItem = ({
  notification,
  onAccept,
  onReject,
}: NotificationItemProps) => {
  const { mutateAsync: deleteNotification } = useDeleteNotification();

  const handleAccept = async () => {
    if (
      notification.status === 'ACCEPTED' ||
      notification.status === 'REJECTED'
    ) {
      return;
    }

    try {
      await onAccept(notification);
    } catch (error) {
      console.error('친구 수락 실패:', error);
    }
  };

  const handleReject = async () => {
    if (
      notification.status === 'ACCEPTED' ||
      notification.status === 'REJECTED'
    ) {
      return;
    }

    try {
      await onReject(notification);
    } catch (error) {
      console.error('친구 거절 실패:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNotification(notification.notificationId);
    } catch (error) {
      console.error('알림 삭제 실패:', error);
    }
  };

  const renderFriendRequestActions = () => {
    switch (notification.status) {
      case 'ACCEPTED':
        return <StatusMessage>친구 수락이 완료되었습니다.</StatusMessage>;
      case 'REJECTED':
        return <StatusMessage>친구 요청을 거절하였습니다.</StatusMessage>;
      default:
        return (
          <ButtonGroup>
            <ActionButton $isAccept onClick={handleAccept}>
              수락하기
            </ActionButton>
            <ActionButton onClick={handleReject}>거절하기</ActionButton>
          </ButtonGroup>
        );
    }
  };

  const renderMessage = () => {
    switch (notification.type) {
      case 'FRIEND_REQUEST':
        return (
          <>
            <Message>
              <Username>{notification.senderUsername}</Username>님이 친구 요청을
              보냈습니다.
            </Message>
            {renderFriendRequestActions()}
          </>
        );
      case 'FRIEND_ACCEPT':
        return (
          <Message>
            <Username>{notification.senderUsername}</Username>님이 친구 요청을
            수락했습니다.
          </Message>
        );
      case 'MESSAGE':
        return (
          <Message>
            <Username>{notification.senderUsername}</Username>님이 메시지를
            보냈습니다: {notification.content}
          </Message>
        );
    }
  };

  return (
    <ItemContainer $isRead={notification.isRead}>
      <DeleteButton onClick={handleDelete}>
        <img src="/img/close.png" alt="delete" width="16" height="16" />
      </DeleteButton>
      <ProfileContainer>
        <ProfileImage
          src={notification.profileImageUrl || '/img/basic-profile.png'}
          alt="profile"
        />
      </ProfileContainer>
      <ContentContainer>
        {renderMessage()}
        <Time>{notification.elapsedTime}</Time>
      </ContentContainer>
    </ItemContainer>
  );
};

const ItemContainer = styled.div<{ $isRead: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
  background: ${(props) => (props.$isRead ? 'white' : '#f8f9ff')};
`;

const ProfileContainer = styled.div`
  position: relative;
  margin-right: 12px;
  align-self: flex-start;
  margin-top: 4px;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const ContentContainer = styled.div`
  flex: 1;
  min-width: 0;
`;

const Message = styled.p`
  margin: 0 0 4px 0;
  font-size: 13px;
  color: #181818;
`;

const Time = styled.span`
  font-size: 9px;
  font-weight: 700;
  color: #999;
  margin-top: 8px;
  display: block;
`;

const ButtonGroup = styled.div`
  display: flex;
  margin-top: 8px;
  gap: 8px;
`;

const ActionButton = styled.button<{ $isAccept?: boolean }>`
  padding: 3px 10px;
  border-radius: 6px;
  border: 1px solid ${(props) => (props.$isAccept ? '#50B498' : '#E0E0E0')};
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  background-color: ${(props) => (props.$isAccept ? '#50B498' : 'white')};
  color: ${(props) => (props.$isAccept ? 'white' : '#181818')};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.$isAccept ? '#45A087' : '#F5F5F5')};
  }

  &:focus {
    outline: none;
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

const Username = styled.span`
  font-weight: 700;
`;

const StatusMessage = styled.p`
  margin-top: 8px;
  font-size: 12px;
  color: #666;
`;
