import React, { useState } from 'react';
import styled from 'styled-components';
import { useStockStore } from '@/features/Intermediate_chart/model/stock';
import { ErrorModal } from '@/features/Intermediate_chart/ui/components/modals/ErrorModal';

interface TradeData {
  stockId: number;
  tradePoint?: number;
  type: 'buy' | 'sell';
}

export const TradeComponent: React.FC = () => {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const executeTrade = useStockStore(state => state.executeTrade);
  const stocks = useStockStore(state => state.stocks);

  const handleTrade = async (tradeData: TradeData) => {
    try {
      const stock = stocks.find(s => s.midStockId === tradeData.stockId);
      if (!stock) {
        throw new Error('주식 정보를 찾을 수 없습니다.');
      }

      const result = await executeTrade(
        tradeData.stockId, 
        tradeData.tradePoint || 0,
        tradeData.type,
        stock.midName,
        memberId
      );
      
      if (tradeData.type === 'sell' && 'earnedPoints' in result) {
        console.log(`Earned points: ${result.earnedPoints}`);
      }
    } catch (error: any) {
      let message = '거래 중 오류가 발생했습니다.';
      
      if (error.message.includes('이미 매수를 했습니다')) {
        message = '오늘은 이미 매수를 진행하셨습니다. 내일 다시 시도해주세요.';
      } else if (error.message.includes('매도할 주식을 찾을 수 없습니다')) {
        message = '매도할 주식이 없습니다.';
      } else if (error.response?.status === 500) {
        message = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      }

      setErrorMessage(message);
      setShowErrorModal(true);
    }
  };

  return (
    <TradeContainer>
      <TradeButton onClick={() => handleTrade({ 
        stockId: 1,
        tradePoint: 1000,
        type: 'buy'
      })}>
        매수
      </TradeButton>
      <TradeButton onClick={() => handleTrade({ 
        stockId: 1,
        type: 'sell'
      })}>
        매도
      </TradeButton>
      <ErrorModal 
        isOpen={showErrorModal}
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
    </TradeContainer>
  );
};

const TradeContainer = styled.div`
  display: flex;
  gap: 10px;
  padding: 20px;
`;

const TradeButton = styled.button`
  background-color: #7FBA7A;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #6ca968;
  }
`;