export interface PurchaseRequestDto {
    itemId: number;
  }
  
  export interface PurchaseResponseDto {
    message: string;
    remainingCoins?: number;
  }
  