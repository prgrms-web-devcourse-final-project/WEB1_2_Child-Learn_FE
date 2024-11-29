// features/Advanced_game/ui/StockSlider/stockSlider.tsx
import React, { useState, useEffect } from 'react';
import { StockChart } from '@/features/Advanced_chat/ui/StockChart/stockchart'; 
import { TradeModal } from '@/features/Advanced_chat/ui/TradeModal/TradeModal';
import {
 SlideContainer,
 TimeDisplay,
 ChartGrid, 
 ChartItem,
 NavigationButton,
 ControlPanel,
 PlayButton,
 TradeButton,
 SlideIndicators,
 Indicator
} from './styled';
  
interface Stock {
 id: number;
 symbol: string;
 title: string;
}

interface StockPrice {
 timestamp: string;
 price: number;
 open: number;
 high: number;
 low: number;
 close: number;
 change: number;
 volume: number;
}

const STOCKS: Stock[] = [
 { id: 1, symbol: 'SAMSUNG', title: '삼성전자' },
 { id: 2, symbol: 'HYUNDAI', title: '현대차' },
 { id: 3, symbol: 'KAKAO', title: '카카오' },
 { id: 4, symbol: 'NAVER', title: '네이버' }
];

export const StockSlider: React.FC = () => {
 const [currentSlide, setCurrentSlide] = useState(0);
 const [showActions, setShowActions] = useState(false);
 const [selectedStock, setSelectedStock] = useState<number | null>(null);
 const [isPlaying, setIsPlaying] = useState(false);
 const [gameTime, setGameTime] = useState(0);
 const [stockData, setStockData] = useState<Record<string, StockPrice[]>>({});
 const [showTradeModal, setShowTradeModal] = useState(false);

 useEffect(() => {
   const fetchStockData = async () => {
     try {
       const responses = await Promise.all(
         STOCKS.map(stock => 
           fetch(`/api/v1/advanced-game/stocks/${stock.symbol}`).then(res => res.json())
         )
       );
       
       const newStockData: Record<string, StockPrice[]> = {};
       responses.forEach((data, index) => {
         newStockData[STOCKS[index].symbol] = data;
       });
       setStockData(newStockData);
     } catch (error) {
       console.error('Failed to load stock data:', error);
     }
   };

   fetchStockData();
 }, []);

 useEffect(() => {
   let timer: NodeJS.Timeout;
   if (isPlaying) {
     timer = setInterval(() => {
       setGameTime(prev => {
         if (prev >= 540) {
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

 const handlePrevSlide = () => {
   setCurrentSlide(prev => Math.max(0, prev - 1));
 };

 const handleNextSlide = () => {
   setCurrentSlide(prev => Math.min(STOCKS.length - 1, prev + 1));
 };

 return (
   <SlideContainer>
     <TimeDisplay>
       <img src="/img/timer.png" alt="시계" />
       {formatTime(gameTime)}
     </TimeDisplay>

     <NavigationButton 
       $show={!showActions}
       position="left" 
       onClick={handlePrevSlide}
       disabled={currentSlide === 0}
     >
       <img src="/img/arrow2.png" alt="이전" />
     </NavigationButton>

     <ChartGrid style={{ transform: `translateX(-${currentSlide * 25}%)` }}>
       {STOCKS.map((stock) => (
         <ChartItem key={stock.id}>
           <StockChart
             stockId={stock.id}
             title={stock.title}
             data={stockData[stock.symbol] || []}
             isSelected={selectedStock === stock.id}
             onClick={() => setSelectedStock(stock.id)}
           />
         </ChartItem>
       ))}
     </ChartGrid>

     <NavigationButton 
       $show={!showActions}
       position="right" 
       onClick={handleNextSlide}
       disabled={currentSlide === STOCKS.length - 1}
     >
       <img src="/img/arrow2.png" alt="다음" />
     </NavigationButton>

     {selectedStock && (
       <ControlPanel>
         <PlayButton onClick={() => setIsPlaying(!isPlaying)}>
           {isPlaying ? (
             <img src="/img/pause.png" alt="일시정지" />
           ) : (
             <img src="/img/play.png" alt="시작" />
           )}
         </PlayButton>
         <TradeButton onClick={() => setShowTradeModal(true)}>거래하기</TradeButton>
       </ControlPanel>
     )}

     {showTradeModal && selectedStock && (
       <TradeModal
         isOpen={showTradeModal}
         onClose={() => setShowTradeModal(false)}
         stockName={STOCKS.find(s => s.id === selectedStock)?.title || ''}
         currentPrice={
           stockData[STOCKS.find(s => s.id === selectedStock)?.symbol || '']?.[0]?.close || 0
         }
         priceHistory={stockData[STOCKS.find(s => s.id === selectedStock)?.symbol || ''] || []}
       />
     )}

     <SlideIndicators $show={!showActions}>
       {STOCKS.map((_, index) => (
         <Indicator
           key={index}
           $active={index === currentSlide}
           onClick={() => setCurrentSlide(index)}
         />
       ))}
     </SlideIndicators>
   </SlideContainer>
 );
};

export default StockSlider;