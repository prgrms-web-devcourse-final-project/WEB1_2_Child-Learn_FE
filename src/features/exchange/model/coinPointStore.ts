import { create } from 'zustand';
import { Coin } from '../types/coinTypes'; 
import { Point } from '../types/pointTypes';
import { ExchangeDetails } from '../types/exchangeDetailsTypes';

// Store 정의
interface CoinPointStore {
  coin: Coin | null; // 코인 정보
  point: Point | null; // 포인트 정보
  exchangeHistory: ExchangeDetails[]; // 환전 내역
  setCoin: (coin: Coin) => void; // 코인 정보 업데이트
  setPoint: (point: Point) => void; // 포인트 정보 업데이트
  addExchangeDetail: (detail: ExchangeDetails) => void; // 환전 기록 추가
  resetStore: () => void; // 전체 상태 초기화
}

export const useCoinPointStore = create<CoinPointStore>((set) => ({
  coin: null,
  point: null,
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
      coin: null,
      point: null,
      exchangeHistory: [],
    })),
}));
