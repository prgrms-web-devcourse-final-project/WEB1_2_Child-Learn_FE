import React from 'react';
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
  const executeTrade = useStockStore(state => state.executeTrade);

  const handleConfirm = async () => {
    try {
      // 매도 실행 (수량 선택 없이 전량 매도)
      await executeTrade(stockId, 0, 'sell', stockName, parseInt(localStorage.getItem('userId') || '0'));
      await onConfirm();
      onClose();
    } catch (error: any) {
      console.error('매도 실패:', error);
      // 에러 처리...
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <S.ModalOverlay onClick={onClose} />
      <S.ModalContainer>
        <S.ModalTitle>매도 확인</S.ModalTitle>
        <S.ModalContent>
          <S.CompletionMessage>
            {stockName}을(를) 매도하시겠습니까?
          </S.CompletionMessage>
          <S.ButtonGroup>
            <S.ConfirmButton type="sell" onClick={handleConfirm}>
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