// articleApi.ts
import { ArticleType } from '@/features/article/types/articleTypes';
import { baseApi } from '@/shared/api/base';

const USE_MOCK = false; // mock 데이터 사용 여부

const mockArticles: Record<ArticleType, Array<{
  articleId: number;
  stockSymbol: string;
  trendPrediction: string;
  content: string;
  createdAt: string;
  duration: number;
  title: string;
}>> = {
  MID: [], 
  ADVANCED: []
};

export const getArticles = async (type: ArticleType) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockArticles[type];
  }
  
  // URL 경로 수정
  const response = await baseApi.get(`/articles/${type}`);
  return response.data;
};