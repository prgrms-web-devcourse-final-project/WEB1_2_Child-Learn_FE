// pages/TradePages/StockSlider/index.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StockChart } from '@/features/Advanced_chat/ui/AdvancedGame';

interface StockSliderProps {
 // 필요한 props 정의
}

export const StockSlider: React.FC<StockSliderProps> = () => {
 const [currentSlide, setCurrentSlide] = useState(0);
 const [selectedStock, setSelectedStock] = useState<number | null>(null);
 const [isPlaying, setIsPlaying] = useState(false);
 const [gameTime, setGameTime] = useState(0);

 const stocks = [
   { id: 1, title: "Samsung" },
   { id: 2, title: "Hyundai" },
   { id: 3, title: "Kakao" },
   { id: 4, title: "Naver" },
 ];

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

 const handlePrevSlide = () => {
   setCurrentSlide((prev) => {
     if (prev === 0) return stocks.length - 2;
     return prev - 2;
   });
 };

 const handleNextSlide = () => {
   setCurrentSlide((prev) => {
     if (prev >= stocks.length - 2) return 0;
     return prev + 2;
   });
 };

 return (
   <SlideContainer>
     <TimeDisplay>
       <img src="/img/clock.png" alt="시계" />
       {Math.floor(gameTime / 60)}:{String(gameTime % 60).padStart(2, '0')}
     </TimeDisplay>

     <NavigationButton onClick={handlePrevSlide} position="left">
       <ChevronLeft size={24} />
     </NavigationButton>
     
     <ChartGrid>
       {stocks.slice(currentSlide, currentSlide + 2).map((stock) => (
         <ChartItem key={stock.id}>
           <StockChart
             stockId={stock.id}
             title={stock.title}
             data={[]}
             isSelected={selectedStock === stock.id}
             onClick={() => setSelectedStock(stock.id)}
           />
         </ChartItem>
       ))}
     </ChartGrid>

     <NavigationButton onClick={handleNextSlide} position="right">
       <ChevronRight size={24} />
     </NavigationButton>

     <SlideIndicators>
       {Array.from({ length: Math.ceil(stocks.length / 2) }).map((_, index) => (
         <Indicator
           key={index}
           $active={Math.floor(currentSlide / 2) === index}
           onClick={() => setCurrentSlide(index * 2)}
         />
       ))}
     </SlideIndicators>

     {selectedStock && (
       <ControlPanel>
         <PlayButton onClick={() => setIsPlaying(!isPlaying)}>
           {isPlaying ? '일시정지' : '시작'}
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
 background: #fff;
 padding: 8px;
 border-radius: 20px;
`;

const ChartGrid = styled.div`
 display: grid;
 grid-template-columns: repeat(2, 1fr);
 gap: 30px;
 margin-top: 50px;
`;

const ChartItem = styled.div`
 cursor: pointer;
 transition: transform 0.2s ease;

 &:hover {
   transform: scale(1.01);
 }
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

const NavigationButton = styled.button<{ position: 'left' | 'right' }>`
 position: absolute;
 top: 43%;
 ${props => props.position === 'left' ? 'left: -20px;' : 'right: -20px;'}
 transform: translateY(-50%);
 width: 40px;
 height: 40px;
 border-radius: 50%;
 background: white;
 border: 1px solid #eee;
 cursor: pointer;
 display: flex;
 align-items: center;
 justify-content: center;
 box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
 z-index: 2;

 &:hover {
   background: #f8f8f8;
 }

 &:disabled {
   opacity: 0.5;
   cursor: not-allowed;
 }
`;

const SlideIndicators = styled.div`
 display: flex;
 justify-content: center;
 gap: 8px;
 margin-top: 20px;
`;

const Indicator = styled.div<{ $active: boolean }>`
 width: 8px;
 height: 8px;
 border-radius: 50%;
 background-color: ${props => props.$active ? '#1B63AB' : '#ddd'};
 cursor: pointer;
 transition: background-color 0.3s ease;

 &:hover {
   background-color: ${props => props.$active ? '#1B63AB' : '#bbb'};
 }
`;

const ControlPanel = styled.div`
 display: flex;
 justify-content: center;
 gap: 20px;
 margin-top: 20px;
 padding: 20px;
`;

const Button = styled.button`
 padding: 10px 20px;
 border-radius: 8px;
 border: none;
 font-size: 16px;
 font-weight: 500;
 cursor: pointer;
 transition: all 0.2s ease;
`;

const PlayButton = styled(Button)`
 background: #1B63AB;
 color: white;
 
 &:hover {
   background: #145293;
 }
`;

const TradeButton = styled(Button)`
 background: #50B498;
 color: white;
 
 &:hover {
   background: #429980;
 }
`;

export default StockSlider;

// StockChart.tsx도 필요하다면 제공하겠습니다.