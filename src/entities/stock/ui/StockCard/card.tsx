// StockCard 컴포넌트 정의
import styled from 'styled-components';
import { Stock } from '../../model/stock';

interface StockCardProps {
  stock: Stock;
}

const Card = styled.div`
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.1rem;
`;

const Price = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
`;

const Change = styled.div<{ positive: boolean }>`
  color: ${props => props.positive ? '#2ecc71' : '#e74c3c'};
`;

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