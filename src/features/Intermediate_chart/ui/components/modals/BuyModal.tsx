import React, { useState, useEffect } from 'react';
import { useStockStore } from '@/features/Intermediate_chart/model/stock';
import * as S from '@/features/Intermediate_chart/ui/components/styles';

interface BuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (tradePoint: number) => Promise<void>;
  stockId: number;
  stockName: string;
  initialPrice: string;
  points: number;
}

export const BuyModal: React.FC<BuyModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  stockId,
  stockName,
  initialPrice,
  points
}) => {
  const [tradePoint, setTradePoint] = useState('');
  const executeTrade = useStockStore(state => state.executeTrade);

  const handleTradePointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setTradePoint(value);
  };

  const handleConfirm = async () => {
    try {
      const point = Number(tradePoint);
      if (point > points) {
        throw new Error('보유 포인트가 부족합니다.');
      }

      // 매수 실행
      await executeTrade(stockId, point, 'buy', stockName, Number(initialPrice));
      await onConfirm(point);
      onClose();
    } catch (error: any) {
      console.error('매수 실패:', error);
      // 에러 처리...
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <S.ModalOverlay onClick={onClose} />
      <S.ModalContainer>
        <S.ModalTitle>매수하기</S.ModalTitle>
        <S.ModalContent>
          <S.FormGroup>
            <S.Label>{stockName}</S.Label>
          </S.FormGroup>

          <S.FormGroup>
            <S.Label>투자 포인트</S.Label>
            <S.Input
              type="text"
              value={tradePoint}
              onChange={handleTradePointChange}
              placeholder="투자할 포인트를 입력하세요"
            />
          </S.FormGroup>

          <S.ButtonGroup>
            <S.ConfirmButton 
              type="buy"
              onClick={handleConfirm}
              disabled={!tradePoint || Number(tradePoint) <= 0 || Number(tradePoint) > points}
            >
              매수하기
            </S.ConfirmButton>
            <S.CancelButton onClick={onClose}>
              나가기
            </S.CancelButton>
          </S.ButtonGroup>
        </S.ModalContent>
      </S.ModalContainer>
    </>
  );
};