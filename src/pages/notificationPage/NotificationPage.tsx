import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import backIcon from '/img/exit.png';
import checkIcon from '/img/box-check.png';
import { useMarkAllAsRead } from '@/features/notification/lib/queries';
import { NotificationList } from '@/features/notification/ui/NotificationList';

const NotificationPage = () => {
  const navigate = useNavigate();
  const { mutateAsync: markAllAsRead } = useMarkAllAsRead();

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('전체 읽음 처리 실패:', error);
    }
  };

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <IconImage src={backIcon} alt="back" />
        </BackButton>
        <PageTitle>
          <img src="/img/3d-bell.png" alt="bell" width="24" height="24" />
          알림
        </PageTitle>
        <CheckButton onClick={handleMarkAllAsRead}>
          <IconImage src={checkIcon} alt="check all" />
        </CheckButton>
      </Header>
      <NotificationList />
    </PageContainer>
  );
};

const PageContainer = styled.div`
  padding: 20px;
  height: 100vh;
  background-color: #fff;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
`;

const PageTitle = styled.h1`
  font-size: 17px;
  font-weight: 700;
  color: #181818;
  display: flex;
  align-items: center;
  gap: 4px;
`;
const BackButton = styled.button`
  border: none;
  background: none;
  padding: 8px;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

const CheckButton = styled.button`
  border: none;
  background: none;
  padding: 8px;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

const IconImage = styled.img`
  width: 20px;
  height: 20px;
`;

export default NotificationPage;
