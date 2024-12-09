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
    prd_description: "시간 여행이 가능한 배경! 미래 도시에서 로봇 친구들과 어울려보세요. \n" +
      "단, 교통체증이 심할 수도 있습니다. 나노 택시를 예약하세요. \n" +
      "미래는 지금 시작됩니다!",
    cate_id: 1,
    purchased: false,
  },
  {
    prd_id: 2,
    prd_name: "수중 세계",
    prd_type: "background",
    prd_image: "/img/underwater.png",
    prd_price: 12,
    prd_description: "푸른 바다 깊숙한 곳으로 떠나는 모험! \n" +
      "물고기들과 친구가 될 준비를 하세요. \n" +
      "수중 세계에서는 스쿠버가 필수입니다. 젖을 걱정은 넣어둬요!",
    cate_id: 1,
    purchased: false,
  },
  {
    prd_id: 3,
    prd_name: "우주",
    prd_type: "background",
    prd_image: "/img/space.png",
    prd_price: 15,
    prd_description:  "우주 한복판에서 별똥별 구경은 어때요? \n" +
    "중력은 없지만 낭만은 넘치는 곳! \n" +
    "은하수를 헤엄치며 진정한 우주인이 되어보세요.",
    cate_id: 1,
    purchased: false,
  },
  {
    prd_id: 4,
    prd_name: "스위트 공장",
    prd_type: "background",
    prd_image: "/img/sweet-factory.png",
    prd_price: 20,
    prd_description: "캔디와 초콜릿으로 가득 찬 달콤한 공장! \n" +
    "윌리 웡카도 부러워할 환상적인 곳입니다. \n" +
    "단, 치아 건강은 본인의 몫이에요.",
    cate_id: 1,
    purchased: false,
  },
  {
    prd_id: 5,
    prd_name: "유령 성",
    prd_type: "background",
    prd_image: "/img/spooky-castle.png",
    prd_price: 18,
    prd_description: "으스스하고 매혹적인 유령 성! \n" +
      "귀신 친구들과 즐겁게 지낼 준비를 하세요. \n" +
      "겁이 없다면 유령 성 주인이 되어보세요.",
    cate_id: 1,
    purchased: false,
  },
  {
    prd_id: 6,
    prd_name: "불꽃",
    prd_type: "pet",
    prd_image: "/img/fire.png",
    prd_price: 10,
    prd_description: "뜨겁고 열정적인 펫, 불꽃! \n" +
      "단, 이 친구는 종종 말썽을 피울 수도 있어요. \n" +
      "물과는 친구가 아니니 조심하세요!",
    cate_id: 2,
    purchased: false,
  },
  {
    prd_id: 7,
    prd_name: "물방울",
    prd_type: "pet",
    prd_image: "/img/water.png",
    prd_price: 12,
    prd_description: "맑고 청량한 펫, 물방울! \n" +
      "물을 사랑하는 당신을 위한 최고의 선택. \n" +
      "한 방울로도 세상을 적실 수 있어요.",
    cate_id: 2,
    purchased: false,
  },
  {
    prd_id: 8,
    prd_name: "별똥별",
    prd_type: "pet",
    prd_image: "/img/starlight.png",
    prd_price: 15,
    prd_description: "밤하늘을 가로지르는 찬란한 펫, 별똥별! \n" +
      "빛나는 존재와 함께라면 어디든 특별합니다. \n" +
      "단, 잠잘 때 너무 빛날 수 있어요.",
    cate_id: 2,
    purchased: false,
  },
  {
    prd_id: 9,
    prd_name: "식물",
    prd_type: "pet",
    prd_image: "/img/plant.png",
    prd_price: 20,
    prd_description: "산소를 만드는 자연 친화적 펫, 식물! \n" +
      "물을 주고 햇빛을 쬐어주는 것만으로 충분합니다. \n" +
      "환경 보호를 실천하는 멋진 동반자죠.",
    cate_id: 2,
    purchased: false,
  },
  {
    prd_id: 10,
    prd_name: "구름",
    prd_type: "pet",
    prd_image: "/img/cloud.png",
    prd_price: 18,
    prd_description: "하늘을 유영하는 몽글몽글한 펫, 구름! \n" +
      "비 오는 날에는 우산을 챙기세요. \n" +
      "매일 다른 형태로 변신하는 게 특징입니다.",
    cate_id: 2,
    purchased: false,
  },
  {
    prd_id: 11,
    prd_name: "마법사 모자",
    prd_type: "hat",
    prd_image: "/img/wizard.png",
    prd_price: 10,
    prd_description: "마법의 기운이 넘치는 모자! \n" +
    "이 모자를 쓰면 주문이 저절로 떠오릅니다. \n" +
    "단, 가끔 예상치 못한 폭발이 있을 수도 있어요.",
    cate_id: 3,
    purchased: false,
  },
  {
    prd_id: 12,
    prd_name: "신사 모자",
    prd_type: "hat",
    prd_image: "/img/gentleman.png",
    prd_price: 12,
    prd_description: "품격이 느껴지는 신사의 상징! \n" +
    "이 모자를 쓰면 어쩐지 영국식 억양이 나올지도? \n" +
    "차 한 잔의 여유를 가져보세요.",
    cate_id: 3,
    purchased: false,
  },
  {
    prd_id: 13,
    prd_name: "밀짚모자",
    prd_type: "hat",
    prd_image: "/img/farmer.png",
    prd_price: 15,
    prd_description: "태양 아래 당신의 머리를 지켜줄 모자! \n" +
    "밀짚모자를 쓰면 갑자기 농사를 짓고 싶어질지도? \n" +
    "자연과 한 몸이 되어보세요.",
    cate_id: 3,
    purchased: false,
  },
  {
    prd_id: 14,
    prd_name: "야구 모자",
    prd_type: "hat",
    prd_image: "/img/baseball.png",
    prd_price: 2000,
    prd_description:  "홈런을 노리는 야구 팬의 필수템! \n" +
    "이 모자를 쓰면 심판도 당신을 인정할지도 몰라요. \n" +
    "단, 공이 날아오면 피해 가세요.",
    cate_id: 3,
    purchased: false,
  },
  {
    prd_id: 15,
    prd_name: "왕관",
    prd_type: "hat",
    prd_image: "/img/tiara.png",
    prd_price: 18,
    prd_description:  "왕이나 여왕이 되어볼 수 있는 절호의 기회! \n" +
    "왕관을 쓰면 주변의 모든 시선이 집중됩니다. \n" +
    "단, 책임감도 무게에 포함되어 있어요.",
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