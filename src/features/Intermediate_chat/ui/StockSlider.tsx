import React, { useState } from 'react';
import styled from 'styled-components';
import { StockChart } from './stockchart';
import { stockList } from '../model/stock';
import { ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import ArticleComponent from '../../article/article';
import { TrendPrediction, Relevance } from '../../article/type/article';

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
  cursor: pointer;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 106px;
  margin-top: 16px;
`;

const ActionButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const BuyButton = styled(ActionButton)`
  background-color: #1B63AB;
  color: white;

  &:hover {
    background-color: #145293;
  }
`;

const SellButton = styled(ActionButton)`
  background-color: #D75442;
  color: white;

  &:hover {
    background-color: #C04937;
  }
`;

const ArticleContainer = styled.div`
  margin-top: 20px;
`;

// Modal Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 24px;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  z-index: 101;
`;

const ModalTitle = styled.h2`
  text-align: center;
  margin-bottom: 24px;
  font-size: 20px;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f5f5f5;
  &:disabled {
    background-color: #f5f5f5;
    color: #666;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 0;
`;

const QuantityButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background-color: #f0f0f0;
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const StockSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState(1);

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

  const handleTradeClick = (type: 'buy' | 'sell') => {
    setTradeType(type);
    setShowTradeModal(true);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const currentStock = stockList[currentSlide];

  const sampleArticle = {
    id: currentSlide + 1,
    article_id: 1001,
    stock_symbol: currentStock.name || "Sample Stock",
    trend_prediction: TrendPrediction.UP,
    content: `Sample content for ${currentStock.name || "Stock"} analysis...`,
    relevance: Relevance.HIGH,
    created_at: new Date().toISOString(),
    duration: 60,
    mid_stock_id: currentSlide + 1,
    adv_id: 1
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
        />
      </ChartContainer>

      {showActions && (
        <>
          <ActionButtons>
            <BuyButton onClick={() => handleTradeClick('buy')}>매수</BuyButton>
            <SellButton onClick={() => handleTradeClick('sell')}>매도</SellButton>
          </ActionButtons>
          
          <ArticleContainer>
            <ArticleComponent article={sampleArticle} />
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
            
            <FormGroup>
              <Label>구매할 주식</Label>
              <Input
                type="text"
                value="1000.00"
                disabled
              />
            </FormGroup>

            <FormGroup>
              <Label>구매 포인트</Label>
              <Input
                type="text"
                value="1000.00"
                disabled
              />
            </FormGroup>

            <FormGroup>
              <Label>개수</Label>
              <QuantityControl>
                <QuantityButton
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </QuantityButton>
                <Input
                  type="text"
                  value={quantity}
                  disabled
                  style={{ width: '80px', textAlign: 'center' }}
                />
                <QuantityButton
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus size={16} />
                </QuantityButton>
              </QuantityControl>
            </FormGroup>

            <ButtonGroup>
              <BuyButton onClick={() => setShowTradeModal(false)} style={{ flex: 1 }}>
                {tradeType === 'buy' ? '매수하기' : '매도하기'}
              </BuyButton>
              <ActionButton 
                onClick={() => setShowTradeModal(false)}
                style={{ flex: 1, backgroundColor: '#gray-300' }}
              >
                나가기
              </ActionButton>
            </ButtonGroup>
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