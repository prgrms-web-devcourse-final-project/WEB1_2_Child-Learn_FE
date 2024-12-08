import { Item } from "./itemTypes";
// 아바타 상태
export interface AvatarResponseDto {
  memberId: number;
  hat: any;
  pet: any;
  background: any;
}

// Avatar 타입
export interface Avatar {
  memberId: number; // 회원 ID
  hat: Item | null; // 장착된 모자
  pet: Item | null; // 장착된 펫
  background: Item | null; // 장착된 배경
}
