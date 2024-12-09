import React from 'react';
import styled from 'styled-components';
import { useArticle } from '@/features/article/model/useArticle';

interface MidArticlePageProps {
  stockId: number;
  stockName: string;
}

const ArticleContent = styled.div`
  padding: 20px;
`;

const Content = styled.div`
  font-size: 14px;
  line-height: 1.8;
  color: #333;
`;

export const MidArticlePage: React.FC<MidArticlePageProps> = ({ stockId, stockName }) => {
  const { articles, loading, error } = useArticle('MID');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const filteredArticles = stockId 
    ? articles.filter(article => article.stockSymbol === stockName)
    : articles;

  return (
    <ArticleContent>
      {filteredArticles.map((article) => (
        <Content key={article.articleId}>
          <p>{article.content}</p>
        </Content>
      ))}
    </ArticleContent>
  );
};