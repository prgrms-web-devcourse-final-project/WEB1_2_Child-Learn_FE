import React from 'react';
import styled from 'styled-components';
import { useArticle } from '@/features/article/lib/useArticle';
import ArticleCard from '@/features/article/ui/ArticleCard';
import { ArticleType, Article } from '@/features/article/types/articleTypes';

const SectionContainer = styled.div`
  margin-top: 24px;
`;

interface ArticleSectionProps {
  type: ArticleType;
  graphComponent: React.ReactNode;
}

export const ArticleSection: React.FC<ArticleSectionProps> = ({ type, graphComponent }) => {
  const { articles, loading, error } = useArticle(type);

  return (
    <SectionContainer>
      {graphComponent}
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {articles.map(article => (
        <ArticleCard 
          key={article.article_id} 
          article={{
            article_id: article.article_id,
            stock_symbol: article.stock_symbol,
            mid_stock_id: article.mid_stock_id,
            trend_prediction: article.trend_prediction,
            created_at: article.created_at,
            content: article.content,
            duration: article.duration,
            title: article.title
          }} 
        />
      ))}
    </SectionContainer>
  );
};
