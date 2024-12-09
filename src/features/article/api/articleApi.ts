import { ArticleType } from '@/features/article/types/articleTypes';
import { baseApi } from '@/shared/api/base';

const USE_MOCK = true; 

const mockArticles: Record<ArticleType, Array<{
  articleId: number;
  stockSymbol: string;
  trendPrediction: string;
  content: string;
  createdAt: string;
  duration: number;
  title: string;
}>> = {
  MID: [], // 초기값으로 빈 배열 설정
  ADVANCED: []
};

export const getArticles = async (type: ArticleType) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // 실제 API 호출 시뮬레이션
    return mockArticles[type];
  }
  
  const response = await baseApi.get(`/articles/${type}`);
  return response.data;
};