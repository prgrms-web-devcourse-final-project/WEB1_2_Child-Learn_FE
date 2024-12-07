import React, { useState } from 'react';
import styled from 'styled-components';
import { useStockStore } from '@/features/Intermediate_chart/model/stock';
import * as S from '@/features/Intermediate_chart/ui/components/styles';
interface ErrorModalProps {
    isOpen: boolean;
    message: string;
    onClose: () => void;
  }

interface TradeData {
  stockId: number;
  tradePoint?: number;
  type: 'buy' | 'sell';
  stockName: string;
}

// 사용자 정보를 가져오는 함수
const getUserId = () => {
  const userInfo = localStorage.getItem('userInfo');
  if (!userInfo) return null;
  try {
    const parsed = JSON.parse(userInfo);
    return parsed.memberId;
  } catch (e) {
    console.error('Failed to parse user info:', e);
    return null;
  }
};

export const ErrorModal: React.FC<ErrorModalProps> = ({
    isOpen,
    message,
    onClose
  }) => {
    if (!isOpen) return null;
  
    return (
      <S.ModalOverlay onClick={onClose}>
        <S.ModalContent onClick={e => e.stopPropagation()}>
          <styled.p>{message || '오류가 발생했습니다.'}</styled.p>
          <S.ButtonGroup>
            <S.SingleButton color="#50b498" onClick={onClose}>
              확인
            </S.SingleButton>
          </S.ButtonGroup>
        </S.ModalContent>
      </S.ModalOverlay>
    );
  };

export const TradeComponent: React.FC = () => {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const executeTrade = useStockStore(state => state.executeTrade);

  const handleTrade = async (tradeData: TradeData) => {
    const memberId = getUserId();
    
    if (!memberId) {
      setErrorMessage('로그인이 필요한 서비스입니다.');
      setShowErrorModal(true);
      return;
    }

    try {
      const result = await executeTrade(
        tradeData.stockId,
        tradeData.tradePoint || 0,
        tradeData.type,
        tradeData.stockName,
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
      } else if (error.message.includes('지갑 업데이트에 실패했습니다')) {
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
        type: 'buy',
        stockName: '삼성전자'
      })}>
        매수
      </button>
      <button onClick={() => handleTrade({
        stockId: 1,
        type: 'sell',
        stockName: '삼성전자'
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

// Styled components는 이전과 동일하게 유지
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

export const ModalMessage = styled.p`
  margin: 0 0 20px 0;
  font-size: 16px;
`;

export default TradeComponent;