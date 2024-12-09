import styled from 'styled-components';
import { useArticle } from '@/features/article/model/useArticle';

interface AdvancedArticlePageProps {
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

export const AdvancedArticlePage = ({ stockId, stockName }: AdvancedArticlePageProps) => {
  const { articles, loading, error } = useArticle('ADVANCED');

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
