export type ArticleType = 'MID' | 'ADVANCED';

export interface ApiArticle {
  articleId: number;
  stockSymbol: string;
  trendPrediction: string;
  content: string;
  createdAt: string;
  duration: number;
}

export enum TrendPrediction {
  UP = 'UP',
  DOWN = 'DOWN',
  STABLE = 'STABLE'
}

export enum Relevance {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export interface Article {
  article_id: number;
  stock_symbol: string;
  trend_prediction: string;
  content: string;
  created_at: string;
  duration: number;
  title: string;
  mid_stock_id: number;
}

export interface ApiArticle {
  articleId: number;
  stockSymbol: string;
  trendPrediction: string;
  content: string;
  createdAt: string;
  duration: number;
  stock_Id?: number;  // 추가
  title: string;      // 추가
}