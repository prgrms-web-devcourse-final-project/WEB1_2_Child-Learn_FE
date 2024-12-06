// StockSlider.tsx
import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { PointBadge } from '@/shared/ui/PointBadge/PointBadge';
import { useStockStore } from '@/features/Intermediate_chart/model/stock';
import { BuyModal } from '@/features/Intermediate_chart/ui/components/modals/BuyModal';
import { SellModal } from '@/features/Intermediate_chart/ui/components/modals/SellModal';
import { ResultModal } from '@/features/Intermediate_chart/ui/components/modals/ResultModal';
import { CompletionModal } from '@/features/Intermediate_chart/ui/components/modals/CompletionModal';
import { LimitModal } from '@/features/Intermediate_chart/ui/components/modals/LimitModal';
import { PointErrorModal } from '@/features/Intermediate_chart/ui/components/modals/PointErrorModal';
import ArticleComponent from '@/features/article/article';
import { TrendPrediction, Relevance } from '@/features/article/type/article';
import StockChart from '@/shared/ui/Intermediate/StockChat';
import { TradeDetail } from '@/features/Intermediate_chart/model/types/stock';
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

interface StockSliderProps {
  stocks: MidStock[];
}

const StockSlider: React.FC<StockSliderProps> = ({ stocks }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showPointErrorModal, setShowPointErrorModal] = useState(false);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [stockList, setStockList] = useState<MidStock[]>([]);
  const [userPoints, setUserPoints] = useState(2000);
  const [tradeResult, setTradeResult] = useState<TradeResult | null>(null);
  const [hasSoldToday, setHasSoldToday] = useState(false);

  const {
    fetchStockPrices,
    checkTradeAvailability,
    tradeAvailability,
    currentStockPrices
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

  const handleNextSlide = () => {
    const nextSlide = (currentSlide + 1) % stockList.length;
    setCurrentSlide(nextSlide);
    setShowActions(false);
  };

  const handlePrevSlide = () => {
    const prevSlide = (currentSlide - 1 + stockList.length) % stockList.length;
    setCurrentSlide(prevSlide);
    setShowActions(false);
  };

  const handleTradeClick = async (type: 'buy' | 'sell') => {
    setTradeType(type);
    
    if (type === 'sell') {
      if (hasSoldToday) {
        setShowLimitModal(true);
        return;
      }
      setShowSellModal(true);
      return;
    }

    // 매수는 제한 없이 바로 모달 표시
    setShowBuyModal(true);
  };

 const handleBuyTrade = async (buyPrice: number, buyQuantity: number) => {
    if (!currentStock) return;
    
    try {
      const tradePoint = buyPrice * buyQuantity; // 총 포인트 계산
      
      if (tradePoint > userPoints) {
        setShowPointErrorModal(true);
        return;
      }

      await useStockStore.getState().executeTrade(
        currentStock.midStockId,
        tradePoint,
        'buy'
      );

      setTradeResult({
        success: true,
        message: '매수 완료',
        tradeType: 'buy',
        stockName: currentStock.midName,
        price: buyPrice,        // 매수가격(100원)
        quantity: buyQuantity,  // 수량(2주)
        totalPrice: tradePoint  // 총 포인트(200P)
      });

      setShowBuyModal(false);
      setShowResultModal(true);
      setUserPoints(prev => prev - tradePoint);
      
    } catch (error: any) {
      console.error('Trade error:', error);
      setTradeResult({
        success: false,
        message: error.message || '거래 처리 중 오류가 발생했습니다.',
        tradeType: 'buy',
        stockName: currentStock.midName,
        price: buyPrice,
        quantity: buyQuantity,
        totalPrice: buyPrice * buyQuantity
      });
      setShowResultModal(true);
    }
};

const handleSellConfirm = async () => {
    if (!currentStock || !currentStockPrices.length) return;
    
    try {
      const holdings = await useStockStore.getState().getTradeDetails(currentStock.midStockId); // 함수명 수정
      const holdingQuantity = holdings.filter((trade: TradeDetail) => trade.tradeType === 'BUY').length;

      const result = await useStockStore.getState().executeTrade(
        currentStock.midStockId,
        0,
        'sell'
      );
      
      if (result.success) {
        setTradeResult({
          success: true,
          message: '매도 완료',
          tradeType: 'sell',
          stockName: currentStock.midName,
          price: currentStockPrices[0].avgPrice,
          quantity: holdingQuantity,
          totalPrice: result.earnedPoints || 0
        });

        setShowResultModal(true);
        setHasSoldToday(true);
        setUserPoints(prev => prev + (result.earnedPoints || 0));

        setTimeout(() => {
          setShowResultModal(false);
          setShowCompletionModal(true);
        }, 1500);
      }
    } catch (error) {
      console.error('매도 에러:', error);
    }
};


  const handleOutButtonClick = () => {
    if (showActions) {
      setShowActions(false);
    } else {
      navigate('/main');
    }
  };

  return (
    <SlideContainer>
      <HeaderWrapper>
        <OutButton onClick={handleOutButtonClick}>
          <img src="/img/out.png" alt="나가기" />
        </OutButton>
        <PointBadge/>
      </HeaderWrapper>

      <PrevButton onClick={handlePrevSlide} disabled={currentSlide === 0} $show={!showActions}>
        <img src="/img/arrow2.png" alt="이전" />
      </PrevButton>
      <ChartContainer onClick={() => setShowActions(true)}>
        {currentStock && currentStockPrices.length > 0 && (
          <StockChart 
            stockId={currentStock.midStockId}
            title={`${currentStock.midName} 주가 차트`}
            data={currentStockPrices}
          />
        )}
      </ChartContainer>

      {showActions && (
        <>
          <ActionButtons>
            <BuyButton 
              onClick={() => handleTradeClick('buy')} 
              disabled={!tradeAvailability.isPossibleBuy}
            >
              매수
            </BuyButton>
            <SellButton 
              onClick={() => handleTradeClick('sell')}
              disabled={!tradeAvailability.isPossibleSell}
            >
              매도
            </SellButton>
          </ActionButtons>
          
          <ArticleContainer>
            <ArticleComponent article={{
              id: currentSlide + 1,
              article_id: 1001,
              stock_symbol: currentStock.midName,
              trend_prediction: TrendPrediction.UP,
              content: `${currentStock.midName} 분석...`,
              relevance: Relevance.HIGH,
              created_at: new Date().toISOString(),
              duration: 60,
              mid_stock_id: currentStock.midStockId,
              adv_id: 1
            }} />
          </ArticleContainer>
        </>
      )}

      <BuyModal
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        onConfirm={handleBuyTrade}
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
        tradeResult={tradeResult}
        onConfirm={() => {
          setShowResultModal(false);
          if (tradeResult?.success) {
            setShowCompletionModal(true);
          }
        }}
      />

      <CompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        tradeResult={tradeResult}
      />

      <LimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        tradeType={tradeType}
        message={tradeType === 'sell' ? '내일 다시 도전하세요!' : ''}
      />

      <PointErrorModal
        isOpen={showPointErrorModal}
        onClose={() => setShowPointErrorModal(false)}
      />
<NextButton onClick={handleNextSlide} disabled={currentSlide === stockList.length - 1} $show={!showActions}>
        <img src="/img/arrow2.png" alt="다음" />
      </NextButton>

      <SlideIndicators $show={!showActions}>
        {stockList.map((stock, index) => (
          <Indicator
            key={stock.midStockId}
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
};

// Styled Components
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
  margin-top: 20px;
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

export default StockSlider;
