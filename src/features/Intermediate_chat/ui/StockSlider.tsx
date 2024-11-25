// features/Intermediate_chat/ui/StockSlider.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { stockApi } from '@/shared/api/stock';
import { ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import ArticleComponent from '../../article/article';
import { TrendPrediction, Relevance } from '../../article/type/article';
import { MidStock, StockPrice, TradeAvailability } from '../types/stock';
import StockChart from '@/shared/ui/Intermediate/StockChat';

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

const SlideContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  background: #f0fff0;
  padding: 20px;
  border-radius: 20px;
`;

const NavigationButton = styled.button<{ $show?: boolean }>`
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

  &:hover {
    background: rgba(255, 255, 255, 1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrevButton = styled(NavigationButton)`
  left: 10px;
`;

const NextButton = styled(NavigationButton)`
  right: 10px;
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
  background-color: ${props => props.$active ? '#1B63AB' : '#ddd'};
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.$active ? '#1B63AB' : '#bbb'};
  }
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 100;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  width: 100%;
  max-width: 340px;
  border-radius: 12px;
  z-index: 101;
`;

const ModalTitle = styled.div`
  text-align: center;
  padding: 16px;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid #eee;
`;

const ModalContent = styled.div`
  padding: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
  
  &:last-of-type {
    margin-bottom: 24px;
  }
`;

const Label = styled.div`
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #eaeaea;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  background: white;

  &:disabled {
    background: white;
    color: #333;
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QuantityButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  background: white;
  color: #666;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled(Input)`
  width: 80px;
  text-align: center;
  padding: 0;
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 0;
`;

const ResultModalContent = styled(ModalContent)`
  text-align: left;
  padding: 0;
`;

const ResultRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ResultLabel = styled.span`
  color: #666;
  font-size: 14px;
`;

const ResultValue = styled.span`
  color: #333;
  font-size: 14px;
  font-weight: 500;
`;

const ResultButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 0;
  border-top: 1px solid #eee;
`;

const ResultButton = styled.button<{ color: string }>`
  width: 100%;
  height: 48px;
  border: none;
  background: ${props => props.color};
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:first-child {
    border-right: 1px solid #eee;
  }

  &:hover {
    opacity: 0.9;
  }
`;

const LimitModalContent = styled(ModalContent)`
  text-align: center;
  padding: 24px 20px;
`;

const LimitText = styled.p`
  margin: 0 0 24px;
  color: #333;
  font-size: 14px;
`;

const SingleButton = styled(ResultButton)`
  grid-column: 1 / -1;
`;

const ConfirmButton = styled(Button)<{ type: 'buy' | 'sell' }>`
  background: ${props => props.type === 'buy' ? '#1B63AB' : '#D75442'};
  color: white;
  &:hover {
    background: ${props => props.type === 'buy' ? '#145293' : '#C04937'};
  }
`;

const CancelButton = styled(Button)`
  background: #D75442;
  color: white;
  &:hover {
    background: #C04937;
  }
`;

const StockSlider: React.FC<StockSliderProps> = ({ stocks }) => {
  // 기본 상태
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  // API 관련 상태
  const [stockList, setStockList] = useState<MidStock[]>(stocks);
  const [priceData, setPriceData] = useState<StockPrice[]>([]);
  const [tradeAvailability, setTradeAvailability] = useState<TradeAvailability>({
    isPossibleBuy: false,
    isPossibleSell: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tradeResult, setTradeResult] = useState<TradeResult | null>(null);

  // 주식 목록 로드
  useEffect(() => {
    const loadStocks = async () => {
      try {
        const response = await stockApi.getStockList();
        console.log('Raw response:', response);
        
        // response.data가 있는지 확인하고, 배열인지 확인
        if (response && response.data && Array.isArray(response.data)) {
          console.log('Setting stock list:', response.data);
          setStockList(response.data);
        } else {
          console.error('Invalid stock list format:', response);
          setError('Invalid data format');
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load stocks:', err);
        setError('Failed to load stocks');
        setIsLoading(false);
      }
    };
    loadStocks();
  }, []);

  const currentStock = stockList[currentSlide];

  // 현재 주식의 가격 데이터 로드
  useEffect(() => {
    const loadPriceData = async () => {
      if (!currentStock?.midStockId) {
        console.log('No current stock or stockId');
        return;
      }
  
      try {
        console.log('Loading price data for stock:', currentStock.midStockId);
        const data = await stockApi.getStockPrices(currentStock.midStockId);
        console.log('Received price data:', data);
        setPriceData(data);
  
        if (data.length > 0) {
          setPrice(data[0].avgPrice.toString());
          setTotalPrice(data[0].avgPrice * quantity);
        }
  
        const availability = await stockApi.checkTradeAvailability(currentStock.midStockId);
        setTradeAvailability(availability);
      } catch (err) {
        console.error('Error loading price data:', err);
        setError('Failed to load price data');
      }
    };

    loadPriceData();
  }, [currentStock?.midStockId, quantity]);

  const [limitMessage, setLimitMessage] = useState('');

  const handleSingleButtonClick = () => {
    setShowResultModal(false);
    setShowLimitModal(false);
  };

  const handleTrade = async () => {
    if (!currentStock || !price) return;
  
    try {
      const tradePoint = parseInt(price.replace(/,/g, '')) * quantity;
  
      if (tradeType === 'buy') {
        const result = await stockApi.buyStock(currentStock.midStockId, tradePoint);
        setTradeResult({
          success: !result.warning,
          message: result.warning ? '매수 실패' : '매수 완료',
          tradeType: 'buy',
          stockName: currentStock.midName,
          price: parseInt(price.replace(/,/g, '')),
          quantity: quantity,
          totalPrice: tradePoint
        });
      } else {
        setTradeResult({
          success: true,
          message: '매도 완료',
          tradeType: 'sell',
          stockName: currentStock.midName,
          price: parseInt(price.replace(/,/g, '')),
          quantity: quantity,
          totalPrice: tradePoint
        });
      }
  
      setShowTradeModal(false);
      setShowResultModal(true);
  
      // 거래 결과 모달을 닫을 때 거래 제한 모달 표시
      const handleCloseResultModal = () => {
        setShowResultModal(false);
        setShowLimitModal(true);
        setLimitMessage('오늘은 더 이상 거래를 할 수 없습니다.');
      };
  
      setTimeout(handleCloseResultModal, 2000); // 3초 후 실행
  
    } catch (err) {
      setTradeResult({
        success: false,
        message: '거래 처리 중 오류가 발생했습니다.',
        tradeType: tradeType,
        stockName: currentStock.midName,
        price: parseInt(price.replace(/,/g, '')),
        quantity: quantity,
        totalPrice: 0
      });
      setShowResultModal(true);
    }
  };

  const handleTradeClick = async (type: 'buy' | 'sell') => {
    if (type === 'buy' && !tradeAvailability.isPossibleBuy) {
      setTradeType(type);
      setShowLimitModal(true);
      return;
    }
    if (type === 'sell' && !tradeAvailability.isPossibleSell) {
      setTradeType(type);
      setShowLimitModal(true);
      return;
    }

    setTradeType(type);
    setShowTradeModal(true);
    setQuantity(1);
    if (priceData.length > 0) {
      setPrice(priceData[0].avgPrice.toString());
      setTotalPrice(priceData[0].avgPrice);
    }
  };

  const handlePrevSlide = () => {
    setCurrentSlide(current => (current - 1 + stockList.length) % stockList.length);
    setShowActions(false);
  };

  const handleNextSlide = () => {
    setCurrentSlide(current => (current + 1) % stockList.length);
    setShowActions(false);
  };

  const handleChartClick = () => {
    setShowActions(true);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
    const numPrice = price === '' ? 0 : parseInt(price.replace(/,/g, ''));
    setTotalPrice(numPrice * newQuantity);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value === '') {
      setPrice('');
      setTotalPrice(0);
      return;
    }
    const numValue = parseInt(value);
    setPrice(numValue.toLocaleString());
    setTotalPrice(numValue * quantity);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!currentStock) return null;

  return (
    <SlideContainer>
      <PrevButton 
        onClick={handlePrevSlide} 
        disabled={currentSlide === 0}
        $show={!showActions}
      >
        <ChevronLeft size={24} />
      </PrevButton>

      <ChartContainer onClick={handleChartClick}>
  {currentStock && priceData.length > 0 && (
    <StockChart 
      stockId={currentStock.midStockId}
      title={`${currentStock.midName} 주가 차트`}
      data={priceData}
    />
  )}
  {(!currentStock || priceData.length === 0) && (
    <div>Loading chart data...</div>
  )}
</ChartContainer>

      {showActions && (
        <>
          <ActionButtons>
            <BuyButton onClick={() => handleTradeClick('buy')}>매수</BuyButton>
            <SellButton onClick={() => handleTradeClick('sell')}>매도</SellButton>
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

      {showTradeModal && (
        <>
          <ModalOverlay onClick={() => setShowTradeModal(false)} />
          <ModalContainer>
            <ModalTitle>
              {tradeType === 'buy' ? '매수하기' : '매도하기'}
            </ModalTitle>
            
            <ModalContent>
              <FormGroup>
                <Label>{currentStock.midName}</Label>
                <Input
                  type="text"
                  value={price}
                  onChange={handlePriceChange}
                  placeholder={`${tradeType === 'buy' ? '매수가' : '매도가'}를 입력하세요`}
                />
              </FormGroup>

              <FormGroup>
                <Label>수량</Label>
                <QuantityControl>
                  <QuantityButton
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </QuantityButton>
                  <QuantityInput
                    type="text"
                    value={quantity}
                    disabled
                  />
                  <QuantityButton
                    onClick={() => handleQuantityChange(1)}
                  >
                    <Plus size={16} />
                  </QuantityButton>
                </QuantityControl>
              </FormGroup>

              <FormGroup>
                <Label>총 포인트</Label>
                <Input
                  type="text"
                  value={totalPrice.toLocaleString()}
                  disabled
                />
              </FormGroup>

              <ButtonGroup>
                <ConfirmButton 
                  onClick={handleTrade}
                  disabled={!price || price === '0'}
                  type={tradeType}
                >
                  {tradeType === 'buy' ? '매수하기' : '매도하기'}
                </ConfirmButton>
                <CancelButton onClick={() => setShowTradeModal(false)}>
                  나가기
                </CancelButton>
              </ButtonGroup>
            </ModalContent>
          </ModalContainer>
        </>
      )}

{showResultModal && tradeResult && (
  <>
    <ModalOverlay />
    <ModalContainer>
      <ModalTitle>
        주식 {tradeResult.tradeType === 'buy' ? '매수' : '매도'}주문
      </ModalTitle>
      <ResultModalContent>
        <ResultRow>
          <ResultLabel>종목명</ResultLabel>
          <ResultValue>{tradeResult.stockName}</ResultValue>
        </ResultRow>
        <ResultRow>
          <ResultLabel>{tradeResult.tradeType === 'buy' ? '매수가격' : '매도가격'}</ResultLabel>
          <ResultValue>{tradeResult.price.toLocaleString()}</ResultValue>
        </ResultRow>
        <ResultRow>
          <ResultLabel>주문수량</ResultLabel>
          <ResultValue>{tradeResult.quantity}</ResultValue>
        </ResultRow>
        <ResultRow>
          <ResultLabel>포인트가격</ResultLabel>
          <ResultValue>{tradeResult.totalPrice.toLocaleString()}</ResultValue>
        </ResultRow>
        <ResultButtonGroup>
          <SingleButton 
            color="#1B63AB" 
            onClick={handleSingleButtonClick}
          >
            확인
          </SingleButton>
        </ResultButtonGroup>
      </ResultModalContent>
    </ModalContainer>
  </>
)}

{showLimitModal && (
  <>
    <ModalOverlay onClick={() => setShowLimitModal(false)} />
    <ModalContainer>
      <ModalTitle>거래 제한</ModalTitle>
      <LimitModalContent>
        <LimitText>{limitMessage || '현재 거래가 불가능합니다.'}</LimitText>
        <SingleButton color="#1B63AB" onClick={() => setShowLimitModal(false)}>
          확인
        </SingleButton>
      </LimitModalContent>
    </ModalContainer>
  </>
)}

      <NextButton 
        onClick={handleNextSlide} 
        disabled={currentSlide === stockList.length - 1}
        $show={!showActions}
      >
        <ChevronRight size={24} />
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

export default StockSlider;