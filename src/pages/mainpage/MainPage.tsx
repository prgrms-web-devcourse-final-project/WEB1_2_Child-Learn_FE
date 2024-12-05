// pages/main/MainPage.tsx
import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '@/entities/User/lib/queries';
import { InfoCard } from '@/shared/ui/InfoCard/InfoCard';
import { MenuCard } from '@/shared/ui/MenuCard/MenuCard';
import { AttendanceCard } from '@/features/mainpage/ui/AttendanceCard';
import { PointBadge } from '@/shared/ui/PointBadge/PointBadge';
import { DifficultyModal } from '@/features/mainpage/ui/DifficultyModal';
import { useAttendance } from '@/features/mainpage/lib/queries';

const MainPage = () => {
  const navigate = useNavigate();
  const { data: userInfo, isLoading } = useUserInfo();
  const { attendanceMutation } = useAttendance(); // 구조분해할당으로 가져오기

  const handleAttendance = () => {
    if (userInfo?.id) {
      attendanceMutation.mutate(userInfo.id);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGraphClick = () => {
    setIsModalOpen(true);
  };

  const handleDifficultySelect = (level: string) => {
    setIsModalOpen(false);
    navigate(`/graph/${level}`);
  };

  const menuItems = [
    {
      title: '오늘은 어떤 그래프가\n기다리고 있을까요?',
      bgColor: '#6CC2A1',
      iconSrc: '/img/contract.png',
      iconAlt: '문서',
      path: '/graph',
      extended: true,
    },
    {
      title: '누가 가장 투자를\n잘 할까요?',
      bgColor: '#FFA944',
      iconSrc: '/img/trophy.png',
      iconAlt: '트로피',
      path: '/ranking',
    },
    {
      title: '나를 멋있게\n꾸며봐요!',
      bgColor: '#FF497F',
      iconSrc: '/img/magic-hat.png',
      iconAlt: '마술모자',
      path: '/avatar',
    },
    {
      title: '재미는 게임도\n준비되어 있어요!',
      bgColor: '#29BAE2',
      iconSrc: '/img/chess.png',
      iconAlt: '체스',
      path: '/minigame',
      extended: true,
    },
  ];

  return (
    <>
      <PageContainer>
        <ContentContainer>
          <WhiteBackground />
          {/* 환영 메시지 & 포인트 */}
          <WelcomeSection>
            <WelcomeText>
              반가워요, {userInfo?.username || '사용자'} 님! 😊
            </WelcomeText>
            <PointBadge />
          </WelcomeSection>

          {/* 출석체크 카드 */}
          <AttendanceCard
            title={'매일 출석하고\n10 Point 받기'}
            userId={userInfo?.id}
            onClick={handleAttendance}
          />

          {/* 메뉴 그리드 */}
          <MenuGrid>
            <MenuCard
              {...menuItems[0]}
              onClick={handleGraphClick} // 첫 번째 카드(그래프)만 모달 열기로 변경
            />
            {menuItems.slice(1).map((item, index) => (
              <MenuCard
                key={index + 1}
                {...item}
                onClick={() => navigate(item.path)}
              />
            ))}
          </MenuGrid>

          {/* 하단 카드들 */}
          <InfoCard
            title="모의투자"
            description="조금 더 어려운 투자에 도전해 볼래요!"
            iconSrc="/img/calculator.png"
            iconAlt="계산기"
            onClick={() => navigate('/investment')}
          />

          <InfoCard
            title="친구목록"
            description="친구들과 같이 둘러보아요!"
            iconSrc="/img/boy.png"
            iconAlt="남자아이"
            onClick={() => navigate('/friends')}
          />
        </ContentContainer>
      </PageContainer>
      <DifficultyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleDifficultySelect}
      />
    </>
  );
};

export default MainPage;

const PageContainer = styled.div`
  height: 100%;
  background-color: #def9c4; // 상단 연두색
`;

const ContentContainer = styled.div`
  padding: 20px;
  position: relative;
  & > * {
    position: relative;
    z-index: 1; // 모든 직접적인 자식 요소들에 z-index 적용
  }
`;

const WhiteBackground = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 60%;
  background-color: white;
  border-radius: 24px 24px 0 0;
  z-index: 0;
`;

const WelcomeSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
`;

const WelcomeText = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: #333;
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 24px 0;
  position: relative;
  z-index: 1;

  // 첫 번째 카드 (그래프)
  > *:nth-child(1) {
    grid-column: 1 / 2;
    grid-row: 1 / 3; // 2행 차지
    height: 150px; // 큰 카드 높이
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
    grid-row: 2 / 3; // 3 -> 2로 수정
    height: 100px;
    align-self: flex-end; // 아래쪽 정렬
  }

  // 네 번째 카드 (게임패드)
  > *:nth-child(4) {
    grid-column: 2 / 3;
    grid-row: 2 / 3;
    height: 150px;
  }
`;
