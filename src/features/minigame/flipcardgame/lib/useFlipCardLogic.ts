import { useEffect, useState } from 'react';
import { flipCardApi } from '@/shared/api/minigames';
import type { Card } from '../types/cardTypes';

export const useFlipCardLogic = (difficulty: 'begin' | 'mid' | 'adv') => {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [shuffledCards, setShuffledCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState<string | null>(null); // 에러 상태 추가

  useEffect(() => {
    console.log('useEffect triggered with difficulty:', difficulty);
  if (!difficulty) {
    console.warn('Difficulty is undefined or null.');
    return;
  }

    const fetchCards = async () => {
      console.log('Fetching cards for difficulty:', difficulty);
      try {
        setLoading(true);
        setError(null);
        const cards = await flipCardApi.getCardList(difficulty);
        console.log('API Response:', cards);
        // 카드 쌍 생성 및 섞기
        const pairedCards = shuffleArray([...cards, ...cards].map((card, index) => ({
          ...card,
          card_id: card.id * 100 + index, // 고유 ID 보장
        })));
        setShuffledCards(pairedCards);
      } catch (err) {
        setError('Failed to fetch cards. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [difficulty]);

  return {
    flippedCards,
    setFlippedCards,
    matchedCards,
    setMatchedCards,
    shuffledCards,
    loading,
    error,
  };
};

// 배열을 섞는 유틸리티 함수
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }
  return shuffled;
}