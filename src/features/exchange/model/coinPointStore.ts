import { create } from 'zustand';
import { Coin } from '../types/coinTypes';
import { Point } from '../types/pointTypes';
import { ExchangeDetails } from '../types/exchangeDetailsTypes';

// Store 정의
interface CoinPointStore {
  coin: Coin; // 코인 정보
  point: Point; // 포인트 정보
  exchangeHistory: ExchangeDetails[]; // 환전 내역
  setCoin: (coin: Coin) => void; // 코인 정보 업데이트
  setPoint: (point: Point) => void; // 포인트 정보 업데이트
  addExchangeDetail: (detail: ExchangeDetails) => void; // 환전 기록 추가
  resetStore: () => void; // 전체 상태 초기화
}

export const useCoinPointStore = create<CoinPointStore>((set) => ({
  // 초기 코인 데이터
  coin: {
    coinId: 1,
    currentCoins: 0,
    updatedAt: new Date().toISOString(),
    memberId: 1,
  },

  // 초기 포인트 데이터
  point: {
    pointId: 1,
    currentPoints: 0,
    updatedAt: new Date().toISOString(),
    memberId: 1,
  },

  // 초기 환전 내역 데이터
  exchangeHistory: [],

  // 코인 정보 설정
  setCoin: (coin) =>
    set(() => ({
      coin,
    })),

  // 포인트 정보 설정
  setPoint: (point) =>
    set(() => ({
      point,
    })),

  // 환전 기록 추가
  addExchangeDetail: (detail) =>
    set((state) => ({
      exchangeHistory: [...state.exchangeHistory, detail],
    })),

  // 전체 상태 초기화
  resetStore: () =>
    set(() => ({
      coin: {
        coinId: 1,
        currentCoins: 0,
        updatedAt: new Date().toISOString(),
        memberId: 1,
      },
      point: {
        pointId: 1,
        currentPoints: 0,
        updatedAt: new Date().toISOString(),
        memberId: 1,
      },
      exchangeHistory: [],
    })),
}));
