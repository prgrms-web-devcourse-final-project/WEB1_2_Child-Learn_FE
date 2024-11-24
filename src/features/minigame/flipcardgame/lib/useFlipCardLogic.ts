import { useEffect, useState } from 'react';
import { useFlipCardStore } from '../model/filpCardStore';
import type { Card } from '../types/cardTypes';

export const useFlipCardLogic = (level: 'beginner' | 'medium' | 'advanced') => {
  const { getCardsByLevel, setCards } = useFlipCardStore();
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [shuffledCards, setShuffledCards] = useState<Card[]>([]);

  useEffect(() => {
    const mockCards: Card[] = [
      { card_id: '1', card_title: 'A', card_content: '내용 A', category: '경제' },
      { card_id: '2', card_title: 'B', card_content: '내용 B', category: '수학' },
      { card_id: '3', card_title: 'C', card_content: '내용 C', category: '과학' },
      { card_id: '4', card_title: 'D', card_content: '내용 D', category: '역사' },
      { card_id: '5', card_title: 'E', card_content: '내용 E', category: '예술' },
      { card_id: '6', card_title: 'F', card_content: '내용 F', category: '지리' },
      { card_id: '7', card_title: 'G', card_content: '내용 G', category: '문학' },
      { card_id: '8', card_title: 'H', card_content: '내용 H', category: '철학' },
    ];

    setCards(mockCards);
    const cards = getCardsByLevel(level);
    setShuffledCards(cards);
  }, [level, getCardsByLevel, setCards]);

  return {
    flippedCards,
    setFlippedCards,
    matchedCards,
    setMatchedCards,
    shuffledCards,
  };
};
