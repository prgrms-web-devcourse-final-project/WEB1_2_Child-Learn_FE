import React, { useState } from 'react';
import { Container, ChartContainer } from '';
import { Button } from '@/shared/ui/Intermediate_Button/Intermediate_Button';
import { Stock } from '@/features/stockTrading/model/types';
import { TradeModal } from '@/features/stockTrading/ui/TradeModal';
import { useStockSlider } from '../lib/useStockSlider';

interface StockSliderProps {
  stocks: Stock[];
}

export const StockSlider: React.FC<StockSliderProps> = ({ stocks }) => {
  const {
    currentStock,
    isModalOpen,
    tradeType,
    handleStockClick,
    handleTradeClick,
    handleTradeConfirm,
    handleCloseModal
  } = useStockSlider(stocks);

  return (
    <Container>
      <ChartContainer onClick={handleStockClick}>
        {/* Chart Component */}
      </ChartContainer>

      {isModalOpen && (
        <>
          <div>
            <Button onClick={() => handleTradeClick('buy')}>매수</Button>
            <Button onClick={() => handleTradeClick('sell')}>매도</Button>
          </div>

          {tradeType && (
            <TradeModal
              type={tradeType}
              stockData={currentStock}
              onClose={handleCloseModal}
              onConfirm={handleTradeConfirm}
            />
          )}
        </>
      )}
    </Container>
  );
};