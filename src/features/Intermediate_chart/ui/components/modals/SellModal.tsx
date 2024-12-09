import React, { useState } from 'react';
import { useStockStore } from '@/features/Intermediate_chart/model/stock';
import * as S from '@/features/Intermediate_chart/ui/components/styles';
import { baseApi } from '@/shared/api/base';

interface SellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  stockId: number;
  stockName: string;
}

// Add new interface for the API response
interface SellResponse {
  earnedPoints: number;
  totalPoints: number;
}

export const SellModal: React.FC<SellModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  stockId,
  stockName
}) => {
  const [error, setError] = useState<string>('');
  const [sellResponse, setSellResponse] = useState<SellResponse | null>(null);
  const stockDetails = useStockStore(state => state.stockDetails);
  const currentStockPrices = useStockStore(state => state.currentStockPrices);

  const currentStock = stockDetails.find(stock => stock.midStockId === stockId);
  const currentPrice = currentStockPrices[0]?.avgPrice || 0;

  const quantity = currentStock?.details.reduce((total, detail) => {
    if (detail.tradeType === 'BUY') {
      return total + (detail.tradePoint / detail.pricePerStock);
    }
    return total;
  }, 0) || 0;

  const purchasePrice = currentStock?.details
    .filter(detail => detail.tradeType === 'BUY')
    .reduce((total, detail) => {
      return total + detail.pricePerStock;
    }, 0) || 0;

  const handleConfirm = async () => {
    try {
      setError('');
      // Call the baseApi directly here to get the response
      const response = await baseApi.post(`/mid-stocks/${currentStock?.midStockId}/sell`, {
        memberId: parseInt(localStorage.getItem('userId') || '0'),
        transactionType: "MID",
        pointType: "STOCK",
        stockType: "MID",
        stockName: stockName
      });

      // Store the response data
      setSellResponse(response.data);
      
      // Call the original onConfirm
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
            <div>매도 수익: {sellResponse ? sellResponse.totalPoints.toLocaleString() : currentPrice.toLocaleString()}P</div>
            <div>예상 수익: {sellResponse ? sellResponse.earnedPoints.toLocaleString() : '계산 중...'}P</div>
          </S.StockInfo>
          <div>예상 수익: {sellResponse ? sellResponse.earnedPoints.toLocaleString() : '다음날 부터 매도를 할 수 있습니다.'}P</div>
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