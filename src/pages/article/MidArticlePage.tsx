import styled from 'styled-components';
import { useArticle } from '@/features/article/lib/useArticle';
import { TrendPrediction, Relevance, Article } from '@/features/article/types/articleTypes';

interface MidArticlePageProps {
  stockId?: number;
  stockName?: string;
}
// MidArticlePage.tsx
export const MidArticlePage: React.FC<MidArticlePageProps> = ({ stockId, stockName }) => {
  const { articles, loading, error } = useArticle('MID');

 
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const filteredArticles = stockId 
    ? articles.filter((article: Article) => article.mid_stock_id === stockId)
    : articles;

    const PageContainer = styled.div`
    padding: 20px;
  `;

  const StockTitle = styled.h2`
    font-size: 20px;
    font-weight: bold;
    margin: 0 0 20px;
    color: #000000;
  `;

  const Content = styled.div`
    font-size: 16px;
    line-height: 1.8;
    color: #333;
  `;


  return (
    <PageContainer>
      <StockTitle>{stockName}</StockTitle>
      {filteredArticles.map((article: Article) => (
        <Content key={article.article_id}>
          {article.content}
        </Content>
      ))}
    </PageContainer>
  );
};