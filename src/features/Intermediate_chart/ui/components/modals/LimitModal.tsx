import React from 'react';
import * as S from '@/features/Intermediate_chart/ui/components/styles';

interface LimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  tradeType: 'buy' | 'sell';
  message: string;
}

export const LimitModal: React.FC<LimitModalProps> = ({
  isOpen,
  onClose,
  tradeType,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <S.ModalOverlay />
      <S.ModalContainer>
        <S.ModalTitle>거래 제한</S.ModalTitle>
        <S.CompletionModalContent>
          <S.CompletionMessage>
            {tradeType === 'buy' 
              ? '오늘은 더 이상 매수를 할 수 없습니다.' 
              : '내일 다시 도전하세요!'}
          </S.CompletionMessage>
          <S.ResultButtonGroup>
            <S.SingleButton color="#50b498" onClick={onClose}>
              확인
            </S.SingleButton>
          </S.ResultButtonGroup>
        </S.CompletionModalContent>
      </S.ModalContainer>
    </>
  );
};