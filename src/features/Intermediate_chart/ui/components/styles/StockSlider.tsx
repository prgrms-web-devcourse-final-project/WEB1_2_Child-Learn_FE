import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { baseApi } from '@/shared/api/base';
import { PointBadge } from '@/shared/ui/PointBadge/PointBadge';
import { useStockStore } from '@/features/Intermediate_chart/model/stock';
import { BuyModal } from '@/features/Intermediate_chart/ui/components/modals/BuyModal';
import { SellModal } from '@/features/Intermediate_chart/ui/components/modals/SellModal';
import { ResultModal } from '@/features/Intermediate_chart/ui/components/modals/ResultModal';
import { CompletionModal } from '@/features/Intermediate_chart/ui/components/modals/CompletionModal';
import { LimitModal } from '@/features/Intermediate_chart/ui/components/modals/LimitModal';
import { PointErrorModal } from '@/features/Intermediate_chart/ui/components/modals/PointErrorModal';
import { WarningModal } from '@/features/Intermediate_chart/ui/components/modals/WarningModal';
import { MidArticlePage } from '@/pages/article/MidArticlePage';
import StockChart from '@/shared/ui/Intermediate/StockChat';
import { MidStock } from '@/features/Intermediate_chart/model/types/stock';

interface TradeResult {
  success: boolean;
  message: string;
  tradeType: 'buy' | 'sell';
  stockName: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface MidArticlePageProps {
  stockId: number;
  stockName: string;
  stockPrice: number;
  content: any;
}

// const formatDate = (date: Date): string => {
//   return date.toLocaleDateString('ko-KR', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric'
//   });
// };

const StockSlider: React.FC<{ stocks: MidStock[] }> = ({ stocks }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showPointErrorModal, setShowPointErrorModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [stockList, setStockList] = useState<MidStock[]>([]);
  const [userPoints, setUserPoints] = useState(2000);
  const [tradeResult, setTradeResult] = useState<TradeResult | null>(null);
  const [hasSoldToday, setHasSoldToday] = useState(false);
 
  const {
    fetchStockPrices,
    checkTradeAvailability,
    currentStockPrices,
    executeTrade
  } = useStockStore();
 
  const currentStock = useMemo(() => stockList[currentSlide], [stockList, currentSlide]);
 
  useEffect(() => {
    if (Array.isArray(stocks) && stocks.length > 0) {
      setStockList(stocks);
    }
  }, [stocks]);
 
  useEffect(() => {
    if (currentStock) {
      fetchStockPrices(currentStock.midStockId);
      checkTradeAvailability(currentStock.midStockId);
    }
  }, [currentStock]);
 
  const handleBuyTrade = async (tradePoint: number) => {
    if (!currentStock) return;
    
    try {
      if (tradePoint > userPoints) {
        setShowBuyModal(false);
        setShowPointErrorModal(true);
        return;
      }
  
      const result = await executeTrade(
        currentStock.midStockId,
        tradePoint,  // 사용자가 입력한 금액
        'buy',
        currentStock.midName
      );  
  
      if ('warning' in result) {
        await baseApi.post('/wallet/stock', {
          memberId: parseInt(localStorage.getItem('userId') || '0'),
          transactionType: "MID",
          points: tradePoint,
          pointType: "STOCK",
          stockType: "MID",
          stockName: currentStock.midName
        });
  
        setTradeResult({
          success: true,
          message: '매수 완료',
          tradeType: 'buy',
          stockName: currentStock.midName,
          totalPrice: tradePoint,
          price: currentStockPrices[0]?.avgPrice || 0,
          quantity: Math.floor(tradePoint / (currentStockPrices[0]?.avgPrice || 1))
        });
  
        setUserPoints(prev => prev - tradePoint);
        setShowBuyModal(false);
        setShowResultModal(true);
  
        if (result.warning) {
          setTimeout(() => {
            setShowWarningModal(true);
          }, 1500);
        }
      }
    } catch (error: any) {
      console.error('매수 처리 중 에러:', error);
      setTradeResult({
        success: false,
        message: error.message,
        tradeType: 'buy',
        stockName: currentStock.midName,
        totalPrice: tradePoint,
        price: currentStockPrices[0]?.avgPrice || 0,
        quantity: Math.floor(tradePoint / (currentStockPrices[0]?.avgPrice || 1))
      });
      setShowBuyModal(false);
      setShowResultModal(true);
    }
  };
  

  const handleSellConfirm = async () => {
    if (!currentStock || !currentStockPrices.length) return;
    
    try {
      const result = await executeTrade(
        currentStock.midStockId,
        0,
        'sell',
        currentStock.midName
      );
      
      if ('earnedPoints' in result) {
        await baseApi.post('/wallet/stock', {
          memberId: parseInt(localStorage.getItem('userId') || '0'),
          transactionType: "MID",
          points: result.earnedPoints ?? 0,
          pointType: "STOCK",
          stockType: "MID",
          stockName: currentStock.midName
        });
  
        setTradeResult({
          success: true,
          message: '매도 완료',
          tradeType: 'sell',
          stockName: currentStock.midName,
          totalPrice: result.earnedPoints ?? 0,
          price: currentStockPrices[0]?.avgPrice || 0,
          quantity: Math.floor(result.earnedPoints ?? 0 / (currentStockPrices[0]?.avgPrice || 1))
        });
  
        setUserPoints(prev => prev + (result.earnedPoints ?? 0));
        setShowSellModal(false);
        setShowResultModal(true);
        setHasSoldToday(true);
      }
    } catch (error: any) {
      console.error('매도 처리 중 에러:', error);
      setTradeResult({
        success: false,
        message: error.message,
        tradeType: 'sell',
        stockName: currentStock.midName,
        totalPrice: 0,
        price: currentStockPrices[0]?.avgPrice || 0,
        quantity: Math.floor(0 / (currentStockPrices[0]?.avgPrice || 1))
      });
      setShowSellModal(false);
      setShowResultModal(true);
    }
  };

const handleTradeClick = async (type: 'buy' | 'sell') => {
  if (type === 'sell') {
    if (hasSoldToday) {
      setShowLimitModal(true);
      return;
    }
    setShowSellModal(true);
  } else {
    setShowBuyModal(true);
  }
};

const handleNextSlide = () => {
  setCurrentSlide((prev) => (prev + 1) % stockList.length);
  setShowActions(false);
};

const handlePrevSlide = () => {
  setCurrentSlide((prev) => (prev - 1 + stockList.length) % stockList.length);
  setShowActions(false);
};


return (
  <SlideContainer>
    <HeaderWrapper>
      <OutButton onClick={() => navigate('/main')}>
        <img src="/img/out.png" alt="나가기" />
      </OutButton>
      <StyledPointBadge />
    </HeaderWrapper>

    <PrevButton onClick={handlePrevSlide} disabled={currentSlide === 0} $show={!showActions}>
      <img src="/img/arrow2.png" alt="이전" />
    </PrevButton>

    <ChartContainer onClick={() => setShowActions(true)}>
      {currentStock && currentStockPrices.length > 0 && (
        <>
          <StockChart 
            stockId={currentStock.midStockId}
            title={`${currentStock.midName} 주가 차트`}
            data={currentStockPrices}
          />
          {showActions && (
            <>
              <ActionButtons>
                <BuyButton onClick={() => handleTradeClick('buy')}>매수</BuyButton>
                <SellButton onClick={() => handleTradeClick('sell')}>매도</SellButton>
              </ActionButtons>
              <ArticleContainer>
                <ArticleInner>
                  <ArticleHeader>
                    <HeaderTitle>
                      <ArticleTitle>Child-Learn News</ArticleTitle>
                      <ArticleSubtitle>아이주주 주식</ArticleSubtitle>
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
                      <MidArticlePage 
                        // articleId:
                        // stockSymbol:
                        // trendPrediction:
                        // content: 
                        // createdAt: 
                        // duration: 
                         // 백으로 넘어오는 데이터 
                      />
                    </Column>
                  </ArticleContent>
                </ArticleInner>
              </ArticleContainer>
            </>
          )}
        </>
      )}
    </ChartContainer>

    <BuyModal
      isOpen={showBuyModal}
      onClose={() => setShowBuyModal(false)}
      onConfirm={async (tradePoint: number) => {
        await handleBuyTrade(tradePoint);  // tradePoint만 전달
      }}
      stockId={currentStock?.midStockId || 0}
      stockName={currentStock?.midName || ''}
      initialPrice={currentStockPrices[0]?.avgPrice.toString() || ''}
      points={userPoints}
    />
    

  <BuyModal
  isOpen={showBuyModal}
  onClose={() => setShowBuyModal(false)}
  onConfirm={async (tradePoint: number) => {
    await handleBuyTrade(tradePoint);  // tradePoint만 전달
  }}
  stockId={currentStock?.midStockId || 0}
  stockName={currentStock?.midName || ''}
  initialPrice={currentStockPrices[0]?.avgPrice.toString() || ''}
  points={userPoints}
/>

<SellModal
  isOpen={showSellModal}
  onClose={() => setShowSellModal(false)}
  onConfirm={handleSellConfirm}
  stockId={currentStock?.midStockId || 0}
  stockName={currentStock?.midName || ''}
/>

<ResultModal
  isOpen={showResultModal}
  onClose={() => setShowResultModal(false)}
  onConfirm={() => setShowResultModal(false)}
  tradeResult={tradeResult}
/>

<CompletionModal
  isOpen={showCompletionModal}
  onClose={() => setShowCompletionModal(false)}
  tradeResult={tradeResult}
/>

<LimitModal
  isOpen={showLimitModal}
  onClose={() => setShowLimitModal(false)}
  tradeType="sell"
  message="내일 다시 도전하세요!"
/>

<PointErrorModal
  isOpen={showPointErrorModal}
  onClose={() => setShowPointErrorModal(false)}
/>

<WarningModal
  isOpen={showWarningModal}
  onClose={() => setShowWarningModal(false)}
/>

<NextButton 
  onClick={handleNextSlide} 
  disabled={currentSlide === stockList.length - 1} 
  $show={!showActions}
>
  <img src="/img/arrow2.png" alt="다음" />
</NextButton>

<SlideIndicators $show={!showActions}>
  {stockList.map((_, index) => (
    <Indicator
      key={index}
      $active={index === currentSlide}
      onClick={() => {
        setCurrentSlide(index);
        setShowActions(false);
      }}
    />
  ))}
</SlideIndicators>
</SlideContainer>
);
}


const SlideContainer = styled.div`
 width: 100%;
 max-width: 1200px;
 margin: 0 auto;
 position: relative;
 background: #f0fff0;
 padding: 20px;
 border-radius: 20px;
`;

const StyledPointBadge = styled(PointBadge)`
 z-index: 10;
`;

const HeaderWrapper = styled.div`
 display: flex;
 justify-content: space-between;
 align-items: center;
 margin-bottom: 10px;
`;

const ChartContainer = styled.div`
 width: 100%;
 cursor: pointer;
`;

const ActionButtons = styled.div`
 display: flex;
 justify-content: center;
 gap: 106px;
 margin-top: 16px;
 
 button:disabled {
   opacity: 0.5;
   pointer-events: none;
 }
`;

const Button = styled.button`
 height: 40px;
 border: none;
 border-radius: 6px;
 font-size: 14px;
 font-weight: 500;
 cursor: pointer;
 transition: all 0.2s ease;
 padding: 0 24px;
`;

const BuyButton = styled(Button)`
 background: #1B63AB;
 color: white;
 &:hover {
   background: #145293;
 }
`;

const SellButton = styled(Button)`
 background: #D75442;
 color: white;
 &:hover {
   background: #C04937;
 }
`;

const ArticleContainer = styled.div`
 width: 100%;
 max-width: 800px;
 margin: 20px auto;
 background: #ffffff;
 border-radius: 12px;
 box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
 overflow: hidden;
 border: 1px solid #e0e0e0;
 padding: 0;
 background: #f8f8f8;  
  padding: 12px;        
`;

const HeaderLeftSection = styled.div`
 text-align: center;
`;

const HeaderRightSection = styled.div`
 color: #666;
 font-size: 9px;
 
`;

const ArticleTitle = styled.h1`
 font-size: 20px;
 color: #000000;
 font-weight: bold;
 margin: 0;
`;

const ArticleSubtitle = styled.p`
 color: #666;
 font-size: 12px;
 margin: 4px 0 0 0;
`;

const ArticleContent = styled.div`
 background: #ffffff;
 padding: 24px 20px;
 display: grid;
 grid-template-columns: 1fr 1fr;
 gap: 24px;
`;

const Column = styled.div`
 font-size: 10px;
 line-height: 1.8;
 color: #333;
`;

const NavigationButton = styled(Button)<{ $show?: boolean }>`
 position: absolute;
 top: 50%;
 transform: translateY(-50%);
 background: rgba(255, 255, 255, 0.8);
 border: none;
 border-radius: 50%;
 width: 40px;
 height: 40px;
 display: flex;
 align-items: center;
 justify-content: center;
 cursor: pointer;
 z-index: 2;
 box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
 display: ${props => props.$show ? 'flex' : 'none'};

 img {
   width: 24px;
   height: 24px;
 }

 &:hover {
   background: rgba(255, 255, 255, 1);
 }

 &:disabled {
   opacity: 0.5;
   cursor: not-allowed;
 }
`;

const PrevButton = styled(NavigationButton)`
 left: 1px;
 img {
   transform: rotate(180deg);  
 }
`;

const NextButton = styled(NavigationButton)`
 right: 1px;
`;

const SlideIndicators = styled.div<{ $show?: boolean }>`
 display: flex;
 justify-content: center;
 gap: 8px;
 margin-top: 16px;
 visibility: ${props => props.$show ? 'visible' : 'hidden'};
`;

const Indicator = styled.div<{ $active: boolean }>`
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

const OutButton = styled.button`
 background: none;
 border: none;
 cursor: pointer;
 padding: 0;
 z-index: 10;
 
 img {
   width: 22px;
   height: 22px;
 }
`;
const ArticleInner = styled.div`
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ArticleHeader = styled.div`
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
  background: #ffffff;
  position: relative;  // 추가
`;

const HeaderTitle = styled.div`
  text-align: center;
`;

const HeaderDate = styled.div`
  position: absolute;
  top: 60px;
  right: 2px;
  color: #666;
  font-size: 10px;
`;


export default StockSlider;
