// 아이템 카테고리
export interface ItemCategory {
    cate_id: number;
    cate_name: string;
    cate_description: string;
    cate_type: "background" | "pet" | "hat"; // ENUM
  }
  