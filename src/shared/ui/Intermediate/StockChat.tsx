// shared/ui/StockChart/index.tsx
import React from 'react';
import { StockPrice } from '@/features/Intermediate_chat/types/stock';
import styled from 'styled-components';

const ChartWrapper = styled.div`
  width: 100%;
  height: 400px;
  background: white;
  border-radius: 8px;
  padding: 16px;
`;

interface StockChartProps {
  stockId: number;
  title: string;
  data?: StockPrice[];
}

export const StockChart: React.FC<StockChartProps> = ({ stockId, title, data = [] }) => {
  return (
    <ChartWrapper>
      <h3>{title}</h3>
      {/* 차트 구현 */}
      {/* 예: Recharts, ApexCharts 등을 사용하여 차트 구현 */}
        
    </ChartWrapper>
  );
};

export default StockChart;