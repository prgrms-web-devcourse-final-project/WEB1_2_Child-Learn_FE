import React from 'react';
import * as S from '@/features/Intermediate_chart/ui/components/styles';

interface TradeResult {
    tradeType: 'buy' | 'sell';
    stockName: string;
    quantity: number;
    totalPrice: number;
  }
  
  export const CompletionModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    tradeResult: TradeResult | null;
  }> = ({
    isOpen,
    onClose,
    tradeResult
  }) => {
    if (!isOpen || !tradeResult) return null;
  
    return (
      <>
        <S.ModalOverlay />
        <S.ModalContainer>
          <S.ModalTitle>
            {tradeResult.tradeType === 'buy' ? '매수' : '매도'} 완료
          </S.ModalTitle>
          <S.CompletionModalContent>
            <S.CompletionMessage>
              {`${tradeResult.stockName}
              ${tradeResult.quantity}주를 
              ${tradeResult.totalPrice.toLocaleString()}포인트에 
              ${tradeResult.tradeType === 'buy' ? '매수' : '매도'}하였습니다.`}
            </S.CompletionMessage>
            <S.CompletionButtonGroup>
              <S.SingleButton color="#1B63AB" onClick={onClose}>
                확인
              </S.SingleButton>
            </S.CompletionButtonGroup>
          </S.CompletionModalContent>
        </S.ModalContainer>
      </>
    );
  };