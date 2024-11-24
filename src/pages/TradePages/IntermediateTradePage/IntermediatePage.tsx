import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import StockSlider from '../../../features/Intermediate_chat/ui/StockSlider';
import { StockSlideData } from '../../../features/Intermediate_chat/types/stock';

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
  color: #fefefe;
`;

const IntermediatePage: React.FC = () => {
  const [stocks, setStocks] = useState<StockSlideData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        // API 호출이나 데이터 fetching 로직
        const data: StockSlideData[] = [
          {
            id: 1,
            name: "삼성전자",
            basePrice: 1168000,
            description: "대한민국 대표 IT 기업"
          },
          {
            id: 2,
            name: "현대자동차",
            basePrice: 12000,
            description: "대한민국 대표 자동차 기업"
          },
          {
            id: 3,
            name: "카카오",
            basePrice: 2500000,
            description: "대한민국 대표 IT 기업"
          }
        ];
        
        setStocks(data);
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