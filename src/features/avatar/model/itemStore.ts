import { create } from "zustand";
import { MarketItem } from "../types/marketItemTypes";
import { ItemCategory } from "../types/itemCategoryTypes";

interface ItemStore {
  marketItems: MarketItem[];
  itemCategories: ItemCategory[];
  setMarketItems: (items: MarketItem[] | ((prevMarketItems: MarketItem[]) => MarketItem[])) => void;
  setItemCategories: (categories: ItemCategory[]) => void;
  loadMarketItems: () => void;
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
  loadMarketItems: () => {
    const savedMarketItems = localStorage.getItem("marketItems");
    if (savedMarketItems) {
      // 로컬 저장소에 저장된 데이터를 가져와 상태에 설정
      set({ marketItems: JSON.parse(savedMarketItems) });
    } else {
      // 기본값 설정
      set({
        marketItems: [
          {
            prd_id: 1,
            prd_name: "미래 도시",
            prd_type: "background",
            prd_image: "/img/future-city.png",
            prd_price: 100,
            prd_description: "미래 도시 배경",
            cate_id: 1,
            purchased: true, // 구매 여부를 바로 설정
          },
          {
            prd_id: 2,
            prd_name: "수중 세계",
            prd_type: "background",
            prd_image: "/img/underwater.png",
            prd_price: 120,
            prd_description: "수중 세계 배경",
            cate_id: 1,
            purchased: false, // 구매하지 않은 상태
          },
          {
            prd_id: 3,
            prd_name: "우주",
            prd_type: "background",
            prd_image: "/img/space.png",
            prd_price: 150,
            prd_description: "우주 배경",
            cate_id: 1,
            purchased: false,
          },
          {
            prd_id: 4,
            prd_name: "스위트 공장",
            prd_type: "background",
            prd_image: "/img/sweet-factory.png",
            prd_price: 200,
            prd_description: "스위트 공장 배경",
            cate_id: 1,
            purchased: false,
          },
          {
            prd_id: 5,
            prd_name: "유령 성",
            prd_type: "background",
            prd_image: "/img/spooky-castle.png",
            prd_price: 180,
            prd_description: "유령 성 배경",
            cate_id: 1,
            purchased: true,
          },
          {
            prd_id: 6,
            prd_name: "불꽃",
            prd_type: "pet",
            prd_image: "/img/fire.png",
            prd_price: 100,
            prd_description: "불꽃 펫",
            cate_id: 2,
            purchased: true, // 구매 여부를 바로 설정
          },
          {
            prd_id: 7,
            prd_name: "물방울",
            prd_type: "pet",
            prd_image: "/img/water.png",
            prd_price: 120,
            prd_description: "물방울 펫",
            cate_id: 2,
            purchased: false, // 구매하지 않은 상태
          },
          {
            prd_id: 8,
            prd_name: "별똥별",
            prd_type: "pet",
            prd_image: "/img/starlight.png",
            prd_price: 150,
            prd_description: "우주 배경",
            cate_id: 2,
            purchased: false,
          },
          {
            prd_id: 9,
            prd_name: "식물",
            prd_type: "pet",
            prd_image: "/img/plant.png",
            prd_price: 200,
            prd_description: "식물 펫",
            cate_id: 2,
            purchased: false,
          },
          {
            prd_id: 10,
            prd_name: "구름",
            prd_type: "pet",
            prd_image: "/img/cloud.png",
            prd_price: 180,
            prd_description: "구름 펫",
            cate_id: 2,
            purchased: true,
          },
          {
            prd_id: 11,
            prd_name: "마법사 모자",
            prd_type: "hat",
            prd_image: "/img/wizard.png",
            prd_price: 100,
            prd_description: "마법사 모자",
            cate_id: 3,
            purchased: true, // 구매 여부를 바로 설정
          },
          {
            prd_id: 12,
            prd_name: "신사 모자",
            prd_type: "hat",
            prd_image: "/img/gentleman.png",
            prd_price: 120,
            prd_description: "신사 모자",
            cate_id: 3,
            purchased: false, // 구매하지 않은 상태
          },
          {
            prd_id: 13,
            prd_name: "밀짚모자",
            prd_type: "hat",
            prd_image: "/img/farmer.png",
            prd_price: 150,
            prd_description: "밀짚모자",
            cate_id: 3,
            purchased: false,
          },
          {
            prd_id: 14,
            prd_name: "야구 모자",
            prd_type: "hat",
            prd_image: "/img/baseball.png",
            prd_price: 200,
            prd_description: "야구 모자",
            cate_id: 3,
            purchased: false,
          },
          {
            prd_id: 15,
            prd_name: "왕관",
            prd_type: "hat",
            prd_image: "/img/tiara.png",
            prd_price: 180,
            prd_description: "왕관",
            cate_id: 3,
            purchased: true,
          },
        ],
      });
    }
  },
}));