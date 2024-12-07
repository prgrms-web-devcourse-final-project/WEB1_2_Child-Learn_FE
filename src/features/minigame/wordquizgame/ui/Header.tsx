import styled from 'styled-components';
import { Timer } from '@/features/minigame/flipcardgame/ui/Timer';
import { useWordQuizStore } from '@/features/minigame/wordquizgame/model/wordQuizStore';

interface HeartProps {
  filled: boolean;
}

interface HeaderProps {
  timeLeft: number;
  currentPhase: number;
}

export const Header = ({ timeLeft, currentPhase }: HeaderProps) => {
  const lives = useWordQuizStore((state) => state.lives); // lives 상태 가져오기

  return (
    <HeaderContainer>
      <LivesContainer>
        {Array.from({ length: 3 }).map((_, index) => (
          <Heart key={index} filled={index < lives} />
        ))}
      </LivesContainer>
      <ProgressContainer>
      {Array.from({ length: 3 }).map((_, index) => (
          <ProgressBar key={index} active={index < currentPhase} />
        ))}
      </ProgressContainer>
      <TimerContainer>
        <Timer time={timeLeft} phase="play" />
      </TimerContainer>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 390px;
  height: 40px;
  position: relative; /* 아이콘의 위치 조정 */
`;

const TimerContainer = styled.div`
  position: absolute;
  top: 30px;
  justify-content: center;
`;

const LivesContainer = styled.div`
  display: flex;
  gap: 5px;
  position: absolute;
  top: 50px;
  right: 10px;
`;

const Heart = styled.div<HeartProps>`
  width: 15px;
  height: 15px;
  background: ${(props) =>
    props.filled
      ? "url('/img/heart-icon.png')"
      : "url('/img/heart-icon-empty.png')"};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const ProgressContainer = styled.div`
  display: flex;
  gap: 5px;
  justify-content: center;
  flex: 1;
  z-index: 1;
`;

interface ProgressBarProps {
  active: boolean;
}

const ProgressBar = styled.div<ProgressBarProps>`
  width: 60px;
  height: 5px;
  background-color: ${(props) => (props.active ? '#50b498' : '#ccc')};
`;
