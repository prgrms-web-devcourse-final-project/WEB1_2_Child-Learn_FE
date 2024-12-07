import styled from 'styled-components';

export const ChartContainer = styled.div<{ $isSelected?: boolean }>`
 background: white;
  border-radius: 20px;
  padding: 23px;
  margin-left: -40px;  // 왼쪽으로 이동
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`;

export interface GameState {
  phase: 'BEFORE' | 'TRADING';
  isPlaying: boolean;
  elapsedTime: number;
  playedToday: boolean;
}