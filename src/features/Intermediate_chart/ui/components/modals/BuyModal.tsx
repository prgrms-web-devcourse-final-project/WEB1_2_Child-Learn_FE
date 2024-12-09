import React, { useState, useEffect } from 'react';
import { useStockStore } from '@/features/Intermediate_chart/model/stock';
import * as S from '@/features/Intermediate_chart/ui/components/styles';
import styled from 'styled-components';

interface BuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (tradePoint: number, quantity: number, stockId: number) => Promise<void>;
  stockId: number;
  stockName: string;
  initialPrice: string;
  points: number;
}

export const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  margin: 8px 0;
`;

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
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState<string>('');
  const currentStockPrices = useStockStore(state => state.currentStockPrices);

  // 현재 주식 가격
  const currentPrice = currentStockPrices[0]?.avgPrice || Number(initialPrice) || 0;

  useEffect(() => {
    if (tradePoint) {
      const calculatedQuantity = Math.floor(Number(tradePoint) / currentPrice);
      setQuantity(calculatedQuantity);
    } else {
      setQuantity(0);
    }
  }, [tradePoint, currentPrice]);

  const handleTradePointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setTradePoint(value);
    setError('');
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.floor(Number(e.target.value.replace(/[^0-9]/g, '')));
    setQuantity(value);
    setTradePoint((value * currentPrice).toString());
    setError('');
  };

  const handleConfirm = async () => {
    try {
      const point = Number(tradePoint);
      
      if (point > points) {
        setError('포인트가 부족합니다.');
        return;
      }

      if (point === points) {
        // 경고 모달 표시 로직
        const confirmAllIn = window.confirm('보유한 포인트를 모두 사용하시겠습니까?');
        if (!confirmAllIn) {
          return;
        }
      }

      await onConfirm(point, quantity, stockId);
      setTradePoint('');
      setQuantity(0);
      setError('');
      onClose();
    } catch (error: any) {
      setError(error.message || '매수 처리 중 오류가 발생했습니다.');
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
            <S.Label>종목명</S.Label>
            <div>{stockName}</div>
          </S.FormGroup>

          <S.FormGroup>
            <S.Label>현재가</S.Label>
            <div>{currentPrice.toLocaleString()}P</div>
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

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <S.ButtonGroup>
            <S.ConfirmButton 
              type="buy"
              onClick={handleConfirm}
              disabled={!tradePoint || Number(tradePoint) <= 0 || Number(tradePoint) > points}
            >
              매수하기
            </S.ConfirmButton>
            <S.CancelButton onClick={onClose}>
              취소
            </S.CancelButton>
          </S.ButtonGroup>
        </S.ModalContent>
      </S.ModalContainer>
    </>
  );
};