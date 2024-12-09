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
      wsRef.current.sendMessage({
        action: "END_GAME"
      });
    }
  });

  const processStockData = (data: any): StockPrice => {
    return {
      timestamp: new Date().toISOString(),
      price: String(data.closePrice || 0),
      open: String(data.openPrice || 0),
      high: String(data.highPrice || 0),
      low: String(data.lowPrice || 0),
      close: String(data.closePrice || 0),
      change: 0,
      volume: 0
    };
  };

  const handleInitialData = (data: any[]) => {
    // 심볼별로 데이터 그룹화
    const groupedData: Record<string, StockPrice[]> = {};
    const uniqueStocks = new Set<string>();

    data.forEach(item => {
      uniqueStocks.add(item.symbol);
      if (!groupedData[item.symbol]) {
        groupedData[item.symbol] = [];
      }
      groupedData[item.symbol].push(processStockData(item));
    });

    // 사용 가능한 주식 목록 설정
    const stocks = Array.from(uniqueStocks).map(symbol => ({
      id: symbol === 'AAPL' ? 1 : 2,
      symbol: symbol,
      title: data.find(item => item.symbol === symbol)?.name || symbol
    }));

    console.log('그룹화된 데이터:', groupedData);
    console.log('사용 가능한 주식:', stocks);

    setAvailableStocks(stocks);
    setStockData(groupedData);
  };

  const handleStockData = (data: any) => {
    if (!data?.symbol) {
      console.warn('유효하지 않은 주식 데이터:', data);
      return;
    }

    setStockData(prevData => {
      const newData = { ...prevData };
      const processedPrice = processStockData(data);
      
      newData[data.symbol] = [
        processedPrice,
        ...(prevData[data.symbol] || [])
      ].slice(0, 100);
      
      console.log(`${data.symbol} 데이터 업데이트:`, newData[data.symbol]);
      return newData;
    });
  };

  useEffect(() => {
    const ws = wsRef.current;
    
    const messageHandler = (message: any) => {
      try {
        const data = typeof message === 'string' ? JSON.parse(message) : message;
        console.log('받은 메시지:', data);

        // 배열 데이터 처리 (초기 데이터)
        if (Array.isArray(data)) {
          console.log('초기 데이터 처리:', data.length);
          handleInitialData(data);
        }
        // 단일 데이터 업데이트 처리
        else if (typeof data === 'object' && data.symbol) {
          console.log('실시간 데이터 처리:', data);
          handleStockData(data);
        }
        // 게임 종료 메시지 처리
        else if (data === '게임이 종료되었습니다.') {
          console.log('게임 종료');
          setIsPlaying(false);
        }

      } catch (error) {
        console.error('메시지 처리 중 에러:', error);
      }
    };

    ws.onMessage(messageHandler);

    console.log('WebSocket 연결 시도');
    ws.connect().catch(error => {
      console.error('WebSocket 연결 실패:', error);
    });

    return () => {
      console.log('WebSocket 연결 종료');
      ws.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log('현재 stockData:', stockData);
    console.log('사용 가능한 주식:', availableStocks);
  }, [stockData, availableStocks]);

  const handlePrevSlide = () => {
    setCurrentSlide(prev => Math.max(0, prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide(prev => Math.min(prev + 1, availableStocks.length - 1));
  };

  const handlePlayClick = () => {
    if (!isPlaying) {
      wsRef.current.sendMessage({
        action: "RESUME_GAME"
      });
    } else {
      wsRef.current.sendMessage({
        action: "PAUSE_GAME"
      });
    }
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
        {availableStocks.map((stock) => {
          console.log(`${stock.symbol} 차트 데이터:`, stockData[stock.symbol]);
          return (
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
          );
        })}
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