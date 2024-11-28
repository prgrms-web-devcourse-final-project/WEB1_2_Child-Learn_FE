// features/Advanced_game/ui/TradeModal/index.tsx
import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import {
  ModalOverlay,
  ModalContainer,
  ModalTitle,
  ModalContent,
  PriceList,
  PriceItem,
  TradeSection,
  CurrentPrice,
  PriceLabel,
  PriceValue,
  PriceArrow,
//   TradeInput,
  QuantityControl,
  QuantityButton,
  QuantityInput,
  TradeButtons,
  BuyButton,
  SellButton,
  CloseButton
} from './styled';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockName: string;
  currentPrice: number;
  priceHistory: Array<{
    price: number;
    change: number;
    volume: number;
  }>;
}

export const TradeModal: React.FC<TradeModalProps> = ({
  isOpen,
  onClose,
  stockName,
  currentPrice,
  priceHistory
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalTitle>거래하기</ModalTitle>
        <ModalContent>
          <PriceList>
            {priceHistory.map((item, index) => (
              <PriceItem key={index} $isPositive={item.change >= 0}>
                <span>{item.price.toLocaleString()}</span>
                <span>{Math.abs(item.change).toFixed(2)}%</span>
                <span>{item.volume.toLocaleString()}</span>
              </PriceItem>
            ))}
          </PriceList>

          <TradeSection>
            <CurrentPrice>
              <PriceLabel>구매할 주식</PriceLabel>
              <PriceValue>{stockName}</PriceValue>
              <PriceArrow>↓</PriceArrow>
            </CurrentPrice>

            <QuantityControl>
              <PriceLabel>포인트</PriceLabel>
              <div>
                <span>개수</span>
                <QuantityButton onClick={() => handleQuantityChange(-1)}>
                  <Minus size={16} />
                </QuantityButton>
                <QuantityInput value={quantity} readOnly />
                <QuantityButton onClick={() => handleQuantityChange(1)}>
                  <Plus size={16} />
                </QuantityButton>
              </div>
            </QuantityControl>

            <TradeButtons>
              <BuyButton>매수하기</BuyButton>
              <SellButton>매도하기</SellButton>
            </TradeButtons>
          </TradeSection>
          
          <CloseButton onClick={onClose}>나가기</CloseButton>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};