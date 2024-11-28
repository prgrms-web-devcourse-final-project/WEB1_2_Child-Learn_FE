import styled from 'styled-components';

export const ChartContainer = styled.div<{ $isSelected?: boolean }>`
 background: white;
 border-radius: 12px;
 padding: 16px;
 box-shadow: ${props => props.$isSelected 
   ? '0 0 0 2px #fdfdfd, 0 4px 12px rgba(0, 0, 0, 0.1)'
   : '0 4px 12px rgba(0, 0, 0, 0.1)'};
 transition: all 0.1s ease;
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