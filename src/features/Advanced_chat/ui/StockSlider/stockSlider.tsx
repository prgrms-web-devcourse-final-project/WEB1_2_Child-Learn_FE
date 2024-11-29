// features/Advanced_game/ui/StockSlider/stockSlider.tsx
import React, { useState, useEffect, useRef } from 'react';
import { StockChart } from '@/features/Advanced_chat/ui/StockChart/stockchart'; 
import { TradeModal } from '@/features/Advanced_chat/ui/TradeModal/TradeModal';
import { createStockWebSocket } from '../../model/stockWebSocket';
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
 const [wsConnected, setWsConnected] = useState(false);
 const wsRef = useRef(createStockWebSocket());

 useEffect(() => {
   const ws = wsRef.current;
   
   ws.connect((message) => {
     switch (message.type) {
       case 'LIVE_DATA':
         setStockData(prevData => ({
           ...prevData,
           ...message.data.reduce((acc: Record<string, StockPrice[]>, item: any) => {
             acc[item.symbol] = [
               {
                 timestamp: new Date(item.timestamp * 1000).toISOString(),
                 price: item.closePrice,
                 open: item.openPrice,
                 high: item.highPrice,
                 low: item.lowPrice,
                 close: item.closePrice,
                 change: 0,
                 volume: 0
               },
               ...(prevData[item.symbol] || [])
             ];
             return acc;
           }, {})
         }));
         break;
       case 'END_GAME':
         setIsPlaying(false);
         break;
     }
   });

   setWsConnected(true);

   return () => {
     ws.disconnect();
   };
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

 const handlePlayClick = () => {
   if (!isPlaying) {
     wsRef.current.sendMessage('START_GAME');
   } else {
     wsRef.current.sendMessage('PAUSE_GAME');
   }
   setIsPlaying(!isPlaying);
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
         <PlayButton onClick={handlePlayClick}>
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