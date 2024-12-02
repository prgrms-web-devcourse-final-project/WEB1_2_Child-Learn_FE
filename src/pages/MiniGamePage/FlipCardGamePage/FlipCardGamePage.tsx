import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Timer }  from '../../../features/minigame/flipcardgame/ui/Timer'
import { Modal } from '../../../features/minigame/flipcardgame/ui/Modal'
import { Cards } from '../../../features/minigame/flipcardgame/ui/Cards';
import { useFlipCardLogic } from '../../../features/minigame/flipcardgame/lib/useFlipCardLogic';
import { useParams, useNavigate } from 'react-router-dom';

const FlipCardGamePage = () => {
  const { difficulty } = useParams<{ difficulty: 'begin' | 'mid' | 'adv' }>();
  console.log('Difficulty from URL:', difficulty);
  const {
    flippedCards,
    setFlippedCards,
    matchedCards,
    setMatchedCards,
    shuffledCards,
    loading,
    error,
  } = useFlipCardLogic(difficulty!);
  const [timeLeft, setTimeLeft] = useState(3); // 첫 번째 타이머 (3초)
  const [gameTimeLeft, setGameTimeLeft] = useState(60); // 두 번째 타이머 (30초)
  const [gamePhase, setGamePhase] = useState<'memorize' | 'play' | 'end'>('memorize');
  const [showSuccessModal, setShowSuccessModal] = useState(false); // 성공 모달 상태
  const [showFailureModal, setShowFailureModal] = useState(false); // 실패 모달 상태
  const navigate = useNavigate();
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gamePhase === 'memorize') {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGamePhase('play'); // 게임 시작
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (gamePhase === 'play') {
      timer = setInterval(() => {
        setGameTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGamePhase('end'); // 게임 종료
            setShowFailureModal(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gamePhase, loading]);

  useEffect(() => {
    if (matchedCards.length === shuffledCards.length && gamePhase === 'play') {
      setShowSuccessModal(true);
      setGamePhase('end');
    }
  }, [matchedCards, shuffledCards, gamePhase]);

  const handleCardClick = (index: number) => {
    if (
      flippedCards.length === 2 || // 이미 두 개가 뒤집혔는지 확인
      matchedCards.includes(index) || // 이미 매칭된 카드인지 확인
      flippedCards.includes(index) // 이미 뒤집힌 카드인지 확인
    ) {
      return;
    }
  
    setFlippedCards((prev) => [...prev, index]);
  
    if (flippedCards.length === 1) {
      const firstIndex = flippedCards[0];
      const firstCard = shuffledCards[firstIndex];
      const secondCard = shuffledCards[index];
  
      if ((firstCard.cardContent === secondCard.cardContent)) {
        // 매칭 성공
        setMatchedCards((prev) => [...prev, firstIndex, index]);
        setFlippedCards([]);
      } else {
        // 매칭 실패: 일정 시간 뒤 초기화
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  if (loading) {
    return <Loading>Loading...</Loading>;
  }

  if (error) {
    return <Error>{error}</Error>;
  }
  
  return (
    <PageContainer>
      <Header>
      <Timer time={gamePhase === 'memorize' ? timeLeft : gameTimeLeft} phase={gamePhase} />
      </Header>

      <Cards
        difficulty={difficulty!}
        shuffledCards={shuffledCards}
        flippedCards={flippedCards}
        matchedCards={matchedCards}
        gamePhase={gamePhase}
        onCardClick={handleCardClick}
      />

      {/* 성공 모달 */}
      {showSuccessModal && (
        <Modal
          title="성공!"
          message="를 획득하셨어요!"
          emoji="😊"
          buttonText="미니게임 페이지로 돌아가기"
          isSuccess={true} 
          onButtonClick={() => navigate('/minigame')}
        />
      )}

      {/* 실패 모달 */}
      {showFailureModal && (
        <Modal
          title="실패!"
          message="내일 다시 도전해봐요!"
          emoji="😢"
          buttonText="미니게임 페이지로 돌아가기"
          isSuccess={false} 
          onButtonClick={() => navigate('/minigame')}
        />
      )}
    </PageContainer>
  );
};

export default FlipCardGamePage;

const PageContainer = styled.div`
  text-align: center;
  min-height: 100vh;
  padding: 0px;
`;

const Header = styled.div`
  margin-bottom: 20px;
`;

const Loading = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const Error = styled.div`
  text-align: center;
  margin-top: 20px;
  color: red;
`;