// NotificationItem.tsx
import styled from 'styled-components';

interface NotificationItemProps {
  notification: {
    notificationId: number;
    senderUsername: string;
    elapsedTime: string;
    isRead: boolean;
    type: 'FRIEND_REQUEST' | 'FRIEND_ACCEPT';
  };
  onAccept?: () => void;
  onReject?: () => void;
}

export const NotificationItem = ({
  notification,
  onAccept,
  onReject,
}: NotificationItemProps) => {
  return (
    <ItemContainer>
      <ProfileContainer>
        <ProfileImage />
      </ProfileContainer>
      <ContentContainer>
        <Message>
          {notification.senderUsername}님이 친구 요청을 보냈습니다.
        </Message>
        <Time>{notification.elapsedTime}</Time>
      </ContentContainer>
      {notification.type === 'FRIEND_REQUEST' && (
        <ButtonGroup>
          <ActionButton onClick={onAccept}>수락하기</ActionButton>
          <ActionButton onClick={onReject}>거절하기</ActionButton>
        </ButtonGroup>
      )}
    </ItemContainer>
  );
};

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
  background: white;
`;

const ProfileContainer = styled.div`
  margin-right: 12px;
`;

const ProfileImage = styled.div`
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
