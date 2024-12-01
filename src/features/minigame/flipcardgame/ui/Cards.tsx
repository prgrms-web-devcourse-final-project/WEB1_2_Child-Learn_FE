import styled from 'styled-components';
import type { Card } from '../../../../features/minigame/flipcardgame/types/cardTypes';

interface CardsProps {
  difficulty: 'begin' | 'mid' | 'adv';
  shuffledCards: Card[];
  flippedCards: number[];
  matchedCards: number[];
  gamePhase: 'memorize' | 'play' | 'end';
  onCardClick: (index: number) => void;
}

export function Cards({
  difficulty,
  shuffledCards,
  flippedCards,
  matchedCards,
  gamePhase,
  onCardClick,
}: CardsProps) {
  return (
    <GameGrid difficulty={difficulty}>
      {shuffledCards.map((card, index) => (
        <Card
          key={card.card_id}
          flipped={
            gamePhase === 'memorize' || flippedCards.includes(index) || matchedCards.includes(index)
          }
          difficulty={difficulty}
          onClick={() => (gamePhase === 'play' ? onCardClick(index) : null)}
        >
          <div className="card-inner">
            <div className="card-front">
              <div className="category">{card.card_category}</div>
              <div className="title">{card.card_title}</div>
              <div className="description">{card.card_content}</div>
            </div>
            <div className="card-back">
              <img src="/public/img/logo.png" alt="Card Logo" />
            </div>
          </div>
        </Card>
      ))}
    </GameGrid>
  );
}

const GameGrid = styled.div<{ difficulty?: string }>`
  display: grid;
  grid-template-columns: repeat(
    ${({ difficulty }) => (difficulty === 'begin' ? 2 : difficulty === 'mid' ? 3 : 4)},
    ${({ difficulty }) =>
      difficulty === 'begin' ? '100px' : difficulty === 'mid' ? '90px' : '80px'}
  );
  column-gap: ${({ difficulty }) =>
    difficulty === 'begin' ? '20px' : difficulty === 'mid' ? '15px' : '10px'};
  row-gap: 10px; /* 상하 간격 */
  margin-top: 100px; /* 상단 간격 고정 */
  margin-bottom: 40px; /* 하단 간격 고정 */
  margin-left: auto;
  margin-right: auto;
  max-width: ${({ difficulty }) =>
    difficulty === 'begin'
      ? 'calc(2 * 100px + 20px)' // 카드 크기와 간격 계산
      : difficulty === 'mid'
      ? 'calc(3 * 90px + 30px)' // 카드 크기와 간격 계산
      : 'calc(4 * 80px + 30px)'}; // 카드 크기와 간격 계산
  justify-items: center;
  align-items: center;
`;

const Card = styled.div<{ flipped: boolean; difficulty?: string }>`
  width: ${({ difficulty }) =>
    difficulty === 'mid' ? '80px' : difficulty === 'adv' ? '70px' : '100px'};
  height: ${({ difficulty }) =>
    difficulty === 'mid' ? '130px' : difficulty === 'adv' ? '120px' : '150px'};
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
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
      font-size: ${({ difficulty }) =>
        difficulty === 'adv' ? '6px' : difficulty === 'mid' ? '7px' : '8px'};
      font-weight: bold;
      position: absolute;
      top: 5px;
      margin-bottom: 2px; /* 카테고리와 제목 간격 */
    }

    .title {
      font-size: ${({ difficulty }) =>
        difficulty === 'adv' ? '10px' : difficulty === 'mid' ? '11px' : '12px'};
      font-weight: bold;
      position: relative;
      top: -5px; /* 카테고리와 간격 조정 */
      margin-bottom: ${({ difficulty }) =>
        difficulty === 'adv' ? '5px' : difficulty === 'mid' ? '8px' : '10px'}; /* 제목과 내용 간격 */
    }

    .description {
      font-size: ${({ difficulty }) =>
        difficulty === 'adv' ? '9px' : difficulty === 'mid' ? '10px' : '12px'};
      text-align: center;
      line-height: ${({ difficulty }) =>
        difficulty === 'adv' ? '1.1' : difficulty === 'mid' ? '1.2' : '1.4'}; /* 줄 간격 조정 */
    }
  }
`;