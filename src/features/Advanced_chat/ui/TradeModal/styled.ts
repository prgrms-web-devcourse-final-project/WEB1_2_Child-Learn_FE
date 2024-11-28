import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
`;

export const ModalTitle = styled.div`
  padding: 16px;
  border-bottom: 1px solid #eee;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
`;

export const ModalContent = styled.div`
  padding: 16px;
`;

export const PriceList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 8px;
`;

export const PriceItem = styled.div<{ $isPositive: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 8px;
  color: ${props => props.$isPositive ? '#D75442' : '#1B63AB'};
  font-size: 14px;
`;

export const TradeSection = styled.div`
  margin-top: 20px;
`;

export const CurrentPrice = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

export const PriceLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

export const PriceValue = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

export const PriceArrow = styled.div`
  color: #50B498;
  font-size: 20px;
  margin: 8px 0;
`;

export const QuantityControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
  
  > div {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

export const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;

export const QuantityInput = styled.input`
  width: 60px;
  height: 32px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
`;

export const TradeButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 12px;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
`;

export const BuyButton = styled(Button)`
  background: #1B63AB;
  &:hover { background: #145293; }
`;

export const SellButton = styled(Button)`
  background: #D75442;
  &:hover { background: #C04937; }
`;

export const CloseButton = styled(Button)`
  background: #666;
  width: 100%;
  margin-top: 12px;
  &:hover { background: #555; }
`;