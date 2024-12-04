import React from 'react';
import * as S from '@/features/Intermediate_chart/ui/components/styles';
import { TradeDetail } from '@/features/Intermediate_chart/model/types/stock';

interface TradeResult {
  tradeType: 'buy' | 'sell';
  stockName: string;
  quantity: number;
  totalPrice: number;
}
interface CompletionModalProps {
    isOpen: boolean;
    onClose: () => void;
    tradeResult: TradeResult | null;
  }
  
  export const CompletionModal: React.FC<CompletionModalProps> = ({
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
            {tradeResult.tradeType === 'buy' ? '매수' : '매도'}가 완료되었습니다
          </S.ModalTitle>
          <S.CompletionModalContent>
            <S.CompletionMessage>
              {`${tradeResult.stockName}
              ${tradeResult.quantity}주를 
              ${tradeResult.totalPrice.toLocaleString()}포인트에 
              매도하였습니다.`}
            </S.CompletionMessage>
            <S.CompletionButtonGroup>
              <S.SingleButton 
                color="#1B63AB"
                onClick={onClose}
              >
                확인
              </S.SingleButton>
            </S.CompletionButtonGroup>
          </S.CompletionModalContent>
        </S.ModalContainer>
      </>
    );
  };