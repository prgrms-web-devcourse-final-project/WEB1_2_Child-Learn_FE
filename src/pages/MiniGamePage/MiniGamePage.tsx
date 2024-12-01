import { useEffect, useState } from 'react';
import { useUserStore } from '../../app/providers/state/zustand/userStore';
import { flipCardApi } from '@/shared/api/minigames';
import { useWordQuizStore } from '../../features/minigame/wordquizgame/model/wordQuizStore';
import { useLotteryStore } from '../../app/providers/state/zustand/useLotteryStore';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const MiniGamePage = () => {
  const { username, currentPoints, setUser } = useUserStore();
  const {
    isPlayable: isWordQuizPlayable,
    setLastPlayedDate: setWordQuizLastPlayedDate,
  } = useWordQuizStore();
  const {
    setLotteries,
    isPlayable: isLotteryPlayable,
    setLastPlayedDate: setLotteryLastPlayedDate,
  } = useLotteryStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const navigate = useNavigate();

  const [isPlayable, setIsPlayable] = useState({
    begin: false,
    mid: false,
    adv: false,
  });
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    // 초기 사용자 데이터 설정
    setUser({
      memberId: 3,
      loginId: 'minnie123',
      username: 'Minnie',
      email: 'minnie@example.com',
      createdAt: '2024-01-01',
      updatedAt: '2024-11-20',
      gameCount: 5,
      birth: '2002-05-06',
      currentPoints: 2000, // 초기 포인트 설정
      currentCoins: 200, // 초기 코인 설정
    });

    // 로또 초기 데이터 설정
    setLotteries([
      {
        roundNumber: 1,
        drawDate: new Date('2024-11-15'),
        winningNumbers: [3, 7, 12, 24, 36],
        status: '진행 중',
      },
      {
        roundNumber: 2,
        drawDate: new Date('2024-11-22'),
        winningNumbers: [1, 4, 9, 16, 25],
        status: '대기',
      },
    ]);

    // API 호출로 난이도별 가능 여부 확인
    const fetchAvailability = async () => {
      try {
        const response = await flipCardApi.checkDifficultyAvailability();
        console.log('Flip Card Availability:', response); // 디버그 로그
        setIsPlayable({
          begin: response.isBegin,
          mid: response.isMid,
          adv: response.isAdv,
        });
      } catch (error) {
        console.error('Failed to fetch difficulty availability:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [setUser, setLotteries]);

  const handleFlipCardPlay = async (difficulty: 'begin' | 'mid' | 'adv') => {
    if (isPlayable[difficulty]) {
      try {
        // localStorage에서 memberId 가져오기
        const memberIdString = localStorage.getItem('memberId') || '3'; // 기본값으로 '0' 설정
        const memberId = Number(memberIdString); // 숫자로 변환
  
        // memberId가 유효한 숫자인지 확인
        if (isNaN(memberId) || memberId <= 0) {
          throw new Error('Invalid member ID');
        }
  
        // API 호출로 마지막 플레이 타임 갱신
        // API 호출로 마지막 플레이 타임 갱신
      const response = await flipCardApi.updateLastPlayTime(memberId, difficulty);
      console.log(`Successfully updated last play time for difficulty "${difficulty}":`, response.lastPlayTime); // 갱신된 마지막 플레이 타임 로그
        navigate(`/flip-card/${difficulty}`); // 성공적으로 갱신된 경우 해당 경로로 이동
      } catch (error) {
        console.error('Failed to update last play time:', error);
        alert('플레이 타임 갱신에 실패했습니다. 다시 시도해주세요.');
      }
    } else {
      alert('이 난이도는 오늘 플레이할 수 없습니다.');
    }
  };  

  // 낱말 퀴즈 플레이 핸들러
  const handleWordQuizPlay = async (
    difficulty: 'begin' | 'mid' | 'adv'
  ) => {
    if (isWordQuizPlayable(difficulty)) {
      const today = new Date().toISOString().split('T')[0];
      setWordQuizLastPlayedDate(difficulty, today); // 마지막 플레이 날짜 업데이트
      navigate(`/word-quiz/${difficulty}`);
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

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <PageContainer>
      {/* 고정 배경 */}
      <BackgroundContainer />

      {/* 헤더 섹션 */}
      <Header>
        <GreetingContainer>
          <p>안녕하세요, {username}님!</p>
          <h1>오늘은 어떤 게임을 즐겨보시겠어요?</h1>
        </GreetingContainer>
        <PointsContainer>
          <img src="/icons/coins 1.png" alt="Coin Icon" />
          {currentPoints} P
        </PointsContainer>
      </Header>

      {/* 메인 콘텐츠 */}
      <MainContent>
        <TopSection>
          <div>
            <p>획득한 포인트로 나를 꾸며볼까요?</p>
            <StyledLink to="/avatar">내 캐릭터 꾸미러 가기</StyledLink>
          </div>
        </TopSection>

        <TopSection>
          <div>
            <p>오늘 미니게임으로 획득한 포인트</p>
            <h2>300 Points</h2>
          </div>
          <StyledLink to="/exchange">환전하러 가기</StyledLink>
        </TopSection>

        <GameGrid>
          {/* 낱말 퀴즈 */}
          <GameCard onClick={() => openModal('낱말 퀴즈')}>
            <CardTitle>낱말 퀴즈</CardTitle>
            <p>100 Point</p>
          </GameCard>

          {/* OX 퀴즈 */}
          <GameCard onClick={() => openModal('OX 퀴즈')}>
            <CardTitle>OX 퀴즈</CardTitle>
            <p>0~100 Point</p>
          </GameCard>

          {/* 카드 뒤집기 */}
          <GameCard onClick={() => openModal('카드 뒤집기')}>
            <CardTitle>카드 뒤집기</CardTitle>
            <p>100 Point</p>
          </GameCard>

          {/* 로또 */}
          <GameCard
            onClick={() => isLotteryPlayable() && handleLotteryPlay()}
            style={
              !isLotteryPlayable()
                ? { backgroundColor: 'gray', cursor: 'not-allowed' }
                : {}
            }
          >
            <CardTitle>숫자를 맞혀라!</CardTitle>
            <p>10~1000 Point</p>
          </GameCard>
        </GameGrid>
      </MainContent>

      {/* 모달 */}
      {modalVisible && selectedGame && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={closeModal}>&times;</CloseButton>
            <p>난이도를 선택하세요!</p>
            {/* 난이도 버튼 */}
            {selectedGame === '카드 뒤집기' && (
              <>
                {selectedGame === '카드 뒤집기' && (
                  <>
                    <ModalButton
                      difficulty="begin"
                      onClick={() => handleFlipCardPlay('begin')}
                      disabled={!isPlayable.begin}
                    >
                      쉬움
                    </ModalButton>
                    <ModalButton
                       difficulty="mid"
                       onClick={() => handleFlipCardPlay('mid')}
                       disabled={!isPlayable.mid}
                    >
                      보통
                    </ModalButton>
                    <ModalButton
                     difficulty="adv"
                     onClick={() => handleFlipCardPlay('adv')}
                     disabled={!isPlayable.adv}
                    >
                      어려움
                    </ModalButton>
                  </>
                )}
              </>
            )}
            {selectedGame === '낱말 퀴즈' && (
              <>
                <ModalButton
                  difficulty="begin"
                  onClick={() => handleWordQuizPlay('begin')}
                  disabled={!isWordQuizPlayable('begin')}
                >
                  쉬움
                </ModalButton>
                <ModalButton
                  difficulty="mid"
                  onClick={() => handleWordQuizPlay('mid')}
                  disabled={!isWordQuizPlayable('mid')}
                >
                  보통
                </ModalButton>
                <ModalButton
                  difficulty="adv"
                  onClick={() => handleWordQuizPlay('adv')}
                  disabled={!isWordQuizPlayable('adv')}
                >
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
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
`;

const BackgroundContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 250px;
  background-color: #def9c4; /* 연두색 배경 */
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
`;

const Header = styled.header`
  position: relative;
  width: 100%;
  display: flex;
  padding: 10px 20px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const GreetingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /*position: absolute;*/
  margin-bottom: 10px;
  top: 15px;

  h1 {
    margin: 0;
    font-size: 1rem;
    font-weight: bold;
    color: #333;
  }

  p {
    margin: 0;
    font-size: 0.8rem;
    font-weight: bold;
    color: #333;
  }
`;

const PointsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  /*position: absolute;*/
  top: 15px;
  right: 20px;
  width: 91px;
  height: 34px;
  background-color: #50b498;
  border-radius: 20px; /* 둥근 모서리 */
  font-weight: bold;
  color: #ffffff;
  font-size: 11px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  img {
    width: 24px;
    height: 24px;
    margin-right: 5px; /* 이미지와 텍스트 간격 */
  }
`;

const MainContent = styled.main`
  width: 100%;
  max-width: 390px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between; /* 좌우로 배치 */
  align-items: center;
  background-color: rgba(80, 180, 152, 0.8); /* #50B498의 opacity 80% */
  color: white; /* 텍스트 색상 흰색 */
  border-radius: 15px; /* 모서리를 둥글게 */
  width: 310px;
  height: 107px;
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

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 카드 크기에 맞게 고정 */
  gap: 20px; /* 피그마의 카드 간격에 맞게 조정 */
  justify-content: center; /* 화면 중앙 정렬 */
`;

const GameCard = styled.div`
  width: 179px;
  height: 177px;
  background-color: #fff;
  border: 1px solid #f2f0f8;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  cursor: pointer; /* 클릭 가능 표시 */

  &:hover {
    background-color: #f0f0f0; /* 호버 효과 */
  }

  h2 {
    font-size: 1rem;
    margin: 10px 0;
    font-weight: bold;
    color: #468585;
  }

  p {
    font-size: 0.8rem;
    color: #666;
  }
`;

const CardTitle = styled.h2`
  font-size: 16px;
  font-weight: bold;
  color: #468585;
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

const ModalButton = styled.button<{
  difficulty: 'begin' | 'mid' | 'adv';
}>`
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${({ difficulty }) =>
    difficulty === 'begin'
      ? '#9CDBA6'
      : difficulty === 'mid'
        ? '#50B498'
        : '#468585'};
  color: white;

  &:hover {
    background-color: ${({ difficulty }) =>
      difficulty === 'begin'
        ? '#8BCF96'
        : difficulty === 'mid'
          ? '#44997E'
          : '#3A7572'};
  }

  &:disabled {
    background-color: gray;
    cursor: not-allowed;
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
`;
