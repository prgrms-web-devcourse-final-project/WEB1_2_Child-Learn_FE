import React from 'react';
import * as S from '@/features/Intermediate_chart/ui/components/styles';

interface TradeResult {
  tradeType: 'buy' | 'sell';
  stockName: string;
  price: number;
  quantity: number;
  totalPrice: number;
}
interface ResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    tradeResult: TradeResult | null;
    onConfirm: () => void;
  }
  
  export const ResultModal: React.FC<ResultModalProps> = ({
    isOpen,
    tradeResult,
    onConfirm
  }) => {
    if (!isOpen || !tradeResult) return null;
  
    return (
      <>
        <S.ModalOverlay />
        <S.ModalContainer>
          <S.ModalTitle>
            주식 {tradeResult.tradeType === 'buy' ? '매수' : '매도'}주문
          </S.ModalTitle>
          <S.ModalContent>
            <S.ResultRow>
              <S.ResultLabel>종목명</S.ResultLabel>
              <S.ResultValue>{tradeResult.stockName}</S.ResultValue>
            </S.ResultRow>
            <S.ResultRow>
              <S.ResultLabel>
                {tradeResult.tradeType === 'buy' ? '매수가격' : '매도가격'}
              </S.ResultLabel>
              <S.ResultValue>{tradeResult.price}원</S.ResultValue>  {/* 원래 매수가격(100원) */}
            </S.ResultRow>
            <S.ResultRow>
              <S.ResultLabel>주문수량</S.ResultLabel>
              <S.ResultValue>{tradeResult.quantity}주</S.ResultValue>
            </S.ResultRow>
            <S.ResultRow>
              <S.ResultLabel>포인트가격</S.ResultLabel>
              <S.ResultValue>{tradeResult.totalPrice.toLocaleString()}P</S.ResultValue>
            </S.ResultRow>
            <S.ResultButtonGroup>
              <S.SingleButton color="#50b498" onClick={onConfirm}>
                확인
              </S.SingleButton>
            </S.ResultButtonGroup>
          </S.ModalContent>
        </S.ModalContainer>
      </>
    );
  };