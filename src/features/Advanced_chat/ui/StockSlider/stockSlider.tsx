// src/features/Advanced_game/ui/StockSlider/stockSlider.tsx

import React, { useState, useEffect, useRef } from 'react';
import { StockChart } from '@/features/Advanced_chat/ui/StockChart/stockchart'; 
import { TradeModal } from '@/features/Advanced_chat/ui/TradeModal/TradeModal';
import { StockWebSocket } from '@/features/Advanced_chat/model/stockWebSocket';
import { WebSocketActions } from '@/features/Advanced_chat/types/stock';
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
  
interface StockMessage {
  type: WebSocketActions;
  data?: {
    symbol: string;
    timestamp: number;
    closePrice: string;
    openPrice: string;
    highPrice: string;
    lowPrice: string;
    change?: number;
    volume?: number;
  };
}

interface Stock {
  id: number;
  symbol: string;
  title: string;
}

interface StockPrice {
  timestamp: string;
  price: string;
  open: string;
  high: string;
  low: string;
  close: string;
  change: number;
  volume: number;
}

const INITIAL_STOCKS: Stock[] = [
  { id: 1, symbol: 'SAMSUNG', title: '삼성전자' },
  { id: 2, symbol: 'HYUNDAI', title: '현대차' },
  { id: 3, symbol: 'KAKAO', title: '카카오' },
  { id: 4, symbol: 'NAVER', title: '네이버' }
];

// 임시 데이터 생성 함수 수정
const generateMockData = (symbol: string, prevPrice?: number) => {
  const basePrice = prevPrice || (
    symbol === 'SAMSUNG' ? 70000 : 
    symbol === 'HYUNDAI' ? 180000 : 
    symbol === 'KAKAO' ? 50000 : 250000
  );
  
  const randomChange = (Math.random() - 0.5) * 1000;
  const open = basePrice;
  const close = basePrice + randomChange;
  const high = Math.max(open, close) + Math.random() * 200;
  const low = Math.min(open, close) - Math.random() * 200;

  return {
    timestamp: new Date().toISOString(),
    price: close.toString(),
    open: open.toString(),
    high: high.toString(),
    low: low.toString(),
    close: close.toString(),
    change: randomChange,
    volume: Math.floor(Math.random() * 10000)
  };
};

export const StockSlider: React.FC = () => {
  const [gameId] = useState<string>(crypto.randomUUID());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const [selectedStock, setSelectedStock] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [stockData, setStockData] = useState<Record<string, StockPrice[]>>({});
  const [showTradeModal, setShowTradeModal] = useState(false);
  const wsRef = useRef(new StockWebSocket());
  const [availableStocks] = useState<Stock[]>(INITIAL_STOCKS);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const ws = wsRef.current;
    
    const messageHandler = (message: StockMessage) => {
      console.log('Received message:', message);
      
      switch (message.type) {
        case 'REFERENCE_DATA':
        case 'LIVE_DATA':
          if (message.data) {
            setStockData(prevData => {
              const newData = { ...prevData };
              const item = message.data!;
              
              console.log('Processing websocket data:', item);
              
              const newPrice = {
                timestamp: new Date(item.timestamp * 1000).toISOString(),
                price: item.closePrice,
                open: item.openPrice,
                high: item.highPrice,
                low: item.lowPrice,
                close: item.closePrice,
                change: item.change || 0,
                volume: item.volume || 0
              };
              
              console.log('New price data:', newPrice);
              console.log('Current data for symbol:', newData[item.symbol]);
              
              newData[item.symbol] = newData[item.symbol] 
                ? [newPrice, ...newData[item.symbol]]
                : [newPrice];
              return newData;
            });
          }
          break;

        case 'END_GAME':
          setIsPlaying(false);
          break;
      }
    };

    ws.onMessage((message) => {
      messageHandler(message as unknown as StockMessage);
    });

    return () => {
      ws.disconnect();
    };
  }, []); 

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setGameTime(prev => {
          if (prev >= 420) {
            setIsPlaying(false);  
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, gameId]);

  useEffect(() => {
    // 초기 데이터 설정
    const initialData: Record<string, any> = {};
    INITIAL_STOCKS.forEach(stock => {
      initialData[stock.symbol] = Array(10).fill(null).map(() => 
        generateMockData(stock.symbol)
      );
    });
    setStockData(initialData);
  }, []);

  useEffect(() => {
    // 컴포넌트 언마운트 시 정리
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handlePrevSlide = () => {
    setCurrentSlide(prev => Math.max(0, prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide(prev => Math.min(prev + 1, availableStocks.length - 1));
  };

  const handlePlayClick = () => {
    if (!isPlaying) {
      // 게임 시작
      const interval = setInterval(() => {
        setStockData(prevData => {
          const newData = { ...prevData };
          INITIAL_STOCKS.forEach(stock => {
            const lastPrice = newData[stock.symbol]?.[0];
            const newPrice = generateMockData(
              stock.symbol, 
              lastPrice ? parseFloat(lastPrice.close) : undefined
            );
            newData[stock.symbol] = [newPrice, ...(newData[stock.symbol] || []).slice(0, 9)];
          });
          return newData;
        });
      }, 3000);

      intervalRef.current = interval;
    } else {
      // 게임 일시정지
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
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
        $show={!selectedStock}
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
              isPlaying={isPlaying}
            />
          </ChartItem>
        ))}
      </ChartGrid>

      <NavigationButton 
        $show={!selectedStock}
        position="right" 
        onClick={handleNextSlide}
        disabled={currentSlide === availableStocks.length - 1}
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
          stockName={availableStocks.find(s => s.id === selectedStock)?.title || ''}
          currentPrice={Number(stockData[availableStocks.find(s => s.id === selectedStock)?.symbol || '']?.[0]?.close || '0')}
          priceHistory={stockData[availableStocks.find(s => s.id === selectedStock)?.symbol || '']?.map(price => ({
            ...price,
            price: Number(price.price),
            open: Number(price.open),
            high: Number(price.high),
            low: Number(price.low),
            close: Number(price.close)
          })) || []}
          isPlaying={isPlaying}
        />
      )}

      <SlideIndicators $show={!showActions}>
        {availableStocks.map((_, index) => (
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