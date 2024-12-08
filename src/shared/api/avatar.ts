import { baseApi } from "./base";
import { AvatarResponseDto } from "@/features/avatar/types/avatarTypes";
import { EquipRequestDto, EquipResponseDto } from "@/features/avatar/types/equipTypes";
import { ReadRequestDto, ReadResponseDto } from "@/features/avatar/types/readTypes";
import { RemoveRequestDto, RemoveResponseDto } from "@/features/avatar/types/removeTypes";
import { PurchaseRequestDto, PurchaseResponseDto } from "@/features/avatar/types/purchaseTypes";

export const avatarApi = {
  // 아바타 상태 조회
  getAvatar: async (): Promise<AvatarResponseDto> => {
    const response = await baseApi.get(`/member/avatar`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data; // AvatarResponseDto 반환
  },

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
};
