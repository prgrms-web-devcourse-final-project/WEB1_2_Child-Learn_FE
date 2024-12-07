import React from 'react';
import * as S from '@/features/Intermediate_chart/ui/components/styles';

export const PointErrorModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
  }> = ({
    isOpen,
    onClose
  }) => {
    if (!isOpen) return null;
  
    return (
      <>
        <S.ModalOverlay />
        <S.ModalContainer>
          <S.ModalTitle>거래 실패</S.ModalTitle>
          <S.CompletionModalContent>
            <S.CompletionMessage>
              포인트가 부족합니다.
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