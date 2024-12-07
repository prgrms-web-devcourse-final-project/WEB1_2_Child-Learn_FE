import React, { useState, useEffect } from 'react';
import { useStockStore } from '@/features/Intermediate_chart/model/stock';
import * as S from '@/features/Intermediate_chart/ui/components/styles';
import { ErrorModal } from '@/features/Intermediate_chart/ui/components/modals/ErrorModal';

interface BuyModalProps {
 isOpen: boolean;
 onClose: () => void;
 onConfirm: (buyPrice: number, buyQuantity: number) => Promise<void>;
 stockId: number;
 stockName: string;
 initialPrice: string;
 points: number;
}

export const BuyModal: React.FC<BuyModalProps> = ({
 isOpen,
 onClose,
 onConfirm,
 stockId,
 stockName,
 initialPrice,
 points
}) => {
 const [price, setPrice] = useState(initialPrice);
 const [quantity, setQuantity] = useState(1); 
 const [totalPrice, setTotalPrice] = useState(0);
 const [showError, setShowError] = useState(false);
 const [errorMessage, setErrorMessage] = useState('');
 const executeTrade = useStockStore(state => state.executeTrade);

 useEffect(() => {
   if (price) {
     const numPrice = parseInt(price.replace(/,/g, ''));
     setTotalPrice(numPrice * quantity);
   }
 }, [price, quantity]);

 const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   const value = e.target.value.replace(/[^0-9]/g, '');
   if (value === '') {
     setPrice('');
     setTotalPrice(0);
     return;
   }
   const numValue = parseInt(value);
   setPrice(numValue.toLocaleString());
   setTotalPrice(numValue * quantity);
 };
 
 const handleQuantityChange = (delta: number) => {
   const newQuantity = Math.max(1, quantity + delta);
   setQuantity(newQuantity);
   if (price) {
     const priceNum = parseInt(price.replace(/,/g, ''));
     setTotalPrice(priceNum * newQuantity);
   }
 };

 const handleConfirm = async () => {
    try {
      // 가격과 수량에서 tradePoint 계산
      const pricePerStock = parseInt(price.replace(/,/g, ''));
      const tradePoint = pricePerStock * quantity;
  
      // 포인트 부족 체크
      if (tradePoint > points) {
        setErrorMessage('보유 포인트가 부족합니다.');
        setShowError(true);
        return;
      }
  
      console.log('매수 요청 데이터:', {
        stockId,
        tradePoint,
        price: pricePerStock,
        quantity
      });
  
      // 매수 요청 실행
      await executeTrade(
        stockId,
        tradePoint,
        'buy',
        stockName
      );
  
      // 성공 시 처리
      await onConfirm(pricePerStock, quantity);
      onClose();
    } catch (error: any) {
      console.error('매수 실패:', error);
      setErrorMessage(error.message || '매수 처리 중 오류가 발생했습니다.');
      setShowError(true);
    }
  };

 const isDisabled = !price || 
   price === '0' || 
   totalPrice > points || 
   totalPrice <= 0;

 if (!isOpen) return null;

 return (
   <>
     <S.ModalOverlay onClick={onClose} />
     <S.ModalContainer>
       <S.ModalTitle>매수하기</S.ModalTitle>
       <S.ModalContent>
         <S.FormGroup>
           <S.Label>{stockName}</S.Label>
           <S.Input
             type="text"
             value={price}
             onChange={handlePriceChange}
             placeholder="매수가를 입력하세요"
           />
         </S.FormGroup>

         <S.FormGroup>
           <S.Label>수량</S.Label>
           <S.QuantityControl>
             <S.QuantityButton
               onClick={() => handleQuantityChange(-1)}
               disabled={quantity <= 1}
             >
               <img src="/img/minus.png" alt="감소" />
             </S.QuantityButton>
             <S.QuantityInput
               type="text"
               value={quantity}
               disabled
             />
             <S.QuantityButton onClick={() => handleQuantityChange(1)}>
               <img src="/img/plus.png" alt="증가" />
             </S.QuantityButton>
           </S.QuantityControl>
         </S.FormGroup>

         <S.FormGroup>
           <S.Label>총 포인트</S.Label>
           <S.Input
             type="text"
             value={totalPrice.toLocaleString()}
             disabled
           />
         </S.FormGroup>

         <S.ButtonGroup>
           <S.ConfirmButton 
             type="buy"
             onClick={handleConfirm}
             disabled={isDisabled}
           >
             매수하기
           </S.ConfirmButton>
           <S.CancelButton onClick={onClose}>
             나가기
           </S.CancelButton>
         </S.ButtonGroup>
       </S.ModalContent>
     </S.ModalContainer>

     <ErrorModal 
       isOpen={showError}
       message={errorMessage}
       onClose={() => setShowError(false)}
     />
   </>
 );
};