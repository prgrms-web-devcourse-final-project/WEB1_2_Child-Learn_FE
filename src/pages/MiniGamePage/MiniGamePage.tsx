import { useEffect, useState } from 'react';
import { useUserStore } from '../../app/providers/state/zustand/userStore';
import { useFlipCardStore } from '../../app/providers/state/zustand/useFlipCardStore';
import { useLotteryStore } from '../../app/providers/state/zustand/useLotteryStore';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const MiniGamePage = () => {
  const { username, points, setUser } = useUserStore();
  const { setCards, isPlayable: isCardPlayable, setLastPlayed: setCardLastPlayed } = useFlipCardStore();
  const { setLotteries, isPlayable: isLotteryPlayable, setLastPlayedDate: setLotteryLastPlayedDate } = useLotteryStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 초기 사용자 데이터 설정
    setUser({
      loginId: 'minnie123',
      username: 'Minnie',
      email: 'minnie@example.com',
      createdAt: '2024-01-01',
      updatedAt: '2024-11-20',
      gameCount: 5,
      birth: '2002-05-06',
      points: 2000,
    });

    // 카드 뒤집기 초기 데이터 설정
    setCards('beginner', [
      { cardTitle: '카드 1', cardContent: '내용 1', category: '쉬움' },
      { cardTitle: '카드 2', cardContent: '내용 2', category: '쉬움' },
    ]);
    setCards('medium', [
      { cardTitle: '카드 3', cardContent: '내용 3', category: '보통' },
      { cardTitle: '카드 4', cardContent: '내용 4', category: '보통' },
    ]);
    setCards('advanced', [
      { cardTitle: '카드 5', cardContent: '내용 5', category: '어려움' },
      { cardTitle: '카드 6', cardContent: '내용 6', category: '어려움' },
    ]);

    // 로또 초기 데이터 설정
    setLotteries([
      { roundNumber: 1, drawDate: new Date('2024-11-15'), winningNumbers: [3, 7, 12, 24, 36], status: '진행 중' },
      { roundNumber: 2, drawDate: new Date('2024-11-22'), winningNumbers: [1, 4, 9, 16, 25], status: '대기' },
    ]);
  }, [setUser, setCards, setLotteries]);

  // 카드 뒤집기 플레이 핸들러
  const handleFlipCardPlay = (level: 'beginner' | 'medium' | 'advanced') => {
    if (isCardPlayable(level)) {
      setCardLastPlayed(level, new Date());
      navigate(`/flip-card/${level}`);
    }
  };

  // 로또(숫자를 맞혀라) 플레이 핸들러
  const handleLotteryPlay = () => {
    if (isLotteryPlayable()) {
      setLotteryLastPlayedDate(new Date());
      navigate('/lottery');
    }
  };


  const openModal = (game: string) => {
    setSelectedGame(game);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedGame(null);
  };

  return (
    <PageContainer>
      <Header>
        <GreetingContainer>
          <h1>안녕하세요, {username}님!</h1>
          <p>오늘은 어떤 게임을 즐겨보시겠어요?</p>
        </GreetingContainer>
        <PointsContainer>
        <img src="/icons/coins 1.png" alt="Coin Icon" />
        {points} P
        </PointsContainer>
    </Header>
      <MainContent>
        <TopSection>
          <div>
            <p>획득한 포인트로 나를 꾸며볼까요?</p>
            <StyledLink to="/character">내 캐릭터 꾸미러 가기</StyledLink>
          </div>
        </TopSection>

        <TopSection>
          <div>
            <p>오늘 미니게임으로 획득한 포인트</p>
            <h2>300 Points</h2>
          </div>
          <StyledLink to="/exchange">환전하러 가기</StyledLink>
        </TopSection>

        <BackgroundContainer>
        <GameGrid>
          {/* 낱말 퀴즈 */}
          <GameCard>
            <GameButton onClick={() => openModal('낱말 퀴즈')}>낱말 퀴즈</GameButton>
            <p>100 Point</p>
          </GameCard>

          {/* OX 퀴즈 */}
          <GameCard>
            <GameButton onClick={() => openModal('OX 퀴즈')}>OX 퀴즈</GameButton>
            <p>0~100 Point</p>
          </GameCard>

         {/* 카드 뒤집기 */}
         <GameCard>
            <GameButton onClick={() => openModal('카드 뒤집기')}>카드 뒤집기</GameButton>
            <p>100 Point</p>
          </GameCard>
          {/* 로또 */}
          <GameCard>
            <GameButton
              onClick={handleLotteryPlay}
              disabled={!isLotteryPlayable()}
              style={!isLotteryPlayable() ? { backgroundColor: 'gray', cursor: 'not-allowed' } : {}}
            >
              숫자를 맞혀라!
            </GameButton>
            <p>10~1000 Point</p>
          </GameCard>
        </GameGrid>
        </BackgroundContainer>
      </MainContent>
      
       {/* 모달 */}
       {modalVisible && selectedGame && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={closeModal}>&times;</CloseButton>
            <p>난이도를 선택하세요!</p>

            {selectedGame === '카드 뒤집기' && (
              <>
                <ModalButton
                  onClick={() => handleFlipCardPlay('beginner')}
                  disabled={!isCardPlayable('beginner')}
                  style={!isCardPlayable('beginner') ? { backgroundColor: 'gray', cursor: 'not-allowed' } : {}}
                >
                  쉬움
                </ModalButton>
                <ModalButton
                  onClick={() => handleFlipCardPlay('medium')}
                  disabled={!isCardPlayable('medium')}
                  style={!isCardPlayable('medium') ? { backgroundColor: 'gray', cursor: 'not-allowed' } : {}}
                >
                  보통
                </ModalButton>
                <ModalButton
                  onClick={() => handleFlipCardPlay('advanced')}
                  disabled={!isCardPlayable('advanced')}
                  style={!isCardPlayable('advanced') ? { backgroundColor: 'gray', cursor: 'not-allowed' } : {}}
                >
                  어려움
                </ModalButton>
              </>
            )}

            {(selectedGame === '낱말 퀴즈' || selectedGame === 'OX 퀴즈') && (
              <>
                <ModalButton onClick={() => navigate(`/${selectedGame === '낱말 퀴즈' ? 'word-quiz' : 'ox-quiz'}/beginner`)}>
                  쉬움
                </ModalButton>
                <ModalButton onClick={() => navigate(`/${selectedGame === '낱말 퀴즈' ? 'word-quiz' : 'ox-quiz'}/medium`)}>
                  보통
                </ModalButton>
                <ModalButton onClick={() => navigate(`/${selectedGame === '낱말 퀴즈' ? 'word-quiz' : 'ox-quiz'}/advanced`)}>
                  어려움
                </ModalButton>
              </>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default MiniGamePage;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* 상단 콘텐츠는 위쪽에 배치 */
  width: 100%;
  min-height: 100vh; /* 페이지 전체 높이를 채움 */
  background-color: #f5f5f5;
  padding: 20px;
  position: relative; /* BackgroundContainer의 위치를 기준으로 삼음 */

  @media (max-width: 768px) {
    padding: 10px;
  }

  @media (max-width: 390px) {
    padding: 5px;
  }
`;

const Header = styled.header`
  width: 100%;
  background-color: #fff;
  padding: 10px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 10px;

  h1 {
    font-size: 1.5rem;
    font-weight: bold;

    @media (max-width: 390px) {
      font-size: 1.2rem;
    }
  }

  p {
    font-size: 1rem;

    @media (max-width: 390px) {
      font-size: 0.9rem;
    }
  }
`;

const GreetingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;

  h1 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;

    @media (max-width: 390px) {
      font-size: 1rem;
    }
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    color: #666;

    @media (max-width: 390px) {
      font-size: 0.8rem;
    }
  }
`;

const PointsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute; /* 위치를 절대적으로 지정 */
  top: 55px; /* 피그마 기준 Y값 */
  right: 20px; /* 피그마 기준 X값 */
  width: 91px; /* 피그마 기준 너비 */
  height: 34px; /* 피그마 기준 높이 */
  background-color: #50B498;
  border-radius: 20px; /* 둥근 모서리 */
  font-weight: bold;
  color: #ffffff; /* 텍스트 색상 흰색 */
  font-size: 11px; /* 피그마 기준 폰트 크기 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  img {
    width: 24px;
    height: 24px;
    margin-right: 5px; /* 이미지와 텍스트 간격 */
  }
`;

const MainContent = styled.main`
  width: 100%;
  max-width: 768px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  padding-bottom: 600px; /* BackgroundContainer와 겹침 방지 */

  @media (max-width: 768px) {
    padding: 10px;
    padding-bottom: 550px; /* 모바일 화면에 맞게 조정 */
  }

  @media (max-width: 390px) {
    padding: 5px;
    padding-bottom: 551px; /* 모바일 환경에서 피그마 기준 */
  }
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between; /* 좌우로 배치 */
  align-items: center;
  background-color: rgba(80, 180, 152, 0.8); /* #50B498의 opacity 80% */
  color: white; /* 텍스트 색상 흰색 */
  border-radius: 15px; /* 모서리를 둥글게 */
  width: 310px; /* 피그마 기준 너비 */
  height: 107px; /* 피그마 기준 높이 */
  padding: 15px; /* 내부 여백 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  position: relative; /* 텍스트 정렬 및 추가 요소를 위한 기준 */

  h2 {
    font-size: 30px; /* 피그마 폰트 크기 */
    font-weight: bold;
    margin: 0;
  }

  p {
    font-size: 14px; /* 피그마 폰트 크기 */
    font-weight: normal;
    margin: 0;
  }
`;


const StyledLink = styled(Link)`
  display: flex; /* 텍스트와 가운데 정렬을 위한 플렉스 박스 */
  justify-content: center;
  align-items: center;
  width: 288px; /* 피그마 기준 너비 */
  height: 25px; /* 피그마 기준 높이 */
  background-color: #ffffff; /* 흰색 배경 */
  border-radius: 15px; /* 둥근 모서리 */
  font-size: 14px; /* 폰트 크기 */
  font-weight: bold; /* 텍스트 굵기 */
  color: #468585; /* 텍스트 색상 */
  text-decoration: none; /* 링크 밑줄 제거 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 효과 */

  &:hover {
    background-color: #f0f0f0; /* 호버 시 약간 밝은 회색 */
  }
`;

const BackgroundContainer = styled.div`
  position: absolute;
  bottom: 0; /* 화면의 맨 아래에 고정 */
  left: 0;
  right: 0;
  height: 551px; /* 피그마 기준 높이 */
  background-color: #DEF9C4; /* 피그마 기준 배경색 */
  border-top-left-radius: 30px; /* 둥근 모서리 */
  border-top-right-radius: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 179px); /* 카드 크기에 맞게 고정 */
  gap: 20px; /* 피그마의 카드 간격에 맞게 조정 */
  justify-content: center; /* 화면 중앙 정렬 */
`;

const GameCard = styled.div`
  width: 179px; /* 피그마 기준 카드 너비 */
  height: 177px; /* 피그마 기준 카드 높이 */
  background-color: #fff; /* 카드 배경 흰색 */
  border: 1px solid #F2F0F8; /* 피그마에서 지정된 테두리 색상 */
  border-radius: 10px; /* 카드 모서리를 둥글게 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 약간의 그림자 추가 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative; /* 내부 요소 위치 조정 */

  h2 {
    font-size: 1rem; /* 텍스트 크기 */
    margin: 10px 0;
    font-weight: bold; /* 제목을 강조 */
    color: #333; /* 텍스트 색상 */
  }

  p {
    font-size: 0.8rem;
    color: #666; /* 부가 텍스트 색상 */
  }
`;

const GameButton = styled.button`
  width: 100%;
  max-width: 300px;
  padding: 15px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 14px;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1010;
`;

const ModalButton = styled.button`
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #28a745;
  color: white;

  &:hover {
    background-color: #218838;
  }

  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #333;

  &:hover {
    color: #000;
  }

  @media (max-width: 768px) {
    top: 5px; /* 작은 화면에서 간격 조정 */
    right: 5px;
    font-size: 18px;
  }
`;