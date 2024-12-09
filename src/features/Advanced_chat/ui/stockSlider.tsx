import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { StockChart } from '@/features/Advanced_chat/ui/AdvancedGame';
import { TradeModal } from '@/features/Advanced_chat/ui/TradeModal/TradeModal';
import timer from '../../../../public/img/timer.png';
import { getArticles } from '@/features/article/api/articleApi';
import { baseApi } from '@/shared/api/base';
import ArticleCard from '@/features/article/ui/ArticleCard';

interface Article {
  articleId: number;
  stockSymbol: string;
  trendPrediction: string;
  content: string;
  createdAt: string;
  duration: number;
  title: string;
  midStockId: number;
}

interface StockSliderProps {
 // props 필요시 추가
}

interface ChartGridProps {
  currentSlide: number;
}

export const StockSlider: React.FC<StockSliderProps> = () => {
 const [currentSlide, setCurrentSlide] = useState(0);
 const [showActions, setShowActions] = useState(false);
 const [selectedStock, setSelectedStock] = useState<number | null>(null);
 const [isPlaying, setIsPlaying] = useState(false);
 const [gameTime, setGameTime] = useState(0);
 const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
 const [showArticle, setShowArticle] = useState(false);
 const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
 const [articles, setArticles] = useState<Article[]>([]);
 const [currentArticle, setCurrentArticle] = useState<Article | null>(null);

 useEffect(() => {
   let timer: NodeJS.Timeout;
   if (isPlaying) {
     timer = setInterval(() => {
       setGameTime(prev => {
         if (prev >= 540) { // 9분 = 540초
           setIsPlaying(false);
           return prev;
         }
         return prev + 1;
       });
     }, 1000);
   }
   return () => clearInterval(timer);
 }, [isPlaying]);

 useEffect(() => {
   const fetchArticles = async () => {
     try {
       const data = await getArticles('ADVANCED');
       setArticles(data);
     } catch (error) {
       console.error('기사를 불러오는데 실패했습니다:', error);
     }
   };
   fetchArticles();
 }, []);

 useEffect(() => {
   const fetchArticle = async () => {
     if (selectedStock) {
       try {
         const response = await baseApi.get(`/articles/stocks/${selectedStock}`);
         setCurrentArticle(response.data);
       } catch (error) {
         console.error('기사 로딩 실패:', error);
       }
     }
   };

   fetchArticle();
 }, [selectedStock]);

 const formatTime = (seconds: number) => {
   const mins = Math.floor(seconds / 60);
   const secs = seconds % 60;
   return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
 };

 const handleNextSlide = () => {
   setCurrentSlide((prev) => (prev + 1) % 4);
 };

 const handlePrevSlide = () => {
   setCurrentSlide((prev) => (prev - 1 + 4) % 4);
 };

 const getStockName = (stockId: number) => {
   switch(stockId) {
     case 1: return "Samsung";
     case 2: return "Hyundai";
     case 3: return "Kakao";
     default: return "Naver";
   }
 };

 const handleStockClick = (stockId: number) => {
   setSelectedStock(stockId);
   setIsTradeModalOpen(true);
 };

 const handleChartClick = (stockId: number) => {
   setSelectedStock(stockId);
   // 해당 주식의 기사 찾기
   const article = articles.find(a => a.stockSymbol === getStockName(stockId));
   setSelectedArticle(article || null);
   setShowArticle(true);
 };

 return (
   <SlideContainer>
     <SlideControls>
       <SlideButton onClick={handlePrevSlide}>
         <span className="sr-only">이전</span>
         <img src="/img/arrow2.png" alt="이전" style={{ transform: 'rotate(180deg)' }} />
       </SlideButton>
       <SlideButton onClick={handleNextSlide}>
         <span className="sr-only">다음</span>
         <img src="/img/arrow2.png" alt="다음" />
       </SlideButton>
     </SlideControls>
     <TimeDisplay>
       <img src={timer} alt="시계" />
       {formatTime(gameTime)}
     </TimeDisplay>
     
     <ChartGrid 
       currentSlide={currentSlide} 
       onClick={() => setShowArticle(!showArticle)} 
       style={{ cursor: 'pointer' }}
     >
       <ChartItem $currentSlide={currentSlide}>
         <StockChart
           stockId={1}
           title="Samsung"
           data={[]}
           isSelected={selectedStock === 1}
           onClick={() => {
             setSelectedStock(1);
             setShowActions(true);
           }}
         />
       </ChartItem>
       <ChartItem $currentSlide={currentSlide}>
         <StockChart
           stockId={2}
           title="Hyundai"
           data={[]}
           isSelected={selectedStock === 2}
           onClick={() => setSelectedStock(2)}
         />
       </ChartItem>
       <ChartItem $currentSlide={currentSlide}>
         <StockChart
           stockId={3}
           title="Kakao"
           data={[]}
           isSelected={selectedStock === 3}
           onClick={() => setSelectedStock(3)}
         />
       </ChartItem>
       <ChartItem $currentSlide={currentSlide}>
         <StockChart
           stockId={4}
           title="Naver"
           data={[]}
           isSelected={selectedStock === 4}
           onClick={() => setSelectedStock(4)}
         />
       </ChartItem>
     </ChartGrid>

     {selectedStock && (
       <ControlPanel>
         <PlayButton onClick={() => setIsPlaying(!isPlaying)}>
           {isPlaying ? (
             <img src="/img/pause.png" alt="일시정지" />
           ) : (
             <img src="/img/play.png" alt="시작" />
           )}
         </PlayButton>
         {showActions && (
           <TradeButton onClick={() => setIsTradeModalOpen(true)}>
             거래하기
           </TradeButton>
         )}
       </ControlPanel>
     )}

     {isTradeModalOpen && selectedStock && (
       <ModalWrapper>
         <TradeModal 
           isOpen={isTradeModalOpen}
           onClose={() => setIsTradeModalOpen(false)}
           stockName={getStockName(selectedStock)}
           currentPrice={1000}
           priceHistory={[]}
           isPlaying={isPlaying}
         />
       </ModalWrapper>
     )}

     {showArticle && (
       <ArticleInner>
         <ArticleHeader>
           <HeaderTitle>
             <ArticleTitle>Child-Learn News</ArticleTitle>
             <ArticleSubtitle>아이주주 </ArticleSubtitle>
           </HeaderTitle>
           <HeaderDate>
             {new Date().toLocaleDateString('ko-KR', {
               year: 'numeric',
               month: '2-digit',
               day: '2-digit'
             }).replace(/\. /g, '.').replace('.', '')}
           </HeaderDate>
         </ArticleHeader>
         <ArticleContent>
           <Column>
             {currentArticle && (
               <ArticleCard 
                 article={{
                   article_id: Number(currentArticle.articleId),
                   stock_symbol: currentArticle.stockSymbol || '',
                   trend_prediction: currentArticle.trendPrediction || '',
                   created_at: currentArticle.createdAt || '',
                   content: currentArticle.content || '',
                   duration: Number(currentArticle.duration),
                   title: currentArticle.title || '',
                   mid_stock_id: currentArticle.midStockId || 0   
                 }} 
               />
             )}
           </Column>
         </ArticleContent>
       </ArticleInner>
     )}
   </SlideContainer>
 );
};

const SlideContainer = styled.div`
 width: 100%;
 max-width: 1200px;
 margin: 0 auto;
 position: relative;
 background: #f0fff0;
 padding: 20px;
 border-radius: 20px;
`;

const TimeDisplay = styled.div`
 position: absolute;
 top: 20px;
 right: 20px;
 display: flex;
 align-items: center;
 gap: 8px;
 font-size: 20px;
 font-weight: bold;
 color: #333;

 img {
   width: 24px;
   height: 24px;
 }
`;

const ChartGrid = styled.div<ChartGridProps>`
 display: flex;
 overflow: hidden;
 width: 100%;
`;

const ChartItem = styled.div<{ $currentSlide: number }>`
 min-width: 100%;
 transform: translateX(-${props => props.$currentSlide * 100}%);
 transition: transform 0.3s ease;
 cursor: pointer;
`;

const ControlPanel = styled.div`
 display: flex;
 justify-content: center;
 gap: 20px;
 margin-top: 20px;
 padding: 20px;
`;

const PlayButton = styled.button`
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
   background: #ffffff;
 }
`;

const TradeButton = styled.button`
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

const SlideControls = styled.div`
  position: absolute;
  top: 40%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 8px;
  z-index: 1;
`;

const SlideButton = styled.button`
  padding: 19px;
  border: none;
  background: transparent;
  cursor: pointer;
  outline: none;
  
  img {
    width: 23px;
    height: 23px;
    filter: brightness(0) invert(1);
  }

  &:hover, &:focus {
    outline: none;
  }
  
  &:active {
    outline: none;
  }
`;

export interface TradeModalProps {
  onClose: () => void;
  stockId: number | null;
}

const ModalWrapper = styled.div`
  display: flex;
  gap: 20px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  width: 90%;
  max-width: 1200px;
`;

const ArticleInner = styled.div`
  width: 100%;
  background: white;
  padding: 20px;
  border-radius: 10px 10px 0 0;
  margin-top: 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
`;

const ArticleHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
`;

const HeaderTitle = styled.div``;

const ArticleTitle = styled.h2`
  font-size: 20px;
  margin: 0;
  font-weight: bold;
`;

const ArticleSubtitle = styled.p`
  margin: 4px 0 0;
  color: #666;
  font-size: 14px;
`;

const HeaderDate = styled.div`
  color: #666;
  font-size: 12px;
  margin-top: 4px;
`;

const ArticleContent = styled.div`
  padding: 20px 0;
`;

const Column = styled.div`
  line-height: 1.6;
  font-size: 14px;
  color: #333;
`;

