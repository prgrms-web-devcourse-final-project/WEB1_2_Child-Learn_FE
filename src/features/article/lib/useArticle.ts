// useArticle.ts
import { useState, useEffect } from 'react';
import { ArticleType, Article } from '../types/articleTypes';
import { baseApi } from '@/shared/api/base';

export function useArticle(type: ArticleType) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await baseApi.get(`/articles/${type}`);
        setArticles(response.data);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('기사를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [type]);

  return { articles, loading, error } as { articles: Article[], loading: boolean, error: string | null };
}

