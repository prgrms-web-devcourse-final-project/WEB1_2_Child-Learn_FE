export interface Stock {
  id: string;
  name: string;
  price: number;
 
}

export type TradeType = 'buy' | 'sell';

export interface TradeModalProps {
  type: TradeType;
  stockData: Stock;
  onClose: () => void;
  onConfirm: (quantity: number, points: number) => void;
}