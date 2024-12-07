import React, { useState, useEffect } from 'react';
import * as S from '@/features/Intermediate_chart/ui/components/styles';
import { useStockStore } from '@/features/Intermediate_chart/model/stock';

interface SellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (sellPrice: number, sellQuantity: number) => void;
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
  const { stockDetails, checkTradeAvailability, tradeAvailability } = useStockStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentStock = stockDetails.find(stock => stock.midStockId === stockId);
  
  // DB에서 제공하는 quantity 값 사용
  const quantity = currentStock?.details[0]?.quantity || 0;
  const currentPrice = currentStock?.details[0]?.pricePerStock || 0;
  
  // 컴포넌트 마운트 시 거래 가능 여부 체크
  useEffect(() => {
    if (isOpen && stockId) {
      checkTradeAvailability(stockId);
    }
  }, [isOpen, stockId, checkTradeAvailability]);

  const handleSellConfirm = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('로그인이 필요합니다.');
        return;
      }

      if (!quantity) {
        setError('매도할 수량이 없습니다.');
        return;
      }

      await onConfirm(currentPrice, quantity);
      onClose();
    } catch (error: any) {
      console.error('매도 실패:', error);
      setError(error.message || '매도 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // 예상 수익 계산
  const expectedProfit = quantity * currentPrice;

  return (
    <>
      <S.ModalOverlay onClick={onClose} />
      <S.ModalContainer>
        <S.ModalTitle>매도 확인</S.ModalTitle>
        <S.ModalContent>
          <S.StockInfo>
            <div>종목명: {stockName}</div>
            <div>보유 수량: {quantity}주</div>
            <div>현재 가격: {currentPrice.toLocaleString()}P</div>
            <div>예상 수익: {expectedProfit.toLocaleString()}P</div>
          </S.StockInfo>
          {error && (
            <S.ErrorMessage>{error}</S.ErrorMessage>
          )}
          <S.CompletionMessage>
            {stockName}을(를) 매도하시겠습니까?
          </S.CompletionMessage>
          <S.ButtonGroup>
            <S.ConfirmButton 
              type="sell" 
              onClick={handleSellConfirm}
              disabled={isLoading || !tradeAvailability.isPossibleSell}
            >
              {isLoading ? '처리중...' : '매도하기'}
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
