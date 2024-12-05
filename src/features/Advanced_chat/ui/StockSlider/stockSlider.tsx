// features/Advanced_chat/ui/StockSlider/StockSlider.tsx
import React, { useState, useEffect, useRef } from 'react';
import { StockChart } from '@/features/Advanced_chat/ui/StockChart/stockchart'; 
import { TradeModal } from '@/features/Advanced_chat/ui/TradeModal/TradeModal';
import { StockWebSocket } from '@/features/Advanced_chat/model/stockWebSocket';
import { WebSocketActions } from '@/features/Advanced_chat/model/stockWebSocket';
import { 
  WebSocketMessage, 
  Stock,
  StockPrice
} from '@/features/Advanced_chat/types/stock';
import { generateUUID } from '@/features/Advanced_chat/utils/uuid';
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


export const StockSlider: React.FC = () => {
  const [gameId] = useState<string>(generateUUID());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const [selectedStock, setSelectedStock] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [stockData, setStockData] = useState<Record<string, StockPrice[]>>({});
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [availableStocks, setAvailableStocks] = useState<Stock[]>([]);
  const wsRef = useRef(StockWebSocket.getInstance());

  useEffect(() => {
    const ws = wsRef.current;
    ws.connect();

    const messageHandler = (message: WebSocketMessage) => {
      if (!message.action) {
        console.error("Invalid message: missing action");
        return;
      }
      console.log(`Received message (GameID: ${gameId}):`, message);
      
      switch (message.type) {
        case WebSocketActions.REFERENCE_DATA:
          if (message.data?.stocks) {
            setAvailableStocks(message.data.stocks);
          }
          if (message.data) {
            handleStockData(message.data);
          }
          break;

        case WebSocketActions.LIVE_DATA:
          if (message.data) {
            handleStockData(message.data);
          }
          break;

        case WebSocketActions.END_GAME:
          setIsPlaying(false);
          break;
      }
    };

    const handleStockData = (data: WebSocketMessage['data']) => {
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
    ws.sendMessage(WebSocketActions.REFERENCE_DATA, { gameId });

    return () => ws.disconnect();
  }, [gameId]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setGameTime(prev => {
          if (prev >= 420) {
            wsRef.current.sendMessage(WebSocketActions.END_GAME, { gameId });
            setIsPlaying(false);  
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, gameId]);

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
      wsRef.current.sendMessage(WebSocketActions.START_GAME, { gameId });
      setIsPlaying(true);
    } else {
      wsRef.current.sendMessage(WebSocketActions.PAUSE_GAME, { gameId });
      setIsPlaying(false);
    }
  };

  if (availableStocks.length === 0) {
    return <div>주식 데이터를 불러오는 중...</div>;
  }

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