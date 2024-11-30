import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Profile from '@/features/mypage/ui/Profile';
import Character from '@/features/mypage/ui/Character';
import MenuList from '@/features/mypage/ui/MenuList';
import { MENU_ITEMS } from '@/features/mypage/model/types';
import { userApi } from '@/entities/User/api/userApi';
import { UserInfo } from '@/entities/User/model/types';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '@/features/mypage/lib/queries'; // useLogout 추가

const MyPage = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { mutate: logout, isPending: isLoggingOut } = useLogout(); // useLogout 사용

  const handleCustomizeClick = () => {
    navigate('/avatar'); // 아바타 페이지의 경로로 이동
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsLoading(true);
        const data = await userApi.getUserInfo();
        setUserInfo(data);
      } catch (err) {
        setError('사용자 정보를 불러오는데 실패했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleEditClick = () => {
    console.log('회원정보 수정 클릭');
  };

  return (
    <PageContainer>
      <ContentContainer>
        {isLoading && <div>로딩 중...</div>}
        {error && <div>{error}</div>}
        {userInfo && (
          <Profile userInfo={userInfo} onEditClick={handleEditClick} />
        )}
        <Character onCustomizeClick={handleCustomizeClick} />
        <MenuList items={MENU_ITEMS} />
        <LogoutButtonContainer>
          <LogoutButton onClick={() => logout()} disabled={isLoggingOut}>
            {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
          </LogoutButton>
        </LogoutButtonContainer>
      </ContentContainer>
    </PageContainer>
  );
};

export default MyPage;

const PageContainer = styled.div`
  background: linear-gradient(
    to bottom,
    #def9c4 0%,
    #def9c4 39%,
    white 39%,
    white 100%
  );
  min-height: 100%;
  padding: 20px;
`;

const ContentContainer = styled.div`
  padding: 20px;
  position: relative;
  & > * {
    position: relative;
    z-index: 1;
  }
`;

const LogoutButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 18px;
`;

const LogoutButton = styled.button`
  width: 140px;
  padding: 5px;
  background: #ef5454;
  border: none;
  border-radius: 30px;
  color: white;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #ff6b6b; // 호버 시 약간 더 밝은 빨간색
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
