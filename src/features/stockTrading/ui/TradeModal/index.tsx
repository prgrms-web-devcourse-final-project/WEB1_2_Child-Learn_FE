import React from 'react';
import { Modal, Overlay, ModalTitle, TradeForm } from './styles';
import { useTrading } from '../../hooks/useTrading';
import { Button } from '@/shared/ui/Intermediate_Button/Intermediate_Button';
import { Input } from '@/shared/ui/chat_Input/Input';
import styled from 'styled-components';
import type { TradeModalProps as ExternalTradeModalProps } from '../../model/types';

const Label = styled.label`
  font-weight: 500;
  margin-bottom: 8px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

const QuantityControl = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

interface Stock {
  name: string;
  currentPrice: number;
}

export const TradeModal: React.FC<ExternalTradeModalProps> = ({ 
  type, 
  stockData, 
  onClose, 
  onConfirm 
}) => {
  const { 
    quantity, 
    points, 
    handleQuantityChange 
  } = useTrading(stockData.currentPrice);

  return (
    <>
      <Overlay onClick={onClose} />
      <Modal>
        <ModalTitle>{type === 'buy' ? '매수하기' : '매도하기'}</ModalTitle>
        <TradeForm>
          <FormGroup>
            <Label>{stockData.name}</Label>
            <Input value={stockData.currentPrice.toLocaleString()} readOnly />
          </FormGroup>
          <FormGroup>
            <Label>구매 포인트</Label>
            <Input value={points.toLocaleString()} readOnly />
          </FormGroup>
          <QuantityControl>
            <Button onClick={() => handleQuantityChange(-1)}>-</Button>
            <Input value={quantity} readOnly />
            <Button onClick={() => handleQuantityChange(1)}>+</Button>
          </QuantityControl>
        </TradeForm>
        <ButtonGroup>
          <Button onClick={onClose}>나가기</Button>
          <Button 
            variant="primary"
            onClick={() => onConfirm(quantity, points)}
          >
            {type === 'buy' ? '매수하기' : '매도하기'}
          </Button>
        </ButtonGroup>
      </Modal>
    </>
  );
};
