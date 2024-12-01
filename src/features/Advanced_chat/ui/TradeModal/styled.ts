// features/Advanced_game/ui/TradeModal/styled.ts
import styled from 'styled-components';

export const ModalOverlay = styled.div`
 position: fixed;
 top: 0;
 left: 0;
 right: 0;
 bottom: 0;
 background: rgba(0, 0, 0, 0.3);
 z-index: 100;
 display: flex;
 justify-content: center;
 align-items: center;
`;

export const ModalContainer = styled.div`
 background: white;
 width: 90%;
 max-width: 400px;
 border-radius: 12px;
 overflow: hidden;
`;

export const ModalTitle = styled.div`
 padding: 16px;
 text-align: center;
 font-size: 18px;
 font-weight: bold;
 border-bottom: 1px solid #eee;
`;

export const ModalContent = styled.div`
 padding: 20px;
`;

export const PriceListContainer = styled.div`
 height: 350px;
 background: #f8f9fa;
 border-radius: 8px;
 padding: 8px;
 margin-bottom: 20px;

 // ApexCharts 스타일 오버라이드
 .apexcharts-xaxis-label {
   fill: #666;
   font-size: 12px;
 }

 .apexcharts-bar-area {
   opacity: 0.8;
 }
`;

export const StockInfoSection = styled.div`
 margin: 20px 0;
 text-align: center;
`;

export const StockLabel = styled.div`
 font-size: 14px;
 color: #666;
 margin-bottom: 8px;
`;

export const StockPrice = styled.div`
 font-size: 24px;
 font-weight: bold;
 color: #333;
`;

export const PriceArrow = styled.div`
 color: #50B498;
 font-size: 20px;
 margin: 8px 0;
`;

export const QuantitySection = styled.div`
 margin: 20px 0;
`;

export const PointsLabel = styled.div`
 font-size: 14px;
 color: #666;
 margin-bottom: 8px;
`;

export const QuantityControl = styled.div`
 display: flex;
 align-items: center;
 gap: 8px;

 label {
   font-size: 14px;
   color: #666;
 }
`;

export const QuantityButton = styled.button`
 width: 28px;
 height: 28px;
 border: 1px solid #eee;
 border-radius: 4px;
 background: white;
 display: flex;
 align-items: center;
 justify-content: center;
 cursor: pointer;

 img {
   width: 12px;
   height: 12px;
 }

 &:hover {
   background: #f5f5f5;
 }
`;

export const QuantityInput = styled.input`
 width: 50px;
 height: 28px;
 border: 1px solid #eee;
 border-radius: 4px;
 text-align: center;
 font-size: 14px;
`;

export const TradeButtonGroup = styled.div`
 display: grid;
 grid-template-columns: 1fr 1fr;
 gap: 10px;
 margin: 20px 0;
`;

export const Button = styled.button`
 height: 40px;
 border: none;
 border-radius: 6px;
 font-weight: 500;
 cursor: pointer;
 font-size: 14px;
`;

export const BuyButton = styled(Button)`
 background: #1B63AB;
 color: white;
 &:hover {
   background: #145293;
 }
`;

export const SellButton = styled(Button)`
 background: #D75442;
 color: white;
 &:hover {
   background: #C04937;
 }
`;

export const CloseButton = styled(Button)`
 width: 100%;
 background: #666;
 color: white;
 &:hover {
   background: #555;
 }
`;