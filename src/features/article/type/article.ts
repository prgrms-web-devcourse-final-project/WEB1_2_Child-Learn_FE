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
    id: number;
    article_id: number;
    stock_symbol: string;
    trend_prediction: TrendPrediction;
    content: string;
    relevance: Relevance;
    created_at: string;
    duration: number;
    mid_stock_id: number;
    adv_id: number;
  }