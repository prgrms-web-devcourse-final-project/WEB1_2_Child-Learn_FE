// lib/useArticle.ts
import { useState, useEffect } from 'react';
import { Article, ArticleType } from '../types/articleTypes';
import { baseApi } from '@/shared/api/base';

export const useArticle = (type: ArticleType) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        // URL 확인 및 Authorization 헤더 추가
        const response = await baseApi.get(`/api/v1/adv/aricles/${type}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // token이 localStorage에 저장되어 있다고 가정
          }
        });
        console.log('API Response:', response); // 응답 확인용
        setArticles(response.data);
      } catch (err) {
        console.error('Error fetching articles:', err); // 에러 로깅
        setError('기사를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [type]);

  return { articles, loading, error };
};