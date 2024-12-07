import React from 'react';
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
  const stockDetails = useStockStore(state => state.stockDetails);
  const currentStock = stockDetails.find(stock => stock.midStockId === stockId);
  
  // 보유한 주식 정보 계산
  const quantity = currentStock?.details.reduce((total, detail) => {
    if (detail.tradeType === 'BUY') {
      return total + detail.tradePoint;
    }
    return total;
  }, 0) || 0;

  // 현재 주식 가격 (마지막 거래 가격)
  const currentPrice = currentStock?.details[0]?.pricePerStock || 0;

  if (!isOpen) return null;

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
            <div>예상 수익: {(quantity * currentPrice).toLocaleString()}P</div>
          </S.StockInfo>
          <S.CompletionMessage>
            {stockName}을(를) 매도하시겠습니까?
          </S.CompletionMessage>
          <S.ButtonGroup>
            <S.ConfirmButton 
              type="sell" 
              onClick={() => onConfirm(currentPrice, quantity)}
              disabled={quantity <= 0}
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