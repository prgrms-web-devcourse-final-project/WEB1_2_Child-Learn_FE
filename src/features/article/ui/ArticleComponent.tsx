
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
        graphComponent={<MidArticlePage/>} 
      />
      <ArticleSection 
        type="ADVANCED" 
        graphComponent={<AdvancedArticlePage/>} 
      />
    </PageContainer>
  );
};