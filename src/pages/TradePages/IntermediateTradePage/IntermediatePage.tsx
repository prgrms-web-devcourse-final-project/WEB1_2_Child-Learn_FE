// pages/TradePages/IntermediateTradePage/IntermediatePage.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import StockSlider from '../../../features/Intermediate_chat/ui/StockSlider';
import { MidStock } from '../../../features/Intermediate_chat/types/stock';
import { stockApi } from '@/shared/api/stock';

const PageContainer = styled.div`
  padding: 20px;
  background-color: #ffffff;
  min-height: 100vh;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: #666;
`;

const IntermediatePage: React.FC = () => {
  const [stocks, setStocks] = useState<MidStock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await stockApi.getStockList();
        setStocks(response.data);
      } catch (error) {
        console.error('Failed to fetch stocks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStocks();
  }, []);

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingContainer>
          Loading stocks...
        </LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <StockSlider stocks={stocks} />
    </PageContainer>
  );
};

export default IntermediatePage;