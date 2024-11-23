import styled from 'styled-components';
import { Stock } from '../../model/stock';

interface StockCardProps {
  stock: Stock;
}

export const StockCard: React.FC<StockCardProps> = ({ stock }) => {
  return (
    <Card>
      <Title>{stock.name}</Title>
      <Price>{stock.currentPrice.toLocaleString()}원</Price>
      <Change positive={stock.dailyChange > 0}>
        {stock.dailyChange > 0 ? '+' : ''}{stock.dailyChange}%
      </Change>
    </Card>
  );
};