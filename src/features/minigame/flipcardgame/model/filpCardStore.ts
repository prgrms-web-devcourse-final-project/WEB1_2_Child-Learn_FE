import { create } from 'zustand';
import type { Card } from '../types/cardTypes';

export interface FlipCardState {
  allCards: Card[]; // 전체 카드 데이터
  setCards: (cards: Card[]) => void; // 전체 카드 설정
  getCardsByDifficulty: (difficulty: 'begin' | 'mid' | 'adv') => Card[]; // 난이도별 카드 가져오기
  lastPlayed: { begin: Date | null; mid: Date | null; adv: Date | null };
  setLastPlayed: (difficulty: 'begin' | 'mid' | 'adv', date: Date) => void;
  isPlayable: (difficulty: 'begin' | 'mid' | 'adv') => boolean; // 플레이 가능 여부
}

export const useFlipCardStore = create<FlipCardState>((set, get) => ({
  allCards: [],
  setCards: (cards) => set(() => ({ allCards: cards })), // 전체 카드 저장
  getCardsByDifficulty: (difficulty) => {
    const allCards = get().allCards;

    // 난이도별 카드 개수 설정
    const difficultyCardCounts = { begin: 4, mid: 6, adv: 8 }; // 고유 카드 개수 (쌍은 두 배)
    const count = difficultyCardCounts[difficulty];

    // 고유 카드를 랜덤하게 선택
    const selectedCards = getRandomUniqueCards(allCards, count);

    // 쌍을 만들고 섞기
    const pairedCards = shuffleArray([...selectedCards, ...selectedCards].map((card, index) => ({
      ...card,
      id: card.id * 100 + index, // 고유 ID 보장
    })));

    return pairedCards;
  },
  lastPlayed: { begin: null, mid: null, adv: null },
  setLastPlayed: (difficulty, date) => set((state) => ({ lastPlayed: { ...state.lastPlayed, [difficulty]: date } })),
  isPlayable: (difficulty) => {
    const lastPlayedDate = get().lastPlayed[difficulty];
    if (!lastPlayedDate) return true;
    const now = new Date();
    return now.toDateString() !== lastPlayedDate.toDateString(); // 같은 날짜인지 확인
  },
}));

// 카드 섞기 함수
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }
  return shuffled;
}

// 고유 카드 랜덤 선택 함수
function getRandomUniqueCards(cards: Card[], count: number): Card[] {
  const uniqueCards: Set<string> = new Set(); // 고유한 카드 필드를 저장
  const selected: Card[] = [];

  while (selected.length < count) {
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    const uniqueKey = `${randomCard.cardCategory}-${randomCard.cardTitle}-${randomCard.cardContent}`;

    // 중복되지 않는 카드를 선택
    if (!uniqueCards.has(uniqueKey)) {
      uniqueCards.add(uniqueKey);
      selected.push(randomCard);
    }
  }

  return selected;
}