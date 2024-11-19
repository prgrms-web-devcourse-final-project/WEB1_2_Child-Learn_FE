import React from 'react';
import styled from 'styled-components';
import ArticleComponent from '../article';
import { TrendPrediction, Relevance } from '../type/article';

//style.css
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

const ArticlePage: React.FC = () => {
  const sampleArticle = {
    id: 1,
    article_id: 1001,
    stock_symbol: "삼성전자",
    trend_prediction: TrendPrediction.DOWN,
    content: `11일 오후 1시 50분 현재 삼성전자는 전일 대비 1900원(3.33%) 하락한 5만9500원에 거래되고 있다. 같은 시각 SK하이닉스는 전일 대비 670원(3.34%) 하락한 1만9800원에 거래되고 있다..그래서 지금 이걸 연습중이고 어떻게 니올지
    정말 궁금하다 뉴스기사를 가지고 오는걸 내가 아티클을 전부 다 할 필요가 없으니,
    정말 궁금하다 뉴스기사를 가지고 오는걸 내가 아티클을 전부 다 할 필요가 없으니,
    정말 궁금하다 뉴스기사를 가지고 오는걸 내가 아티클을 전부 다 할 필요가 없으니,`,
    relevance: Relevance.HIGH,
    created_at: "2024-03-19T13:50:00",
    duration: 60,
    mid_stock_id: 1,
    adv_id: 1
  };

  return (
    <PageContainer>
      <DateDisplay>2024.11.11</DateDisplay>
      <ArticleComponent article={sampleArticle} />
    </PageContainer>
  );
};

export default ArticlePage;