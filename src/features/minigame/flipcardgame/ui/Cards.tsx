import styled from 'styled-components';
import type { Card } from '../../../../features/minigame/flipcardgame/types/cardTypes';

interface CardsProps {
  level: 'beginner' | 'medium' | 'advanced';
  shuffledCards: Card[];
  flippedCards: number[];
  matchedCards: number[];
  gamePhase: 'memorize' | 'play' | 'end';
  onCardClick: (index: number) => void;
}

export function Cards({
  level,
  shuffledCards,
  flippedCards,
  matchedCards,
  gamePhase,
  onCardClick,
}: CardsProps) {
  return (
    <GameGrid level={level}>
      {shuffledCards.map((card, index) => (
        <Card
          key={card.card_id}
          flipped={
            gamePhase === 'memorize' || flippedCards.includes(index) || matchedCards.includes(index)
          }
          level={level}
          onClick={() => (gamePhase === 'play' ? onCardClick(index) : null)}
        >
          <div className="card-inner">
            <div className="card-front">
              <div className="category">{card.category}</div>
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

const GameGrid = styled.div<{ level?: string }>`
  display: grid;
  grid-template-columns: repeat(
    ${({ level }) => (level === 'beginner' ? 2 : level === 'medium' ? 3 : 4)},
    ${({ level }) =>
      level === 'beginner' ? '100px' : level === 'medium' ? '90px' : '80px'}
  );
  column-gap: ${({ level }) =>
    level === 'beginner' ? '20px' : level === 'medium' ? '15px' : '10px'};
  row-gap: 10px; /* 상하 간격 */
  margin-top: 100px; /* 상단 간격 고정 */
  margin-bottom: 40px; /* 하단 간격 고정 */
  margin-left: auto;
  margin-right: auto;
  max-width: ${({ level }) =>
    level === 'beginner'
      ? 'calc(2 * 100px + 20px)' // 카드 크기와 간격 계산
      : level === 'medium'
      ? 'calc(3 * 90px + 30px)' // 카드 크기와 간격 계산
      : 'calc(4 * 80px + 30px)'}; // 카드 크기와 간격 계산
  justify-items: center;
  align-items: center;
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