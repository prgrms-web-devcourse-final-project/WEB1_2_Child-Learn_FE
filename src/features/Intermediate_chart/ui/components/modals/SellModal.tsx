import React from 'react';
import * as S from '@/features/Intermediate_chart/ui/components/styles';

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
    if (!isOpen) return null;
  
    console.log(stockId);
  
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
              <S.ConfirmButton type="sell" onClick={() => onConfirm(0, 0)}>
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