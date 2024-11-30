// features/Advanced_game/ui/StockSlider/stockSlider.tsx
import React, { useState, useEffect, useRef } from 'react';
import { StockChart } from '@/features/Advanced_chat/ui/StockChart/stockchart'; 
import { TradeModal } from '@/features/Advanced_chat/ui/TradeModal/TradeModal';
import { createStockWebSocket } from '@/features/Advanced_chat/model/stockWebSocket';
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
 { id: 4, symbol: 'NAVER', title: '네이버' },
 { id: 5, symbol: 'LG', title: 'LG전자' },
 { id: 6, symbol: 'SK', title: 'SK하이닉스' },
 { id: 7, symbol: 'POSCO', title: '포스코' },
 { id: 8, symbol: 'KIA', title: '기아' },
 { id: 9, symbol: 'HYBE', title: '하이브' },
 { id: 10, symbol: 'COUPANG', title: '쿠팡' },
 { id: 11, symbol: 'KB', title: 'KB금융' },
 { id: 12, symbol: 'SHINHAN', title: '신한금융' },
 { id: 13, symbol: 'CELLTRION', title: '셀트리온' },
 { id: 14, symbol: 'LOTTE', title: '롯데지주' },
 { id: 15, symbol: 'HANWHA', title: '한화에어로스페이스' },
 { id: 16, symbol: 'KEPCO', title: '한국전력' },
 { id: 17, symbol: 'KT', title: 'KT' },
 { id: 18, symbol: 'CJ', title: 'CJ제일제당' },
 { id: 19, symbol: 'AMORE', title: '아모레퍼시픽' },
 { id: 20, symbol: 'NEXON', title: '넥슨게임즈' }
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
 const [availableStocks, setAvailableStocks] = useState<Stock[]>([]);

 useEffect(() => {
  const ws = wsRef.current;
  
  ws.connect((message) => {
    console.log('Received message:', message); // 데이터 확인용
    
    switch (message.type) {
      case 'REFERENCE_DATA': // REFERENCE_DATA 처리 추가
      case 'LIVE_DATA':
        if (Object.keys(stockData).length === 0) {
          const availableSymbols = message.data.map((item: any) => item.symbol);
          console.log('Available symbols:', availableSymbols); // 심볼 확인용
          setAvailableStocks(STOCKS.filter(stock => availableSymbols.includes(stock.symbol)));
        }
        
        setStockData(prevData => {
          console.log('Previous data:', prevData); // 이전 데이터 확인
          const newData = {
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
          };
          console.log('New data:', newData); // 새 데이터 확인
          return newData;
        });
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
       {availableStocks.map((stock) => (
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