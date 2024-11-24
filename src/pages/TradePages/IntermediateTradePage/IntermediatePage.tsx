import React from 'react';
import styled from 'styled-components';
import StockSlider from '../../../features/Intermediate_chat/ui/StockSlider';

const PageContainer = styled.div`
  padding: 20px;
  background-color: #ffffff;
  min-height: 100vh;
`;

const IntermediatePage: React.FC = () => {
  return (
    <PageContainer>
      <StockSlider />
    </PageContainer>
  );
};

export default IntermediatePage;