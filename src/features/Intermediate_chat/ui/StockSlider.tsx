
// src/Intermediate_chat/ui/StockSlider.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { StockChart } from './stockchart';
import { stockList } from '../model/stock';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SlideContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  background: #f0fff0;
  padding: 20px;
  border-radius: 20px;
`;

const NavigationButton = styled.button`
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

const SlideIndicators = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
`;

const Indicator = styled.div<{ active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#1B63AB' : '#ddd'};
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.active ? '#1B63AB' : '#bbb'};
  }
`;

const StockInfo = styled.div`
  text-align: center;
  margin-bottom: 15px;
  padding: 10px;
  background: white;
  border-radius: 8px;
`;

const StockName = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin: 0 0 8px 0;
`;

const StockDescription = styled.p`
  color: #666;
  margin: 0;
`;

const StockSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePrevSlide = () => {
    setCurrentSlide(current => (current - 1 + stockList.length) % stockList.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide(current => (current + 1) % stockList.length);
  };

  const currentStock = stockList[currentSlide];

  return (
    <SlideContainer>
      <PrevButton onClick={handlePrevSlide} disabled={currentSlide === 0}>
        <ChevronLeft size={24} />
      </PrevButton>

      <StockChart 
        stockId={currentStock.id} 
        title={`${currentStock.name} 주가 차트`}
      />

      <NextButton onClick={handleNextSlide} disabled={currentSlide === stockList.length - 1}>
        <ChevronRight size={24} />
      </NextButton>

      <SlideIndicators>
        {stockList.map((_, index) => (
          <Indicator
            key={index}
            active={index === currentSlide}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </SlideIndicators>
    </SlideContainer>
  );
};

export default StockSlider;