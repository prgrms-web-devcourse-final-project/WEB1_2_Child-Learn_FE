// useArticle.ts
import { useState, useEffect } from 'react';
import { ArticleType } from '@/features/article/types/articleTypes';
import { getArticles } from '@/features/article/api/articleApi';

export const useArticle = (type: ArticleType) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticles(type);
        setArticles(data);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('기사를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [type]);

  return { articles, loading, error };
};