import { ItemCategory } from "./itemCategoryTypes";
// 상점의 상품
// MarketItem 타입
export interface MarketItem {
  id: number; // 아이템 ID
  name: string; // 아이템 이름
  price: number; // 가격
  category: ItemCategory; // 카테고리
  imageUrl: string; // 이미지 URL
  description: string; // 설명
  purchased: boolean; // 구매 여부
}
