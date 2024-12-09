import styled from 'styled-components';
import { ArticleSection } from '@/features/article/ui/ArticleSection';
import { MidArticlePage } from '@/pages/article/MidArticlePage';
import { AdvancedArticlePage } from '@/pages/article/AdvancedArticlePage'; 

const PageContainer = styled.div`
  padding: 20px;
  background-color: #ffffff;
`;

export const TradePage = () => {
  return (
    <PageContainer>
      <ArticleSection 
        type="MID" 
        graphComponent={<MidArticlePage stockId={1} stockName="예시주식" />} 
      />
      <ArticleSection 
        type="ADVANCED" 
        graphComponent={<AdvancedArticlePage stockId={1} stockName="예시주식" />} 
      />
    </PageContainer>
  );
};