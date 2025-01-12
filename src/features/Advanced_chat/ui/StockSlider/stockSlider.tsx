import React, { useState, useEffect, useRef } from 'react';
import { StockChart } from '@/features/Advanced_chat/ui/StockChart/stockchart';
import { TradeModal } from '@/features/Advanced_chat/ui/TradeModal/TradeModal';
import { StockWebSocket } from '@/features/Advanced_chat/model/stockWebSocket';
import { useArticle } from '@/features/article/model/useArticle';
import ArticleCard from '@/features/article/ui/ArticleCard';
import styled from 'styled-components';
import { Stock, StockPrice } from '@/features/Advanced_chat/types/stock';


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
 const MAX_GAME_TIME = 420; // 7 minutes

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

export interface AdvancedArticlePageProps {
 stockId: number;
 stockName: string;
}

export const AdvancedArticlePage: React.FC<AdvancedArticlePageProps> = ({ stockId, stockName }) => {
 const { articles, loading, error } = useArticle('ADVANCED');
 const [currentSlide, setCurrentSlide] = useState(0);
 const [selectedStock, setSelectedStock] = useState<number | null>(null);
 const [isPlaying, setIsPlaying] = useState(false);
 const [stockData, setStockData] = useState<Record<string, StockPrice[]>>({});
 const [showTradeModal, setShowTradeModal] = useState(false);
 const [availableStocks, setAvailableStocks] = useState<Stock[]>([]);
 const wsRef = useRef(StockWebSocket.getInstance());

 const { formattedTime } = useGameTimer({
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
     timestamp: new Date(data.timestamp * 1000).toISOString(),
     price: Number(data.closePrice || 0),
     open: Number(data.openPrice) || 0,
     high: Number(data.highPrice) || 0,
     low: Number(data.lowPrice) || 0,
     close: Number(data.closePrice) || 0,
     change: parseFloat(data.change) || 0,
     volume: parseInt(data.volume) || 0
   };
 };

 const handleStockData = (data: any) => {
   if (!data?.symbol) {
     console.warn('Invalid stock data received:', data);
     return;
   }

   console.log('Processing stock data:', data);

   setStockData(prevData => {
     const newData = { ...prevData };
     const processedPrice = processStockData(data);
     
     newData[data.symbol] = [
       processedPrice,
       ...(newData[data.symbol] || [])
     ].slice(0, 100);
     
     return newData;
   });
 };

 useEffect(() => {
   const ws = wsRef.current;
   
   const messageHandler = (message: any) => {
     try {
       const parsedMessage = typeof message === 'string' ? JSON.parse(message) : message;
       console.log('Received WebSocket message:', parsedMessage);
       
       switch (parsedMessage.action) {
         case 'REFERENCE_DATA':
           if (parsedMessage.data?.stocks) {
             setAvailableStocks(parsedMessage.data.stocks);
             const initialStockData: Record<string, StockPrice[]> = {};
             parsedMessage.data.stocks.forEach((stock: Stock) => {
               initialStockData[stock.symbol] = [];
             });
             setStockData(initialStockData);
           }
           break;

         case 'LIVE_DATA':
           if (parsedMessage.data) {
             handleStockData(parsedMessage.data);
           }
           break;

         case 'END_GAME':
           setIsPlaying(false);
           break;
       }
     } catch (error) {
       console.error('Error processing message:', error);
     }
   };

   ws.onMessage(messageHandler);
   ws.connect().catch(console.error);

   return () => {
     ws.disconnect();
   };
 }, []);

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

 if (loading) return <div>Loading...</div>;
 if (error) return <div>{error}</div>;
 if (availableStocks.length === 0) {
   return <div>주식 데이터를 불러오는 중...</div>;
 }

 const filteredArticles = stockId 
   ? articles.filter(article => article.stockSymbol === stockName)
   : articles;

 return (
  <Column>
  <SlideContainer>
    <TimeDisplay>
      <img src="/img/timer.png" alt="시계" />
      {formattedTime}
    </TimeDisplay>

    <NavigationButton 
      position="left" 
      onClick={handlePrevSlide} 
      $show={currentSlide > 0}
    >
      <img src="/img/arrow.png" alt="이전" />
    </NavigationButton>

    <NavigationButton 
      position="right" 
      onClick={handleNextSlide} 
      $show={currentSlide < availableStocks.length - 1}
    >
      <img src="/img/arrow.png" alt="다음" />
    </NavigationButton>

    <ControlPanel>
      <PlayButton onClick={handlePlayClick}>
        <img src={isPlaying ? "/img/pause.png" : "/img/play.png"} alt="재생/일시정지" />
      </PlayButton>
    </ControlPanel>

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
          <TradeButton onClick={() => setShowTradeModal(true)}>
            거래하기
          </TradeButton>
        </ChartItem>
      ))}
    </ChartGrid>

    <SlideIndicators $show={true}>
      {availableStocks.map((_, index) => (
        <Indicator 
          key={index} 
          $active={currentSlide === index}
          onClick={() => setCurrentSlide(index)}
        />
      ))}
    </SlideIndicators>

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
    {filteredArticles.map((article) => (
      <Content key={article.articleId}>
        {article && article.articleId && (
          <ArticleCard 
            article={{
              article_id: Number(article.articleId),
              stock_symbol: article.stockSymbol || '',
              mid_stock_id: article.stock_Id || 0,
              trend_prediction: article.trendPrediction || '',
              title: article.title || '',
              created_at: article.createdAt || '',
              content: article.content || '',
              duration: Number(article.duration)
            }} 
          />
        )}
      </Content>
    ))}
  </ArticleContent>
</Column>
 );
};

export default AdvancedArticlePage;