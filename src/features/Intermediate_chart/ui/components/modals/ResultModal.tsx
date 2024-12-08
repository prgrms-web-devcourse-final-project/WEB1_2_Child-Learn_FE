import React from 'react';
import * as S from '@/features/Intermediate_chart/ui/components/styles';

interface TradeResult {
 success: boolean;
 message: string;
 tradeType: 'buy' | 'sell';
 stockName: string;
 totalPrice: number;  // 거래 금액만 남김
}

export const ResultModal: React.FC<{
 isOpen: boolean;
 onClose: () => void;
 tradeResult: TradeResult | null;
 onConfirm: () => void;
}> = ({
 isOpen,
 tradeResult,
 onConfirm
}) => {
 if (!isOpen || !tradeResult) return null;

 return (
   <>
     <S.ModalOverlay />
     <S.ModalContainer>
       <S.ModalTitle>
         주식 {tradeResult.tradeType === 'buy' ? '매수' : '매도'} 결과
       </S.ModalTitle>
       <S.ModalContent>
         <S.ResultRow>
           <S.ResultLabel>종목명</S.ResultLabel>
           <S.ResultValue>{tradeResult.stockName}</S.ResultValue>
         </S.ResultRow>
         <S.ResultRow>
           <S.ResultLabel>거래금액</S.ResultLabel>
           <S.ResultValue>{tradeResult.totalPrice.toLocaleString()}P</S.ResultValue>
         </S.ResultRow>
         <S.ResultButtonGroup>
           <S.SingleButton color="#50b498" onClick={onConfirm}>
             확인
           </S.SingleButton>
         </S.ResultButtonGroup>
       </S.ModalContent>
     </S.ModalContainer>
   </>
 );
};