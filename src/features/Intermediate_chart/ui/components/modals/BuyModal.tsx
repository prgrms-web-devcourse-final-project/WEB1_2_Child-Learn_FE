import React, { useState, useEffect } from 'react';
import { useStockStore } from '@/features/Intermediate_chart/model/stock';
import * as S from '@/features/Intermediate_chart/ui/components/styles';

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
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };


  const handleConfirm = async () => {
    try {
      const buyPrice = parseInt(price.replace(/,/g, '')); // 매수가격 (100원)
      const buyQuantity = quantity; // 수량 (2주)
      const tradePoint = buyPrice * buyQuantity; // 총 포인트 (100 * 2 = 200P)
      
      const response = await executeTrade(stockId, tradePoint, 'buy');
      onConfirm(buyPrice, buyQuantity); // 매수가격과 수량 전달
  
    } catch (error) {
      console.error('매수 실패:', error);
    }
  };

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
              disabled={!price || price === '0' || totalPrice > points}
            >
              매수하기
            </S.ConfirmButton>
            <S.CancelButton onClick={onClose}>
              나가기
            </S.CancelButton>
          </S.ButtonGroup>
        </S.ModalContent>
      </S.ModalContainer>
    </>
  );
};