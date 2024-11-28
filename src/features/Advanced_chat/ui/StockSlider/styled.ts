import styled from 'styled-components';

export const NavigationButton = styled.button<{ position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${props => props.position === 'left' ? 'left: 10px;' : 'right: 10px;'}
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ChartGrid = styled.div`
  width: 100%;
  display: flex;
  transition: transform 0.3s ease;
`;

export const ChartItem = styled.div`
  flex: 0 0 100%;
  transition: transform 0.3s ease;
`;

export const SlideContainer = styled.div`
 width: 100%;
 max-width: 1200px;
 margin: 0 auto;
 position: relative;
 background: #f0fff0;
 padding: 20px;
 border-radius: 20px;
`;

export const TimeDisplay = styled.div`
 position: absolute;
 top: 20px;
 right: 20px;
 display: flex;
 align-items: center;
 gap: 8px;
 font-size: 20px;
 font-weight: bold;
 color: #333;

 img {
   width: 24px;
   height: 24px;
 }
`;

export const ControlPanel = styled.div`
 display: flex;
 justify-content: center;
 gap: 20px;
 margin-top: 20px;
 padding: 20px;
`;

export const PlayButton = styled.button`
 width: 48px;
 height: 48px;
 border-radius: 50%;
 border: none;
 background: #1B63AB;
 cursor: pointer;
 display: flex;
 align-items: center;
 justify-content: center;
 
 img {
   width: 24px;
   height: 24px;
 }

 &:hover {
   background: #145293;
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