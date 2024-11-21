export interface BeginStock {
    begin_id: number;     // BIGINT - 기초번호
    price: number;        // INT - 거래가격
    trade_day: string;    // VARCHAR(2) - 거래요일
  }
  
  // API 응답 타입
  export interface BeginStockResponse {
    status: number;       // HTTP 상태 코드
    data?: BeginStock[]; 
    error?: string;      
  }
  
  // API 요청 파라미터 타입
  export interface BeginStockRequest {
    begin_id?: number;
    trade_day?: string;
  }