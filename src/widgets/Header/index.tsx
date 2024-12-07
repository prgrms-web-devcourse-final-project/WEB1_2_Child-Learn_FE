import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { notificationApi } from '@/features/notification/api/notificationApi';

const Header = () => {
  const navigate = useNavigate();
  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getNotifications(),
  });

  const hasUnreadNotifications =
    notifications?.content?.some((notification) => !notification.isRead) ??
    false; // notifications이 undefined일 때 false 반환

  const handleChatClick = () => {
    navigate('/chat');
  };

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  return (
    <HeaderContainer>
      <LogoLink to="/main">
        <Logo src="/img/logo.png" alt="Logo" />
      </LogoLink>
      <IconsWrapper>
        <IconButton onClick={handleChatClick}>
          <Icon src="/img/chat.png" alt="Chat" />
        </IconButton>
        <NotificationButton onClick={handleNotificationClick}>
          <Icon src="/img/bell.png" alt="Notifications" />
          {hasUnreadNotifications && <NotificationBadge />}
        </NotificationButton>
      </IconsWrapper>
    </HeaderContainer>
  );
};

export default Header;

// 스타일 컴포넌트 정의
const HeaderContainer = styled.header`
  width: 100%;
  height: 40px;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px 0 10px;
  top: 0;
  left: 0;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.05);
`;

const LogoLink = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  height: 30px;
  width: auto;
  margin-left: -4px;
`;
const IconsWrapper = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:focus {
    outline: none;
  }
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
`;

const NotificationButton = styled(IconButton)`
  position: relative;
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background-color: #ff4444;
  border-radius: 50%;
`;
