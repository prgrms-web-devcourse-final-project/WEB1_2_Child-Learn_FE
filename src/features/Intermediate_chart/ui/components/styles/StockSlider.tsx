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
import StockChart from '@/shared/ui/Intermediate/StockChat';
import { TrendPrediction, Relevance } from '@/features/article/type/article';
import { MidStock } from '@/features/Intermediate_chart/model/types/stock';
import { WarningModal } from '@/features/Intermediate_chart/ui/components/modals/WarningModal';


interface TradeResult {
  success: boolean;
  message: string;
  tradeType: 'buy' | 'sell';
  stockName: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

interface Holding {
  tradeType: 'BUY' | 'SELL';
  // 다른 필요한 속성들도 여기에 추가
}

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
  const [stockList, setStockList] = useState<MidStock[]>([]);
  const [userPoints, setUserPoints] = useState(2000);
  const [tradeResult, setTradeResult] = useState<TradeResult | null>(null);
  const [hasBoughtToday, setHasBoughtToday] = useState(false);
  const [hasSoldToday, setHasSoldToday] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const {
    fetchStockPrices,
    checkTradeAvailability,
    tradeAvailability,
    currentStockPrices,
    executeTrade
  } = useStockStore();

  const currentStock = useMemo(() => stockList[currentSlide], [stockList, currentSlide]);

  // 초기 데이터 로
  useEffect(() => {
    if (Array.isArray(stocks) && stocks.length > 0) {
      setStockList(stocks);
    }
  }, [stocks]);

  // 현재 주식 정보 업데이트
  useEffect(() => {
    if (currentStock?.midStockId) {
      fetchStockPrices(currentStock.midStockId);
      checkTradeAvailability(currentStock.midStockId);
    }
  }, [currentStock, currentSlide]);

  // 거래 버튼 클릭 처리
  const handleTradeClick = async (type: 'buy' | 'sell') => {
    await checkTradeAvailability(currentStock.midStockId);
    
    if (type === 'sell') {
      if (hasSoldToday || !tradeAvailability.isPossibleSell) {
        setShowLimitModal(true);
        return;
      }
      setShowSellModal(true);
    } else if (type === 'buy') {
      if (hasBoughtToday) {
        setShowLimitModal(true);
        return;
      }
      setShowBuyModal(true);
    }
  };

  // 매수 처리 (무제한 가능)
  const handleBuyTrade = async (buyPrice: number, buyQuantity: number) => {
    if (!currentStock) return;
    
    try {
      const tradePoint = buyPrice * buyQuantity;
      
      if (tradePoint > userPoints) {
        setShowBuyModal(false);
        setShowPointErrorModal(true);
        return;
      }
  
      const result = await executeTrade(
        currentStock.midStockId,
        tradePoint,
        'buy'
      );
  
      setTradeResult({
        success: true,
        message: '매수 완료',
        tradeType: 'buy',
        stockName: currentStock.midName,
        price: buyPrice,
        quantity: buyQuantity,
        totalPrice: tradePoint
      });
  
      setUserPoints(prev => prev - tradePoint);
      setShowBuyModal(false);
      setShowResultModal(true);
  
    } catch (error: any) {
      console.error('매수 처리 중 에러:', error);
      // 에러 메시지를 결과 모달에 표시
      setTradeResult({
        success: false,
        message: error.message || '매수 처리 중 오류가 발생했습니다.',
        tradeType: 'buy',
        stockName: currentStock.midName,
        price: buyPrice,
        quantity: buyQuantity,
        totalPrice: 0
      });
      setShowBuyModal(false);
      setShowResultModal(true);
    }
  };

  // 매도 처리 (하루 1번 전체 매도)
  const handleSellConfirm = async () => {
    if (!currentStock || !currentStockPrices.length) return;
    
    try {
        const result = await executeTrade(
            currentStock.midStockId,
            0,
            'sell'
        );
      
        if ('earnedPoints' in result) {
            const earnedPoints = result.earnedPoints ?? 0;
            setTradeResult({
                success: true,
                message: '매도 완료',
                tradeType: 'sell',
                stockName: '', 
                price: 0,
                quantity: 0,
                totalPrice: earnedPoints
            });

            setShowSellModal(false);
            setShowResultModal(true);
            setHasSoldToday(true);
            setUserPoints(prev => prev + earnedPoints);
        }
    } catch (error: any) {
        console.error('매도 처리 중 에러:', error);
        setShowSellModal(false);  // 에러 시에도 모달 닫기
        setTradeResult({
            success: false,
            message: error.message || '매도 처리 중 오류가 발생했습니다.',
            tradeType: 'sell',
            stockName: '',
            price: 0,
            quantity: 0,
            totalPrice: 0
        });
        setShowResultModal(true);
    }
  };

  // 슬라이더 이동 처리
  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % stockList.length);
    setShowActions(false);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + stockList.length) % stockList.length);
    setShowActions(false);
  };

  // 거래 가능 여부 주기적 체크
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (currentStock?.midStockId) {
        checkTradeAvailability(currentStock.midStockId);
      }
    }, 5000);

    return () => clearInterval(checkInterval);
  }, [currentStock]);

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

      {/* Modals */}
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