import { create } from "zustand";
import { MarketItem } from "../types/marketItemTypes";
import { ItemCategory } from "../types/itemCategoryTypes";
import { avatarApi } from "@/shared/api/avatar"; // API 가져오기

function isValidCategory(category: string): category is ItemCategory {
  return ["BACKGROUND", "PET", "HAT"].includes(category);
}

interface ItemStore {
  marketItems: MarketItem[]; // 아이템 목록
  setMarketItems: (items: MarketItem[] | ((prevItems: MarketItem[]) => MarketItem[])) => void;
  updateMarketItem: (id: number, purchased: boolean) => void; // 특정 아이템 상태 업데이트
  fetchMarketItems: () => Promise<void>; // API에서 아이템 목록 가져오기
}

export const useItemStore = create<ItemStore>((set) => ({
  marketItems: [],
  setMarketItems: (items) =>
    set((state) => {
      const updatedItems =
        typeof items === "function"
          ? items(state.marketItems)
          : items;
      return { marketItems: updatedItems };
    }),
  updateMarketItem: (id, purchased) =>
    set((state) => ({
      marketItems: state.marketItems.map((item) =>
        item.id === id ? { ...item, purchased } : item
      ),
    })),
    fetchMarketItems: async () => {
      try {
        const items = await avatarApi.getAllItems(); // getAllItems 호출
        // 데이터를 MarketItem 타입으로 변환
        const marketItems: MarketItem[] = items.map((item) => {
          if (!isValidCategory(item.category)) {
            throw new Error(`Invalid category: ${item.category}`);
          }
          return {
            id: item.id,
            name: item.name,
            price: item.price,
            category: item.category, // 이미 검증되었으므로 안전
            imageUrl: item.imageUrl,
            description: item.description,
            purchased: item.isPurchased,
            equipped: item.isEquipped
          };
        });
        set({ marketItems });
      } catch (error) {
        console.error("Failed to fetch market items:", error);
      }
    },
  }));
