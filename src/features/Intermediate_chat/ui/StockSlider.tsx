import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { StockChart } from './stockchart';
import { generateStockData } from '../model/stock';
import { ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import ArticleComponent from '../../article/article';
import { TrendPrediction, Relevance } from '../../article/type/article';
import { ChartData, StockSlideData } from '../types/stock';

interface TradeResult {
  stockName: string;
  price: number;
  quantity: number;
  total: number;
  type: 'buy' | 'sell';
  date: string;
}

// 메인 컨테이너: 전체 슬라이더를 감싸는 컨테이너
const SlideContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  background: #f0fff0;
  padding: 20px;
  border-radius: 20px;
`;

// 좌/우 네비게이션 버튼의 기본 스타일 ($show prop으로 버튼 표시/숨김 제어)
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

// 이전 버튼 (왼쪽 위치)
const PrevButton = styled(NavigationButton)`
  left: 10px;
`;

// 다음 버튼 (오른쪽 위치)
const NextButton = styled(NavigationButton)`
  right: 10px;
`;

// 하단 슬라이드 인디케이터 컨테이너 ($show prop으로 표시/숨김 제어)
const SlideIndicators = styled.div<{ $show?: boolean }>`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  visibility: ${props => props.$show ? 'visible' : 'hidden'};
`;

// 각 인디케이터 점 ($active prop으로 현재 슬라이드 표시)
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

// 차트를 감싸는 컨테이너
const ChartContainer = styled.div`
  cursor: pointer;
`;

// 매수/매도 버튼을 감싸는 컨테이너
const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 106px;
  margin-top: 16px;
`;

// 기본 버튼 스타일
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

// 매수 버튼 스타일 (파란색 계열)
const BuyButton = styled(Button)`
  background: #1B63AB;
  color: white;

  &:hover {
    background: #145293;
  }
`;

// 매도 버튼 스타일 (빨간색 계열)
const SellButton = styled(Button)`
  background: #D75442;
  color: white;

  &:hover {
    background: #C04937;
  }
`;

// 기사 컨테이너
const ArticleContainer = styled.div`
  margin-top: 20px;
`;

// 모달 오버레이 (어두운 배경)
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 100;
`;

// 모달 컨테이너
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

// 모달 제목
const ModalTitle = styled.div`
  text-align: center;
  padding: 16px;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid #eee;
`;

// 모달 내용 컨테이너
const ModalContent = styled.div`
  padding: 20px;
`;

// 폼 그룹 (라벨 + 입력 필드 세트)
const FormGroup = styled.div`
  margin-bottom: 16px;
  
  &:last-of-type {
    margin-bottom: 24px;
  }
`;

// 입력 필드 라벨
const Label = styled.div`
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
`;

// 기본 입력 필드
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

// 수량 조절 컨테이너
const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// 수량 조절 버튼 (+/- 버튼)
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

// 수량 입력 필드
const QuantityInput = styled(Input)`
  width: 80px;
  text-align: center;
  padding: 0;
`;

// 매수/매도 모달의 버튼 그룹 (2개의 버튼)
const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 0;
`;

// 결과/제한 모달의 버튼 그룹 (가운데 정렬된 1개의 버튼)
const ResultButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0;
`;

// 모달 내 기본 버튼
const ModalButton = styled(Button)`
  width: 100%;
`;

// 매수/매도 확인 버튼 (type prop에 따라 색상 변경)
const ConfirmButton = styled(ModalButton)<{ type?: 'buy' | 'sell' }>`
  background: ${props => props.type === 'sell' ? '#D75442' : '#1B63AB'};
  color: white;

  &:hover {
    background: ${props => props.type === 'sell' ? '#C04937' : '#145293'};
  }
`;

// 결과/제한 모달의 확인 버튼
const SingleButton = styled(ModalButton)`
  width: 120px;
  background: #1B63AB;
  color: white;

  &:hover {
    background: #145293;
  }
`;

// 취소 버튼
const CancelButton = styled(ModalButton)`
  background: #f0f0f0;
  color: #666;

  &:hover {
    background: #e5e5e5;
  }
`;

// 결과 모달 내용 (가운데 정렬)
const ResultModalContent = styled(ModalContent)`
  text-align: center;
`;

// 결과 텍스트
const ResultText = styled.p`
  margin: 20px 0;
  font-size: 16px;
  color: #333;
`;

// 제한 모달 내용 (가운데 정렬)
const LimitModalContent = styled(ModalContent)`
  text-align: center;
  padding: 30px 20px;
`;

// 제한 텍스트
const LimitText = styled.p`
  margin: 0;
  margin-bottom: 15px;
  font-size: 16px;
  color: #333;
`;

interface StockSliderProps {
  stocks: StockSlideData[];
}

const StockSlider: React.FC<StockSliderProps> = ({ stocks }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState(1);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [price, setPrice] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [hasTradedToday, setHasTradedToday] = useState(false);
  const [tradeResult, setTradeResult] = useState<TradeResult | null>(null);

  const currentStock = stocks[currentSlide];

  useEffect(() => {
    if (currentStock) {
      const data = generateStockData(currentStock.id);
      setChartData(data);
    }
  }, [currentStock]);

  useEffect(() => {
    const numPrice = price === '' ? 0 : parseInt(price.replace(/,/g, ''));
    setTotalPrice(numPrice * quantity);
  }, [price, quantity]);

  const handlePrevSlide = () => {
    setCurrentSlide(current => (current - 1 + stocks.length) % stocks.length);
    setShowActions(false);
  };

  const handleNextSlide = () => {
    setCurrentSlide(current => (current + 1) % stocks.length);
    setShowActions(false);
  };

  const handleChartClick = () => {
    setShowActions(true);
  };

  const handleTradeClick = (type: 'buy' | 'sell') => {
    if (hasTradedToday) {
      setTradeType(type);  // 이 부분 추가
      setShowLimitModal(true);
      return;
    }
    setTradeType(type);
    setShowTradeModal(true);
    setQuantity(1);
    setPrice('');
  };

  const handleTrade = () => {
    const numPrice = parseInt(price.replace(/,/g, ''));
    const result: TradeResult = {
      stockName: currentStock.name,
      price: numPrice,
      quantity: quantity,
      total: totalPrice,
      type: tradeType,
      date: new Date().toISOString()
    };

    setTradeResult(result);
    setShowTradeModal(false);
    setShowResultModal(true);
    setHasTradedToday(true);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value === '') {
      setPrice('');
      return;
    }
    const numValue = parseInt(value);
    setPrice(numValue.toLocaleString());
  };

  const formatPrice = (price: number) => {
    return Math.floor(price).toLocaleString();
  };

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
        <StockChart 
          stockId={currentStock.id} 
          title={`${currentStock.name} 주가 차트`}
          data={chartData}
        />
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
              stock_symbol: currentStock.name,
              trend_prediction: TrendPrediction.UP,
              content: `${currentStock.name} 분석...`,
              relevance: Relevance.HIGH,
              created_at: new Date().toISOString(),
              duration: 60,
              mid_stock_id: currentStock.id,
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
                <Label>{currentStock.name}</Label>
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
                  value={formatPrice(totalPrice)}
                  disabled
                />
              </FormGroup>

              <ButtonGroup>
                <ConfirmButton 
                  onClick={handleTrade}
                  disabled={!price || price === '0'}
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
        주식 {tradeResult.type === 'buy' ? '매수' : '매도'}주문
      </ModalTitle>
      <ModalContent>
        <FormGroup>
          <Label>종목명</Label>
          <Input value={tradeResult.stockName} disabled />
        </FormGroup>
        <FormGroup>
          <Label>주문가격</Label>
          <Input value={formatPrice(tradeResult.price)} disabled />
        </FormGroup>
        <FormGroup>
          <Label>주문수량</Label>
          <Input value={tradeResult.quantity} disabled />
        </FormGroup>
        <FormGroup>
          <Label>포인트가격</Label>
          <Input value={formatPrice(tradeResult.total)} disabled />
        </FormGroup>
        <ResultButtonGroup>
          <SingleButton onClick={() => setShowResultModal(false)}>
            확인
          </SingleButton>
        </ResultButtonGroup>
      </ModalContent>
    </ModalContainer>
  </>
)}

{showLimitModal && (
  <>
    <ModalOverlay />
    <ModalContainer>
      <ModalTitle>
        거래 제한
      </ModalTitle>
      <LimitModalContent>
        <LimitText>
          오늘은 더 이상 {tradeType === 'buy' ? '매수' : '매도'}를 할 수 없습니다.
        </LimitText>
        <ResultButtonGroup>
          <SingleButton onClick={() => setShowLimitModal(false)}>
            확인
          </SingleButton>
        </ResultButtonGroup>
      </LimitModalContent>
    </ModalContainer>
  </>
)}

      <NextButton 
        onClick={handleNextSlide} 
        disabled={currentSlide === stocks.length - 1}
        $show={!showActions}
      >
        <ChevronRight size={24} />
      </NextButton>

      <SlideIndicators $show={!showActions}>
        {stocks.map((_, index) => (
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