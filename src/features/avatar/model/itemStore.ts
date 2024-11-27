import { create } from "zustand";
import { MarketItem } from "../types/marketItemTypes";
import { ItemCategory } from "../types/itemCategoryTypes";

interface ItemStore {
  marketItems: MarketItem[];
  itemCategories: ItemCategory[];
  setMarketItems: (items: MarketItem[] | ((prevMarketItems: MarketItem[]) => MarketItem[])) => void;
  setItemCategories: (categories: ItemCategory[]) => void;
  updateMarketItems: (id: number, purchased: boolean) => void; // 특정 아이템 상태 업데이트
}

export const useItemStore = create<ItemStore>((set) => ({
  marketItems: [],
  itemCategories: [],
  setMarketItems: (items) =>
    set((prevState) => {
      // 기존 데이터와 병합
      const updatedMarketItems =
        typeof items === "function"
          ? items(prevState.marketItems)
          : items.map((item) => {
              const existingItem = prevState.marketItems.find((i) => i.prd_id === item.prd_id);
              return existingItem ? { ...existingItem, ...item } : item;
            });

      return { marketItems: updatedMarketItems };
    }),
  setItemCategories: (categories) => set({ itemCategories: categories }),
  updateMarketItems: (id, purchased) =>
    set((state) => ({
      marketItems: state.marketItems.map((item) =>
        item.prd_id === id ? { ...item, purchased } : item
      ),
    })),
}));
