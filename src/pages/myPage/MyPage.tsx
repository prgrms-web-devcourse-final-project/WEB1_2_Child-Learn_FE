import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Profile from '@/features/mypage/ui/Profile';
import { userApi } from '@/entities/User/api/userApi';
import { UserInfo } from '@/entities/User/model/types';

const MyPage = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        {userInfo && <Profile userInfo={userInfo} onEditClick={handleEditClick} />}
      </ContentContainer>
    </PageContainer>
  );
};

export default MyPage;

const PageContainer = styled.div`
  background: linear-gradient(
    to bottom,
    #def9c4 0%,
    #def9c4 40%,
    white 40%,
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
