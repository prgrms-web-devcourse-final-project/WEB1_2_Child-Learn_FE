import { create } from "zustand";
import { MarketItem } from "../types/marketItemTypes";
import { ItemCategory } from "../types/itemCategoryTypes";

interface ItemStore {
  marketItems: MarketItem[];
  itemCategories: ItemCategory[];
  setMarketItems: (items: MarketItem[]) => void;
  setItemCategories: (categories: ItemCategory[]) => void;
}

export const useItemStore = create<ItemStore>((set) => ({
  marketItems: [],
  itemCategories: [],
  setMarketItems: (items) => set({ marketItems: items }),
  setItemCategories: (categories) => set({ itemCategories: categories }),
}));
