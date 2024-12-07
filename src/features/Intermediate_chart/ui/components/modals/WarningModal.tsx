import React from 'react';
import * as S from '@/features/Intermediate_chart/ui/components/styles';

interface WarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

    export const WarningModal: React.FC<WarningModalProps> = ({
    isOpen,
    onClose
    }) => {
    if (!isOpen) return null;

    return (
        <>
        <S.ModalOverlay />
        <S.ModalContainer>
            <S.ModalTitle>주의</S.ModalTitle>
            <S.CompletionModalContent>
            <S.CompletionMessage>
                보유한 포인트를 모두 사용하시겠습니까?
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

export default WarningModal; 