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
  mid_stock_id: number;
}