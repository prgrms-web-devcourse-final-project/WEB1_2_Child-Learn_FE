import React, { useState } from 'react';
import { useStockStore } from '@/features/Intermediate_chart/model/stock';
import * as S from '@/features/Intermediate_chart/ui/components/styles';

interface SellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  stockId: number;
  stockName: string;
}

export const SellModal: React.FC<SellModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  stockId,
  stockName
}) => {
  const [error, setError] = useState<string>('');
  const stockDetails = useStockStore(state => state.stockDetails);
  const currentStockPrices = useStockStore(state => state.currentStockPrices);

  const currentStock = stockDetails.find(stock => stock.midStockId === stockId);
  const currentPrice = currentStockPrices[0]?.avgPrice || 0;

  // 보유 수량 계산 - 소수점 허용
  const quantity = currentStock?.details.reduce((total, detail) => {
    if (detail.tradeType === 'BUY') {
      return total + (detail.tradePoint / detail.pricePerStock);  // 실제 구매 주식 수량
    }
    return total;
  }, 0) || 0;


  const purchasePrice = currentStock?.details
  .filter(detail => detail.tradeType === 'BUY')
  .reduce((total, detail) => {
    return total + detail.pricePerStock;
  }, 0) || 0;


  // 예상 수익 계산
  const expectedProfit = ((currentPrice - purchasePrice) * quantity);

  const handleConfirm = async () => {
    try {
      setError('');
      await onConfirm();
    } catch (error: any) {
      console.error('매도 처리 중 오류:', error);
      setError(error.message || '매도 처리 중 오류가 발생했습니다.');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <S.ModalOverlay onClick={onClose} />
      <S.ModalContainer>
        <S.ModalTitle>매도 확인</S.ModalTitle>
        <S.ModalContent>
          <S.StockInfo>
            <div>종목명: {stockName}</div>
            <div>보유 수량: {quantity.toFixed(2)}주</div>
            <div>현재 가격: {currentPrice.toLocaleString()}P</div>
            <div>예상 수익: {expectedProfit.toLocaleString()}P</div>
          </S.StockInfo>
          {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
          <S.CompletionMessage>
            {stockName}을(를) 매도하시겠습니까?
          </S.CompletionMessage>
          <S.ButtonGroup>
            <S.ConfirmButton 
              type="sell" 
              onClick={handleConfirm}
            >
              매도하기
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