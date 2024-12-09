import React, { useState, useEffect, useRef } from 'react';
import { StockChart } from '@/features/Advanced_chat/ui/StockChart/stockchart'; 
import { TradeModal } from '@/features/Advanced_chat/ui/TradeModal/TradeModal';
import { StockWebSocket } from '@/features/Advanced_chat/model/stockWebSocket';
import { useArticle } from '@/features/article/model/useArticle';
import ArticleCard from '@/features/article/ui/ArticleCard';
import styled from 'styled-components';
import { Stock, StockPrice } from '@/features/Advanced_chat/types/stock';

interface AdvancedGameStockSliderProps {
  stockId: number;
  stockName: string;
}

const ArticleContent = styled.div`
 padding: 20px;
`;

const Content = styled.div`
 font-size: 14px;
 line-height: 1.8;
 color: #333;
`;

const Column = styled.div`
 display: flex;
 flex-direction: column;
 gap: 20px;
`;

const SlideContainer = styled.div`
 position: relative;
 width: 100%;
 overflow: hidden;
 margin: 20px 0;
`;

const TimeDisplay = styled.div`
 position: absolute;
 top: 10px;
 left: 10px;
 z-index: 10;
 display: flex;
 align-items: center;
 gap: 5px;
 background: rgba(0, 0, 0, 0.7);
 color: white;
 padding: 5px 10px;
 border-radius: 5px;

 img {
   width: 20px;
   height: 20px;
 }
`;

const ChartGrid = styled.div`
 display: flex;
 transition: transform 0.3s ease;
`;

const ChartItem = styled.div`
 flex: 0 0 25%;
 padding: 10px;
`;

const NavigationButton = styled.button<{ position: 'left' | 'right', $show?: boolean }>`
 position: absolute;
 top: 50%;
 transform: translateY(-50%);
 ${props => props.position === 'left' ? 'left: 10px' : 'right: 10px'};
 display: ${props => props.$show ? 'block' : 'none'};
 background: none;
 border: none;
 cursor: pointer;
 z-index: 10;

 img {
   width: 30px;
   height: 30px;
   transform: ${props => props.position === 'left' ? 'rotate(180deg)' : 'none'};
 }

 &:disabled {
   opacity: 0.5;
   cursor: not-allowed;
 }
`;

const ControlPanel = styled.div`
 position: absolute;
 bottom: 20px;
 left: 50%;
 transform: translateX(-50%);
 display: flex;
 gap: 10px;
 z-index: 10;
`;

const PlayButton = styled.button`
 background: rgba(0, 0, 0, 0.7);
 border: none;
 border-radius: 50%;
 width: 40px;
 height: 40px;
 display: flex;
 align-items: center;
 justify-content: center;
 cursor: pointer;

 img {
   width: 20px;
   height: 20px;
 }
`;

const TradeButton = styled.button`
 background: #007bff;
 color: white;
 border: none;
 border-radius: 20px;
 padding: 0 20px;
 height: 40px;
 cursor: pointer;

 &:hover {
   background: #0056b3;
 }
`;

const SlideIndicators = styled.div<{ $show: boolean }>`
 position: absolute;
 bottom: 20px;
 left: 50%;
 transform: translateX(-50%);
 display: ${props => props.$show ? 'flex' : 'none'};
 gap: 10px;
 z-index: 10;
`;

const Indicator = styled.div<{ $active: boolean }>`
 width: 10px;
 height: 10px;
 border-radius: 50%;
 background: ${props => props.$active ? '#fff' : 'rgba(255, 255, 255, 0.5)'};
 cursor: pointer;
`;

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

export const AdvancedArticlePage: React.FC = () => {
 const { articles, loading, error } = useArticle('ADVANCED');
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
      price: Number(data.closePrice || 0),
      open: Number(data.openPrice || 0),
      high: Number(data.highPrice || 0),
      low: Number(data.lowPrice || 0),
      close: Number(data.closePrice || 0),
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
  <Column>
  <SlideContainer>
    <TimeDisplay>
      <img src="/img/timer.png" alt="시계" />
      {formattedTime}
    </TimeDisplay>
 
    <ChartGrid style={{ transform: `translateX(-${currentSlide * 25}%)` }}>
      {availableStocks.map((stock) => (
        <ChartItem key={stock.id}>
          <StockChart
            stockId={stock.id}
            title={stock.title}
            data={(stockData[stock.symbol] || []) as any}
            isSelected={selectedStock === stock.id}
            onClick={() => setSelectedStock(stock.id)}
            isPlaying={isPlaying}
          />
        </ChartItem>
      ))}
    </ChartGrid>
 
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
  </SlideContainer>
 
  <ArticleContent>
    {selectedStock && availableStocks.find(s => s.id === selectedStock) && (
      <ArticleCard 
      article={{
        article_id: Number(articles[0]?.articleId),
        stock_symbol: articles[0]?.stockSymbol || '',
        mid_stock_id: selectedStock || 0,
        trend_prediction: articles[0]?.trendPrediction || '',
        title: articles[0]?.stockName || '',
        created_at: articles[0]?.createdAt || '',
        content: articles[0]?.content || '',
        duration: Number(articles[0]?.duration) || 0
      }}
      />
    )}
  </ArticleContent>
 </Column>
 );
};

export default AdvancedArticlePage;