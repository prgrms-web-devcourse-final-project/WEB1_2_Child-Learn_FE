import styled from 'styled-components';
import { useArticle } from '@/features/article/lib/useArticle';
import ArticleCard from '@/features/article/ui/ArticleCard';
import { formatDate } from '@/features/article/utils/dateFormat';
import { TrendPrediction, Relevance } from '@/features/article/types/articleTypes';

const PageContainer = styled.div`
  padding: 20px;
  background-color: #ffffff;
  min-height: 100vh;
`;

const DateDisplay = styled.div`
  text-align: right;
  padding: 8px;
  color: #2e2d2d;
`;

export interface Article {
    articleId: number;
    stockSymbol: string;
    trendPrediction: TrendPrediction;
    content: string;
    relevance: Relevance;
    createdAt: string;
    duration: number;
    title: string;
    midStockId?: number;
    advId?: number;
  }

  export const AdvancedArticlePage = () => {
    const { articles, loading, error } = useArticle('ADVANCED');
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!articles || articles.length === 0) return <div>Error</div>;
  
    return (
      <PageContainer>
        <DateDisplay>{formatDate(new Date())}</DateDisplay>
        {articles.map((article: Article) => (
          <ArticleCard key={article.articleId} article={article} />
        ))}
      </PageContainer>
  );
};

