import { baseApi } from "./base";
import { EquipRequestDto, EquipResponseDto } from "@/features/avatar/types/equipTypes";
import { Item } from "@/features/avatar/types/itemTypes";
import { ReadRequestDto, ReadResponseDto } from "@/features/avatar/types/readTypes";
import { RemoveRequestDto, RemoveResponseDto } from "@/features/avatar/types/removeTypes";
import { PurchaseRequestDto, PurchaseResponseDto } from "@/features/avatar/types/purchaseTypes";

export const avatarApi = {

  // 아이템 구매
  purchaseItem: async (dto: PurchaseRequestDto): Promise<PurchaseResponseDto> => {
    const response = await baseApi.post(
      `/member/avatar/purchase`,
      dto,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data; // PurchaseResponseDto 반환
  },

  // 아이템 장착
  equipItem: async (dto: EquipRequestDto): Promise<EquipResponseDto> => {
    const response = await baseApi.post(
      `/member/avatar/isEquipped`,
      dto,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data; // EquipResponseDto 반환
  },

  // 아이템 해제
  removeItem: async (dto: RemoveRequestDto): Promise<RemoveResponseDto> => {
    const response = await baseApi.post(
      `/member/avatar/remove`,
      dto,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data; // RemoveResponseDto 반환
  },

  // 아이템 조회
  readItem: async (dto: ReadRequestDto): Promise<ReadResponseDto> => {
    const response = await baseApi.post(
      `/member/avatar/read`,
      dto,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data; // ReadResponseDto 반환
  },

  getAllItems: async (): Promise<
  (Item & { isPurchased: boolean; isEquipped: boolean })[]
> => {
  const response = await baseApi.get(`/member/avatar/read-all`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data; // 모든 아이템 리스트 반환 (구매 및 장착 여부 포함)
},
};
