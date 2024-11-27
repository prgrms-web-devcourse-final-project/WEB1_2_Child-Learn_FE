import { create } from "zustand";
import { MarketItem } from "../types/marketItemTypes";
import { ItemCategory } from "../types/itemCategoryTypes";

interface ItemStore {
  marketItems: MarketItem[];
  itemCategories: ItemCategory[];
  setMarketItems: (items: MarketItem[] | ((prevMarketItems: MarketItem[]) => MarketItem[])) => void;
  setItemCategories: (categories: ItemCategory[]) => void;
}

export const useItemStore = create<ItemStore>((set) => ({
  marketItems: [],
  itemCategories: [],
  setMarketItems: (items) =>
    set((prevState) => {
      // items가 함수인지 배열인지 확인 후 처리
      const updatedMarketItems =
        typeof items === "function"
          ? items(prevState.marketItems) // 함수형 업데이트
          : items; // 배열 그대로 사용

      return { marketItems: updatedMarketItems };
    }),
  setItemCategories: (categories) => set({ itemCategories: categories }),
}));