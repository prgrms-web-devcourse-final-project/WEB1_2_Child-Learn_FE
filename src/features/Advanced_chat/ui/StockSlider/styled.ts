// features/Advanced_game/ui/StockSlider/styled.ts
import styled from 'styled-components';

export const SlideContainer = styled.div`
  width: 100%;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  background: #f0fff0;
  padding: 20px;
  border-radius: 20px;
  overflow: hidden;
`;

export const TimeDisplay = styled.div`
  position: absolute;
  top: -4px;
  right: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 17px;
  font-weight: bold;
  color: #333;
  z-index: 10;

  img {
    width: 20px;
    height: 20px;
  }
`;

export const ChartGrid = styled.div`
  position: relative;
  width: 413%;  // 차트너비
  display: flex;
  transition: transform 0.3s ease;
`;

export const ChartItem = styled.div`
  width: 25%;  
  flex-shrink: 0;
  padding: 0 23px;
`;

export const NavigationButton = styled.button<{ $show?: boolean; position?: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${props => props.position === 'left' ? 'left: -1px;' : 'right: -1px;'};
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: ${props => props.$show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  img {
    width: 20px;
    height: 20px;
    transform: ${props => props.position === 'left' ? 'rotate(180deg)' : 'none'};
  }

  &:hover {
    background: rgba(255, 255, 255, 1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ControlPanel = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

export const PlayButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 24px;
    height: 24px;
  }

  &:hover {
    background: #ffffff;
  }
`;

export const TradeButton = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  background: #50B498;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #429980;
  }
`;

export const SlideIndicators = styled.div<{ $show?: boolean }>`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  visibility: ${props => props.$show ? 'visible' : 'hidden'};
`;

export const Indicator = styled.div<{ $active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.$active ? '#50B498' : '#ddd'};
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.$active ? '#50B498' : '#bbb'};
  }
`;