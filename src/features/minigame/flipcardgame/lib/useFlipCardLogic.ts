import { useEffect, useState } from 'react';
import { useFlipCardStore } from '../model/filpCardStore';
import type { Card } from '../types/cardTypes';

export const useFlipCardLogic = (difficulty: 'begin' | 'mid' | 'adv') => {
  const { getCardsByDifficulty, setCards } = useFlipCardStore();
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [shuffledCards, setShuffledCards] = useState<Card[]>([]);

  useEffect(() => {
    const mockCards: Card[] = [
      { id: '1', cardTitle: 'A', cardContent: '내용 A', cardCategory: '경제' },
      { id: '2', cardTitle: 'B', cardContent: '내용 B', cardCategory: '수학' },
      { id: '3', cardTitle: 'C', cardContent: '내용 C', cardCategory: '과학' },
      { id: '4', cardTitle: 'D', cardContent: '내용 D', cardCategory: '역사' },
      { id: '5', cardTitle: 'E', cardContent: '내용 E', cardCategory: '예술' },
      { id: '6', cardTitle: 'F', cardContent: '내용 F', cardCategory: '지리' },
      { id: '7', cardTitle: 'G', cardContent: '내용 G', cardCategory: '문학' },
      { id: '8', cardTitle: 'H', cardContent: '내용 H', cardCategory: '철학' },
    ];

    setCards(mockCards);
    const cards = getCardsByDifficulty(difficulty);
    setShuffledCards(cards);
  }, [difficulty, getCardsByDifficulty, setCards]);

  return {
    flippedCards,
    setFlippedCards,
    matchedCards,
    setMatchedCards,
    shuffledCards,
  };
};