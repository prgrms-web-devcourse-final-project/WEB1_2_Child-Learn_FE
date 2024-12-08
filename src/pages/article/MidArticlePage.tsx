import styled from 'styled-components';
import { useArticle } from '@/features/article/lib/useArticle';
import { TrendPrediction, Relevance } from '@/features/article/types/articleTypes';

interface Article {
  article_id: number;
  stock_symbol: string;
  trend_prediction: TrendPrediction;
  content: string;
  relevance: Relevance;
  created_at: string;
  duration: number;
  title: string;
  summary: string;
  mid_stock_id: number;
  adv_id: number;
}

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