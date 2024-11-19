import React from 'react';
import styled from 'styled-components';
import imagex from '../../../public/img/imagex.jpg';
import { Article, TrendPrediction, Relevance } from '../article/type/article';

//style.css
const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Header = styled.div`
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid #000000;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #000000;
  font-weight: bold;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #666;
  margin: 4px 0 0 0;
  font-size: 14px;
`;

const MainImage = styled.img`
  width: 100%;
  height: 300px;
  color: #000000;
  object-fit: cover;
`;

const ContentTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin: 20px;
  color: #000000;
  line-height: 1.4;
`;

const ContentSection = styled.div`
  padding: 20px;
`;

const Content = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  margin: 0 0 20px 0;
`;

const MetaInfo = styled.div`
  padding: 16px 20px;
  background: #fafafa;
  border-top: 1px solid #454545;
  font-size: 14px;
  color: #666;
  display: flex;
  gap: 20px;
`;

const ArticleComponent: React.FC<{ article: Article }> = ({ article }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 오후 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <Container>
      <Header>
        <Title>Child-Learn News</Title>
        <Subtitle>오늘의 뉴스</Subtitle>
      </Header>

      <MainImage src={imagex} alt="연습용 이미지" />
      
      <ContentSection>
        <ContentTitle>
          반도체 투톱인 삼성전자와 SK하이닉스 주가가 3%대 하락하며 동반 약세 반도체 시장 이대로 !!
        </ContentTitle>

        <Content>
          {article.content}
        </Content>
      </ContentSection>

      <MetaInfo>
        <span>작성일: {formatDate(article.created_at)}</span>
        <span>지속시간: {article.duration}분</span>
        <span>Article ID: {article.article_id}</span>
      </MetaInfo>
    </Container>
  );
};

export default ArticleComponent;