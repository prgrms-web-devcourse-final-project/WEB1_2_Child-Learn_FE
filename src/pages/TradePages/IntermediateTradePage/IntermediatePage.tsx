// pages/TradePages/IntermediateTradePage/IntermediatePage.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import StockSlider from '@/features/Intermediate_chart/ui/StockSlider';
import { MidStock } from '@/features/Intermediate_chart/model/types/stock';
import { stockApi } from '@/shared/api/stock';


const IntermediatePage: React.FC = () => {
  const [stocks, setStocks] = useState<MidStock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await stockApi.getStockList() as { data: MidStock[] } | MidStock[];
        
        if (Array.isArray(response)) {
          setStocks(response);
        } else if ('data' in response) {
          setStocks(response.data);
        } else {
          console.error('Unexpected response format:', response);
        }
      } catch (error) {
        console.error('Failed to fetch stocks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStocks();
  }, []);

  if (isLoading || stocks.length === 0) {
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

const PageContainer = styled.div`
  padding: 25px;
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

export default IntermediatePage;