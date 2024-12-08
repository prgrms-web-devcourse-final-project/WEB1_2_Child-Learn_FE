import React, { useState, useEffect, useRef } from 'react';
import { StockChart } from '@/features/Advanced_chat/ui/StockChart/stockchart'; 
import { TradeModal } from '@/features/Advanced_chat/ui/TradeModal/TradeModal';
import { StockWebSocket } from '@/features/Advanced_chat/model/stockWebSocket';
import { 
  Stock,
  StockPrice
} from '@/features/Advanced_chat/types/stock';
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

// Custom Hook for Game Timer
const useGameTimer = ({ 
  isPlaying, 
  onGameEnd 
}: {
  isPlaying: boolean;
  onGameEnd?: () => void;
}) => {
  const [gameTime, setGameTime] = useState(0);
  const lastUpdateTime = useRef<number | null>(null);
  const MAX_GAME_TIME = 420; // 7 minutes in seconds

  useEffect(() => {
    let animationFrameId: number;
    
    const updateTimer = () => {
      const currentTime = Date.now();
      
      if (isPlaying) {
        if (lastUpdateTime.current) {
          const deltaTime = Math.floor((currentTime - lastUpdateTime.current) / 1000);
          
          if (deltaTime >= 1) {
            setGameTime(prev => {
              const newTime = prev + deltaTime;
              
              if (newTime >= MAX_GAME_TIME) {
                onGameEnd?.();
                return MAX_GAME_TIME;
              }
              
              return newTime;
            });
            
            lastUpdateTime.current = currentTime;
          }
        } else {
          lastUpdateTime.current = currentTime;
        }
        
        animationFrameId = requestAnimationFrame(updateTimer);
      }
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(updateTimer);
    } else {
      lastUpdateTime.current = null;
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying, onGameEnd]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return {
    gameTime,
    formattedTime: formatTime(gameTime),
    isTimeUp: gameTime >= MAX_GAME_TIME
  };
};

export const StockSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const [selectedStock, setSelectedStock] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stockData, setStockData] = useState<Record<string, StockPrice[]>>({});
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [availableStocks, setAvailableStocks] = useState<Stock[]>([]);
  const wsRef = useRef(StockWebSocket.getInstance());

  const { formattedTime, isTimeUp } = useGameTimer({
    isPlaying,
    onGameEnd: () => {
      setIsPlaying(false);
    }
  });

  useEffect(() => {
    const ws = wsRef.current;
    
    const messageHandler = (message: any) => {
      console.log('Received message:', message);
      
      switch (message.action) {
        case 'REFERENCE_DATA':
          if (message.data?.stocks) {
            setAvailableStocks(message.data.stocks);
          }
          if (message.data) {
            handleStockData(message.data);
          }
          break;

        case 'LIVE_DATA':
          if (message.data) {
            handleStockData(message.data);
          }
          break;

        case 'END_GAME':
          setIsPlaying(false);
          break;
      }
    };

    const handleStockData = (data: any) => {
      if (!data) return;
      
      setStockData(prevData => {
        const newData = { ...prevData };
        const newPrice = {
          timestamp: new Date(data.timestamp * 1000).toISOString(),
          price: data.closePrice,
          open: data.openPrice,
          high: data.highPrice,
          low: data.lowPrice,
          close: data.closePrice,
          change: data.change || 0,
          volume: data.volume || 0
        };
        
        newData[data.symbol] = newData[data.symbol] 
          ? [newPrice, ...newData[data.symbol]]
          : [newPrice];
        
        return newData;
      });
    };

    ws.onMessage(messageHandler);

    // START_GAME은 connect()시 자동으로 전송됨
    ws.connect();

    return () => ws.disconnect();
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide(prev => Math.max(0, prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide(prev => Math.min(prev + 1, availableStocks.length - 1));
  };

  const handlePlayClick = () => {
    setIsPlaying(!isPlaying);
  };

  if (availableStocks.length === 0) {
    return <div>주식 데이터를 불러오는 중...</div>;
  }

  return (
    <SlideContainer>
      <TimeDisplay>
        <img src="/img/timer.png" alt="시계" />
        {formattedTime}
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