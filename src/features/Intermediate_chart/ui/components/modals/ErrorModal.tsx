import React, { useState } from 'react';
import styled from 'styled-components';
import { useStockStore } from '@/features/Intermediate_chart/model/stock';

interface ErrorModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

interface TradeData {
    stockId: number;
    tradePoint?: number;
    type: 'buy' | 'sell';
  }
  

export const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalMessage>{message}</ModalMessage>
        <ModalButton onClick={onClose}>확인</ModalButton>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  min-width: 300px;
  text-align: center;
`;

const ModalMessage = styled.p`
  margin: 0 0 20px 0;
  font-size: 16px;
`;

const ModalButton = styled.button`
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

// TradeComponent에 에러 처리 추가
export const TradeComponent: React.FC = () => {
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const executeTrade = useStockStore(state => state.executeTrade);
  
    const handleTrade = async (tradeData: TradeData) => {
      try {
        const result = await executeTrade(
          tradeData.stockId, 
          tradeData.tradePoint || 0, 
          tradeData.type
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
      <div>
        <button onClick={() => handleTrade({ 
          stockId: 1,
          tradePoint: 1000,
          type: 'buy'
        })}>
          매수
        </button>
        <button onClick={() => handleTrade({ 
          stockId: 1,
          type: 'sell'
        })}>
          매도
        </button>
        <ErrorModal 
          isOpen={showErrorModal}
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      </div>
    );
  };