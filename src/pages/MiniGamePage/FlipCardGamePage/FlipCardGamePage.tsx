import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useFlipCardStore } from '../../../app/providers/state/zustand/useFlipCardStore';
import { useParams, useNavigate } from 'react-router-dom';

const FlipCardGamePage = () => {
  const { level } = useParams<{ level: 'beginner' | 'medium' | 'advanced' }>();
  const { cards, setCards } = useFlipCardStore();
  const [flippedCards, setFlippedCards] = useState<number[]>([]); // 뒤집힌 카드 상태
  const [timeLeft, setTimeLeft] = useState(3); // 첫 번째 타이머 (3초)
  const [gameTimeLeft, setGameTimeLeft] = useState(30); // 두 번째 타이머 (30초)
  const [gamePhase, setGamePhase] = useState<'memorize' | 'play' | 'end'>('memorize');
  const [matchedCards, setMatchedCards] = useState<number[]>([]); // 매칭 성공 카드
  const [showSuccessModal, setShowSuccessModal] = useState(false); // 성공 모달 상태
  const [showFailureModal, setShowFailureModal] = useState(false); // 실패 모달 상태
  const navigate = useNavigate();

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // 공통 카드 데이터 설정 (16장의 카드 생성)
    const commonCards = [
      { cardTitle: 'A', cardContent: '내용 A', category: '경제' },
      { cardTitle: 'B', cardContent: '내용 B', category: '수학' },
      { cardTitle: 'C', cardContent: '내용 C', category: '과학' },
      { cardTitle: 'D', cardContent: '내용 D', category: '역사' },
      { cardTitle: 'E', cardContent: '내용 E', category: '예술' },
      { cardTitle: 'F', cardContent: '내용 F', category: '지리' },
      { cardTitle: 'G', cardContent: '내용 G', category: '문학' },
      { cardTitle: 'H', cardContent: '내용 H', category: '철학' },
  
      // 카드 쌍을 맞추기 위해 동일한 카드 반복
      { cardTitle: 'A', cardContent: '내용 A', category: '경제' },
      { cardTitle: 'B', cardContent: '내용 B', category: '수학' },
      { cardTitle: 'C', cardContent: '내용 C', category: '과학' },
      { cardTitle: 'D', cardContent: '내용 D', category: '역사' },
      { cardTitle: 'E', cardContent: '내용 E', category: '예술' },
      { cardTitle: 'F', cardContent: '내용 F', category: '지리' },
      { cardTitle: 'G', cardContent: '내용 G', category: '문학' },
      { cardTitle: 'H', cardContent: '내용 H', category: '철학' },
    ];
  
    // 단계별 카드 제한
    const beginnerCards = commonCards.slice(0, 8); // 8장 (2행 x 4열)
    const mediumCards = commonCards.slice(0, 12); // 12장 (3행 x 4열)
    const advancedCards = commonCards; // 16장 (4행 x 4열)
  
    // 단계별 카드 설정
    setCards('beginner', beginnerCards);
    setCards('medium', mediumCards);
    setCards('advanced', advancedCards);
  }, [setCards]);  
  
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
  }, [gamePhase]);

  useEffect(() => {
    if (matchedCards.length === cards[level!]?.length && gamePhase === 'play') {
      setShowSuccessModal(true);
      setGamePhase('end');
    }
  }, [matchedCards, cards, gamePhase, level]);

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || matchedCards.includes(index)) return;

    setFlippedCards((prev) => [...prev, index]);

    if (flippedCards.length === 1) {
      const firstIndex = flippedCards[0];
      const firstCard = cards[level!][firstIndex];
      const secondCard = cards[level!][index];

      if (firstCard.cardTitle === secondCard.cardTitle) {
        setMatchedCards((prev) => [...prev, firstIndex, index]);
        setFlippedCards([]);
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  return (
    <PageContainer>
      <Header>
        {gamePhase === 'memorize' && <Timer><img src="/public/img/timer.png" alt="Timer Icon" />{timeLeft}</Timer>}
        {gamePhase === 'play' && <Timer><img src="/public/img/timer.png" alt="Timer Icon" />{formatTime(gameTimeLeft)}</Timer>}
      </Header>

      <GameGrid level={level}>
      {cards[level!]?.map((card, index) => (
        <Card
          key={index}
          level={level}
          flipped={
            gamePhase === 'memorize' || flippedCards.includes(index) || matchedCards.includes(index)
          }
          onClick={() => (gamePhase === 'play' ? handleCardClick(index) : null)}
        >
          <div className="card-inner">
          <div className="card-front">
  <div className="category">{card.category}</div>
  <div className="title">{card.cardTitle}</div>
  <div className="description">{card.cardContent}</div>
</div>
            <div className="card-back">
              <img src="/public/img/logo.png" alt="Card Logo" />
            </div>
          </div>
        </Card>
      ))}
    </GameGrid>

      {showSuccessModal && (
        <Modal>
          <p>🎉 성공!</p>
          <p>100 Point를 획득하셨습니다!</p>
          <button onClick={() => navigate('/minigame')}>미니게임 페이지로 돌아가기</button>
        </Modal>
      )}

      {showFailureModal && (
        <Modal>
          <p>😢 실패!</p>
          <p>다음에 다시 도전하세요!</p>
          <button onClick={() => navigate('/minigame')}>미니게임 페이지로 돌아가기</button>
        </Modal>
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

const Timer = styled.div`
  position: absolute; /* 화면 상단 고정 */
  top: 16px; /* 피그마 기준 Y 위치 */
  left: 141px; /* 피그마 기준 X 위치 */
  width: 108px; /* 피그마 기준 너비 */
  height: 33px; /* 피그마 기준 높이 */
  background-color: #50b498; /* 피그마의 배경색 */
  color: #ffffff; /* 텍스트 색상 */
  font-size: 14px; /* 텍스트 크기 */
  font-weight: bold; /* 텍스트 굵기 */
  border-radius: 16.5px; /* 피그마의 둥근 모서리 반지름 */
  display: flex; /* 플렉스 박스를 사용해 중앙 정렬 */
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  z-index: 10; /* 다른 요소 위에 표시 */

  img {
    width: 19.78px; /* 이미지 너비 */
    height: 20px; /* 이미지 높이 */
    transform: translateX(-3px); /* 아이콘을 왼쪽으로 조금 이동 */
  }
`;

const GameGrid = styled.div<{ level?: string }>`
  display: grid;
  grid-template-columns: repeat(${(props) => (props.level === 'beginner' ? 2 : props.level === 'medium' ? 3 : 4)}, 1fr);
  grid-template-rows: repeat(4, auto); /* 항상 4행 */
  gap: 10px;
  justify-items: center;
  margin-top: 100px; /* 상단 간격 */
`;

const Card = styled.div<{ flipped: boolean; level?: string }>`
  width: ${({ level }) =>
    level === 'medium' ? '80px' : level === 'advanced' ? '70px' : '100px'};
  height: ${({ level }) =>
    level === 'medium' ? '130px' : level === 'advanced' ? '120px' : '150px'};
  position: relative; /* 카드의 앞면과 뒷면을 포개기 위해 */
  perspective: 1000px; /* 3D 효과를 위해 필수 */

  .card-inner {
    width: 100%;
    height: 100%;
    position: absolute;
    transform-style: preserve-3d; /* 3D 회전 효과를 유지 */
    transition: transform 0.6s; /* 뒤집히는 애니메이션 시간 */
    transform: ${({ flipped }) => (flipped ? 'rotateY(180deg)' : 'rotateY(0)')}; /* 뒤집힌 상태를 결정 */
  }

  .card-front,
  .card-back {
    width: 100%;
    height: 100%;
    position: absolute;
    backface-visibility: hidden; /* 뒷면을 숨김 */
    border-radius: 10px; /* 모서리를 둥글게 */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .card-back {
    background-color: #DEF9C4; /* 뒷면 색상 */
    transform: rotateY(0deg); /* 기본적으로 보이도록 설정 */
    border: 1px solid #ddd;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 70px; /* 로고 너비 */
      height: 40px; /* 로고 높이 */
    }
  }

  .card-front {
    position: absolute;
    background-color: #fff; /* 앞면 색상 */
    transform: rotateY(180deg); /* 뒤집혔을 때 보이도록 설정 */
    border: 1px solid #ddd;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

     /* 세로 배치 스타일 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 5px;

    .category {
      font-size: 8px;
      font-weight: bold;
      position: absolute;
      top: 5px;
      margin-bottom: 0px;
    }

    .title {
      font-size: 12px;
      font-weight: bold;
      position: relative;
      top: -10px;
      margin-bottom: 10px; /* 제목과 설명 간 기본 간격 유지 */
    }

    .description {
      font-size: 12px;
      text-align: center;
      line-height: 1.2;
    }
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  p {
    margin: 10px 0;
  }
  button {
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
  }
`;