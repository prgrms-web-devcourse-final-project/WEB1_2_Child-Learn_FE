import { useState, useEffect } from 'react';
import { ArticleType, ApiArticle } from '../types/articleTypes';
import { getArticles } from '../api/articleApi';

export const useArticle = (type: ArticleType) => {
  const [articles, setArticles] = useState<ApiArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
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