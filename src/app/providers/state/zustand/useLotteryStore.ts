import { create } from 'zustand';

interface LotteryState {
  lotteries: Array<{ roundNumber: number; drawDate: Date; winningNumbers: Array<number>; status: string }>;
  purchaseHistory: Array<{ selectedNumbers: Array<number>; pointsSpent: number; prizeStatus: string }>;
  lastPlayedDate: Date | null;
  setLotteries: (lotteries: Array<{ roundNumber: number; drawDate: Date; winningNumbers: Array<number>; status: string }>) => void;
  addPurchase: (purchase: { selectedNumbers: Array<number>; pointsSpent: number; prizeStatus: string }) => void;
  setLastPlayedDate: (date: Date) => void; // 마지막 플레이 날짜 설정
  isPlayable: () => boolean; // 게임 플레이 가능 여부
}

export const useLotteryStore = create<LotteryState>((set, get) => ({
  lotteries: [],
  purchaseHistory: [],
  lastPlayedDate: null,

  setLotteries: (lotteries) => set({ lotteries }),
  addPurchase: (purchase) => set((state) => ({ purchaseHistory: [...state.purchaseHistory, purchase] })),
  setLastPlayedDate: (date) => set({ lastPlayedDate: date }),

  isPlayable: () => {
    const lastPlayedDate = get().lastPlayedDate;
    if (!lastPlayedDate) return true; // 처음 플레이라면 가능
    const now = new Date();
    const oneWeekLater = new Date(lastPlayedDate);
    oneWeekLater.setDate(oneWeekLater.getDate() + 7);
    return now >= oneWeekLater; // 일주일 후부터 가능
  },
}));
