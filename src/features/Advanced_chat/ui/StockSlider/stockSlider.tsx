import React, { useState, useEffect, useRef } from 'react';
import { StockChart } from '@/features/Advanced_chat/ui/StockChart/stockchart'; 
import { TradeModal } from '@/features/Advanced_chat/ui/TradeModal/TradeModal';
import { StockWebSocket } from '@/features/Advanced_chat/model/stockWebSocket';
import { Stock, StockPrice } from '@/features/Advanced_chat/types/stock';
import styled from 'styled-components';

// Styled Components
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

export const ChartGrid = styled.div<{ itemCount: number }>`
  position: relative;
  width: ${props => props.itemCount * 100}%;
  display: flex;
  transition: transform 0.3s ease;
`;

export const ChartItem = styled.div<{ itemCount: number }>`
  width: ${props => 100 / props.itemCount}%;
  flex-shrink: 0;
  padding: 0 25px;
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
    background: #f5f5f5;
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

// Game Timer Hook
const useGameTimer = ({ isPlaying, onGameEnd }: {
  isPlaying: boolean;
  onGameEnd?: () => void;
}) => {
  const [gameTime, setGameTime] = useState(0);
  const lastUpdateTime = useRef<number | null>(null);
  const MAX_GAME_TIME = 420;

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

// Main Component
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
      wsRef.current.sendMessage({ action: "END_GAME" });
    }
  });

  const processStockData = (data: any): StockPrice => ({
    timestamp: new Date().toISOString(),
    price: Number(data.closePrice || 0),
    open: Number(data.openPrice || 0),
    high: Number(data.highPrice || 0),
    low: Number(data.lowPrice || 0),
    close: Number(data.closePrice || 0),
    change: 0,
    volume: 0
  });

  const handleInitialData = (data: any[]) => {
    const groupedData: Record<string, StockPrice[]> = {};
    const uniqueStocks = new Set<string>();

    data.forEach(item => {
      uniqueStocks.add(item.symbol);
      if (!groupedData[item.symbol]) {
        groupedData[item.symbol] = [];
      }
      groupedData[item.symbol].push(processStockData(item));
    });

    const stocks = Array.from(uniqueStocks).map(symbol => ({
      id: symbol === 'AAPL' ? 1 : 2,
      symbol: symbol,
      title: data.find(item => item.symbol === symbol)?.name || symbol
    }));

    setAvailableStocks(stocks);
    setStockData(groupedData);
  };

  const handleStockData = (data: any) => {
    if (!data?.symbol) return;

    setStockData(prevData => {
      const processedPrice = processStockData(data);
      const newData = {
        ...prevData,
        [data.symbol]: [processedPrice, ...(prevData[data.symbol] || [])].slice(0, 100)
      };
      return newData;
    });
  };

  useEffect(() => {
    const ws = wsRef.current;
    
    const messageHandler = (message: any) => {
      try {
        const data = typeof message === 'string' ? JSON.parse(message) : message;
        
        if (Array.isArray(data)) {
          handleInitialData(data);
        } else if (typeof data === 'object' && data.symbol) {
          handleStockData(data);
        } else if (data === '게임이 종료되었습니다.') {
          setIsPlaying(false);
        }
      } catch (error) {
        console.error('메시지 처리 중 에러:', error);
      }
    };

    ws.onMessage(messageHandler);
    ws.connect();

    return () => {
      ws.disconnect();
    };
  }, []);

  const handlePlayClick = () => {
    wsRef.current.sendMessage({
      action: isPlaying ? "PAUSE_GAME" : "RESUME_GAME"
    });
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
        onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
        disabled={currentSlide === 0}
      >
        <img src="/img/arrow2.png" alt="이전" />
      </NavigationButton>

      <ChartGrid 
        itemCount={availableStocks.length} 
        style={{ transform: `translateX(-${currentSlide * (100 / availableStocks.length)}%)` }}
      >
        {availableStocks.map((stock) => (
          <ChartItem key={stock.id} itemCount={availableStocks.length}>
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
        onClick={() => setCurrentSlide(prev => Math.min(prev + 1, availableStocks.length - 1))}
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
          priceHistory={stockData[availableStocks.find(s => s.id === selectedStock)?.symbol || ''] || []}
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