import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { StockChart } from '@/features/Advanced_chat/ui/AdvancedGame';
import timer from '../../../../public/img/timer.png';


interface StockSliderProps {
 // props 필요시 추가
}

export const StockSlider: React.FC<StockSliderProps> = () => {
 const [currentSlide, setCurrentSlide] = useState(0);
 const [showActions, setShowActions] = useState(false);
 const [selectedStock, setSelectedStock] = useState<number | null>(null);
 const [isPlaying, setIsPlaying] = useState(false);
 const [gameTime, setGameTime] = useState(0);

 useEffect(() => {
   let timer: NodeJS.Timeout;
   if (isPlaying) {
     timer = setInterval(() => {
       setGameTime(prev => {
         if (prev >= 540) { // 9분 = 540초
           setIsPlaying(false);
           return prev;
         }
         return prev + 1;
       });
     }, 1000);
   }
   return () => clearInterval(timer);
 }, [isPlaying]);

 const formatTime = (seconds: number) => {
   const mins = Math.floor(seconds / 60);
   const secs = seconds % 60;
   return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
 };

 return (
   <SlideContainer>
     <TimeDisplay>
       <img src={timer} alt="시계" />
       {formatTime(gameTime)}
     </TimeDisplay>
     
     <ChartGrid>
       <ChartItem>
         <StockChart
           stockId={1}
           title="Samsung"
           data={[]} // 실제 데이터는 mock에서 가져올 예정
           isSelected={selectedStock === 1}
           onClick={() => setSelectedStock(1)}
         />
       </ChartItem>
       <ChartItem>
         <StockChart
           stockId={2}
           title="Hyundai"
           data={[]}
           isSelected={selectedStock === 2}
           onClick={() => setSelectedStock(2)}
         />
       </ChartItem>
       <ChartItem>
         <StockChart
           stockId={3}
           title="Kakao"
           data={[]}
           isSelected={selectedStock === 3}
           onClick={() => setSelectedStock(3)}
         />
       </ChartItem>
       <ChartItem>
         <StockChart
           stockId={4}
           title="Naver"
           data={[]}
           isSelected={selectedStock === 4}
           onClick={() => setSelectedStock(4)}
         />
       </ChartItem>
     </ChartGrid>

     {selectedStock && (
       <ControlPanel>
         <PlayButton onClick={() => setIsPlaying(!isPlaying)}>
           {isPlaying ? (
             <img src="/img/pause.png" alt="일시정지" />
           ) : (
             <img src="/img/play.png" alt="시작" />
           )}
         </PlayButton>
         <TradeButton>거래하기</TradeButton>
       </ControlPanel>
     )}
   </SlideContainer>
 );
};

const SlideContainer = styled.div`
 width: 100%;
 max-width: 1200px;
 margin: 0 auto;
 position: relative;
 background: #f0fff0;
 padding: 20px;
 border-radius: 20px;
`;

const TimeDisplay = styled.div`
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

const ChartGrid = styled.div`
 display: grid;
 grid-template-columns: repeat(2, 1fr);
 gap: 20px;
 margin-top: 20px;
`;

const ChartItem = styled.div`
 cursor: pointer;
 transition: transform 0.2s ease;

 &:hover {
   transform: scale(1.01);
 }
`;

const ControlPanel = styled.div`
 display: flex;
 justify-content: center;
 gap: 20px;
 margin-top: 20px;
 padding: 20px;
`;

const PlayButton = styled.button`
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

const TradeButton = styled.button`
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