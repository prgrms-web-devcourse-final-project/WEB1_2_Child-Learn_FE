// 결제 기록
export interface Payment {
    pay_id: number;
    prd_id: number;   // FK → MarketItem
    avatar_id: number; // FK → Avatar
    status: "COMPLETED" | "FAILED"; // ENUM
  }