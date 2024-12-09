export interface ReadRequestDto {
    id: number;
  }
  
  export interface ReadResponseDto {
    id: number;
    name: string;
    price: number;
    category: string;
    imageUrl: string;
    description: string;
  }