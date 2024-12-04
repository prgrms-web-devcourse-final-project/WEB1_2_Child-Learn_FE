import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Profile from '@/features/mypage/ui/Profile';
import Character from '@/features/mypage/ui/Character';
import MenuList from '@/features/mypage/ui/MenuList';
import { MENU_ITEMS } from '@/features/mypage/model/types';
import { useLogout } from '@/features/mypage/lib/queries';
import { useUserInfo } from '@/entities/User/lib/queries';

const MyPage = () => {
 const navigate = useNavigate();
 const { data: userInfo, isLoading, error } = useUserInfo();
 const { mutate: logout, isPending: isLoggingOut } = useLogout();

 const handleCustomizeClick = () => {
   navigate('/avatar');
 };

 const handleEditClick = () => {
   console.log('회원정보 수정 클릭');
 };

 return (
   <PageContainer>
     <ContentContainer>
       {isLoading && <div>로딩 중...</div>}
       {error && <div>사용자 정보를 불러오는데 실패했습니다.</div>}
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
   background: #ff6b6b;
 }

 &:disabled {
   cursor: not-allowed;
   opacity: 0.5;
 }
`;
