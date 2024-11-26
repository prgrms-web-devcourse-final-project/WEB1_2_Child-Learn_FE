// 상점의 상품
export interface MarketItem {
    prd_id: number;
    prd_price: number;
    prd_name: string;
    prd_type: string; // 아이템 타입
    prd_description: string;
    prd_image: string;
    cate_id: number;  // FK → ItemCategory
  }