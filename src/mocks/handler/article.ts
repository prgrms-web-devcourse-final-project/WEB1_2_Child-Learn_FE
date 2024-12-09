// features/article/lib/useArticle.ts
import { useState, useEffect } from 'react';
import { ArticleType } from '@/features/article/types/articleTypes';

// Article 인터페이스 추가
interface Article {
  articleId: number;
  id: number;
  article_id: number;
  stockSymbol: string;
  trendPrediction: string;
  content: string;
  relevance: string;
  createdAt: string;
  duration: number;
  title: string;
  summary: string;
  mid_stock_id: number;
  adv_id: number;
}

// 임시 목데이터
const tempMockData: Record<ArticleType, Article[]> = {
  MID: [
    {
      articleId: 1,
      id: 1,
      article_id: 1,
      stockSymbol: "삼성전자",
      trendPrediction: "DOWN",
      content: `삼성전자와 SK하이닉스 등 반도체 업종이 약세다. 11일 오후 1시 50분 현재 삼성전자는 전일 대비 1900원(3.33%) 하락한 5만9500원에 거래되고 있다. 

시가총액 상위 종목 중에서는 SK하이닉스(-3.34%), 삼성SDI(-2.83%), LG에너지솔루션(-1.95%), 기아(-1.48%) 등이 하락세를 보이고 있다.`,
      relevance: "HIGH",
      createdAt: "2024-03-19T13:50:00",
      duration: 60,
      title: "반도체 투톱인 삼성전자와 SK하이닉스 주가가 3%대 하락하며 동반 약세 반도체 시장 이대로 !!",
      summary: "삼성전자와 SK하이닉스의 주가 하락과 시장 동향",
      mid_stock_id: 1,
      adv_id: 0
    }
  ],
  ADVANCED: []
};

export const useArticle = (type: ArticleType) => {
  const [articles, setArticles] = useState<Article[]>(tempMockData[type]);
  const [loading, setLoading] = useState(false);  // loading을 false로 설정
  const [error, setError] = useState<string | null>(null);

  return { articles, loading, error };
};