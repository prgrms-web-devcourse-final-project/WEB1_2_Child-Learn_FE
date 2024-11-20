import { create } from 'zustand';

interface LotteryState {
  lotteries: Array<{ lotteryId: string; roundNumber: number; drawDate: Date; winningNumbers: Array<number>; status: string }>;
  purchaseHistory: Array<{ selectedNumbers: Array<number>; pointsSpent: number; prizeStatus: string }>;
  setLotteries: (lotteries: Array<{ lotteryId: string; roundNumber: number; drawDate: Date; winningNumbers: Array<number>; status: string }>) => void;
  addPurchase: (purchase: { selectedNumbers: Array<number>; pointsSpent: number; prizeStatus: string }) => void;
}

export const useLotteryStore = create<LotteryState>((set) => ({
  lotteries: [],
  purchaseHistory: [],
  setLotteries: (lotteries) => set({ lotteries }),
  addPurchase: (purchase) => set((state) => ({ purchaseHistory: [...state.purchaseHistory, purchase] })),
}));
