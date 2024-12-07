import styled from 'styled-components';

interface TimerProps {
  time: number;
  phase: 'memorize' | 'play' | 'end';
}

export function Timer({ time, phase }: TimerProps) {
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <StyledTimer>
      <img src="/img/timer.png" alt="Timer Icon" />
      {phase === 'memorize' ? time : formatTime(time)}
    </StyledTimer>
  );
}

const StyledTimer = styled.div`
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
    margin-right: 5px; /* 아이콘과 텍스트 간격 */
  }
`;
