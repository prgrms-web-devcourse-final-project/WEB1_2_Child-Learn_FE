// pages/main/MainPage.tsx
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { InfoCard } from '@/shared/ui/InfoCard/InfoCard';
import { MenuCard } from '@/shared/ui/MenuCard/MenuCard';

const MainPage = () => {
 const navigate = useNavigate();

 const menuItems = [
   {
     title: '오늘은 어떤 그래프가\n기다리고 있을까요?',
     bgColor: '#6CC2A1',
     iconSrc: '/img/3d-graph.png',
     iconAlt: '그래프',
     path: '/graph',
     extended: true
   },
   {
     title: '누가 가장 투자를\n잘 할까요?',
     bgColor: '#FFA944',
     iconSrc: '/img/trophy.png',
     iconAlt: '트로피',
     path: '/ranking'
   },
   {
     title: '나를 멋있게\n꾸며봐요!',
     bgColor: '#FF497F',
     iconSrc: '/img/palette.png',
     iconAlt: '팔레트',
     path: '/customize'
   },
   {
     title: '재미는 게임도\n준비되어 있어요!',
     bgColor: '#29BAE2',
     iconSrc: '/img/gamepad.png',
     iconAlt: '게임패드',
     path: '/games',
     extended: true
   }
 ];

 return (
   <PageContainer>
     <ContentContainer>
       {/* 환영 메시지 & 포인트 */}
       <WelcomeSection>
         <WelcomeText>반가워요, 희주 님! 😊</WelcomeText>
         <PointBadge>
           2,000 P <PointIcon src="/img/coin.png" alt="포인트" />
         </PointBadge>
       </WelcomeSection>

       {/* 출석체크 카드 */}
       <InfoCard
         title="매일 출석하고\n10 Point 받기"
         actionText="출석하기"
         variant="primary"
       />

       {/* 메뉴 그리드 */}
       <MenuGrid>
      {menuItems.map((item, index) => (
        <MenuCard
          key={index}
          {...item}
          onClick={() => navigate(item.path)}
        />
      ))}
    </MenuGrid>

       {/* 하단 카드들 */}
       <InfoCard
         title="모의투자"
         description="조금 더 어려운 투자에 도전해 볼래요!"
         iconSrc="/img/chart.png"
         iconAlt="차트"
         onClick={() => navigate('/investment')}
       />

       <InfoCard
         title="친구목록"
         description="친구들과 같이 둘러보아요!"
         iconSrc="/img/friend.png"
         iconAlt="친구"
         onClick={() => navigate('/friends')}
       />
     </ContentContainer>
   </PageContainer>
 );
};

export default MainPage;

const PageContainer = styled.div`
 background-color: #def9c4;
 min-height: 100vh;
`;

const ContentContainer = styled.div`
 padding: 20px;
`;

const WelcomeSection = styled.div`
 display: flex;
 justify-content: space-between;
 align-items: center;
 margin-bottom: 24px;
`;

const WelcomeText = styled.h1`
 font-size: 20px;
 font-weight: 700;
 color: #333;
`;

const PointBadge = styled.div`
 display: flex;
 align-items: center;
 gap: 4px;
 background-color: #50B498;
 color: white;
 padding: 8px 16px;
 border-radius: 20px;
 font-weight: 500;
`;

const PointIcon = styled.img`
 width: 20px;
 height: 20px;
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);  // 2열 그리드
  gap: 12px;
  margin: 24px 0;

  // 첫 번째 카드 (그래프)
  > *:nth-child(1) {
    grid-column: 1 / 2;
    grid-row: 1 / 3;  // 2행 차지
    height: 150px;    // 큰 카드 높이
  }

  // 두 번째 카드 (트로피)
  > *:nth-child(2) {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
    height: 100px;
  }

  // 세 번째 카드 (팔레트)
  > *:nth-child(3) {
    grid-column: 1 / 2;
    grid-row: 2 / 3;  // 3 -> 2로 수정
    height: 100px;
    align-self: flex-end;  // 아래쪽 정렬
  }

  // 네 번째 카드 (게임패드)
  > *:nth-child(4) {
    grid-column: 2 / 3;
    grid-row: 2 / 3;
    height: 150px;
  }
`;