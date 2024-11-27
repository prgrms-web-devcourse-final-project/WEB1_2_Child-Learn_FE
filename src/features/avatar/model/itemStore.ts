import { create } from "zustand";
import { MarketItem } from "../types/marketItemTypes";
import { ItemCategory } from "../types/itemCategoryTypes";

 // 초기 데이터 정의
 const initialItems: MarketItem[] = [
  {
    prd_id: 1,
    prd_name: "미래 도시",
    prd_type: "background",
    prd_image: "/img/future-city.png",
    prd_price: 10,
    prd_description: "미래 도시 배경",
    cate_id: 1,
    purchased: false,
  },
  {
    prd_id: 2,
    prd_name: "수중 세계",
    prd_type: "background",
    prd_image: "/img/underwater.png",
    prd_price: 12,
    prd_description: "수중 세계 배경",
    cate_id: 1,
    purchased: false,
  },
  {
    prd_id: 3,
    prd_name: "우주",
    prd_type: "background",
    prd_image: "/img/space.png",
    prd_price: 15,
    prd_description: "우주 배경",
    cate_id: 1,
    purchased: false,
  },
  {
    prd_id: 4,
    prd_name: "스위트 공장",
    prd_type: "background",
    prd_image: "/img/sweet-factory.png",
    prd_price: 20,
    prd_description: "스위트 공장 배경",
    cate_id: 1,
    purchased: false,
  },
  {
    prd_id: 5,
    prd_name: "유령 성",
    prd_type: "background",
    prd_image: "/img/spooky-castle.png",
    prd_price: 18,
    prd_description: "유령 성 배경",
    cate_id: 1,
    purchased: false,
  },
  {
    prd_id: 6,
    prd_name: "불꽃",
    prd_type: "pet",
    prd_image: "/img/fire.png",
    prd_price: 10,
    prd_description: "불꽃 펫",
    cate_id: 2,
    purchased: false,
  },
  {
    prd_id: 7,
    prd_name: "물방울",
    prd_type: "pet",
    prd_image: "/img/water.png",
    prd_price: 12,
    prd_description: "물방울 펫",
    cate_id: 2,
    purchased: false,
  },
  {
    prd_id: 8,
    prd_name: "별똥별",
    prd_type: "pet",
    prd_image: "/img/starlight.png",
    prd_price: 15,
    prd_description: "별똥별 펫",
    cate_id: 2,
    purchased: false,
  },
  {
    prd_id: 9,
    prd_name: "식물",
    prd_type: "pet",
    prd_image: "/img/plant.png",
    prd_price: 20,
    prd_description: "식물 펫",
    cate_id: 2,
    purchased: false,
  },
  {
    prd_id: 10,
    prd_name: "구름",
    prd_type: "pet",
    prd_image: "/img/cloud.png",
    prd_price: 18,
    prd_description: "구름 펫",
    cate_id: 2,
    purchased: false,
  },
  {
    prd_id: 11,
    prd_name: "마법사 모자",
    prd_type: "hat",
    prd_image: "/img/wizard.png",
    prd_price: 10,
    prd_description: "마법사 모자",
    cate_id: 3,
    purchased: false,
  },
  {
    prd_id: 12,
    prd_name: "신사 모자",
    prd_type: "hat",
    prd_image: "/img/gentleman.png",
    prd_price: 12,
    prd_description: "신사 모자",
    cate_id: 3,
    purchased: false,
  },
  {
    prd_id: 13,
    prd_name: "밀짚모자",
    prd_type: "hat",
    prd_image: "/img/farmer.png",
    prd_price: 15,
    prd_description: "밀짚모자",
    cate_id: 3,
    purchased: false,
  },
  {
    prd_id: 14,
    prd_name: "야구 모자",
    prd_type: "hat",
    prd_image: "/img/baseball.png",
    prd_price: 20,
    prd_description: "야구 모자",
    cate_id: 3,
    purchased: false,
  },
  {
    prd_id: 15,
    prd_name: "왕관",
    prd_type: "hat",
    prd_image: "/img/tiara.png",
    prd_price: 18,
    prd_description: "왕관",
    cate_id: 3,
    purchased: false,
  },
];

interface ItemStore {
  marketItems: MarketItem[];
  itemCategories: ItemCategory[];
  setMarketItems: (items: MarketItem[] | ((prevMarketItems: MarketItem[]) => MarketItem[])) => void;
  setItemCategories: (categories: ItemCategory[]) => void;
  updateMarketItems: (id: number, purchased: boolean) => void; // 특정 아이템 상태 업데이트
}

export const useItemStore = create<ItemStore>((set) => ({
  marketItems: initialItems,
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