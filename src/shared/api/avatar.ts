import { baseApi } from "./base";

export interface Avatar {
  id: number;
  memberId: number;
  hat: Item | null;
  pet: Item | null;
  background: Item | null;
}

export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  category: "hat" | "pet" | "background";
  isEquipped: boolean;
}

export const avatarApi = {
  // 아바타 데이터 조회
  getAvatar: async (): Promise<Avatar> => {
    try {
      const token = localStorage.getItem("token");
      const response = await baseApi.get(`/member/avatar/read`, {
        headers: {
          Authorization: `Bearer ${token}`, // JWT 인증
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch avatar data:", error);
      throw error;
    }
  },

  // 아이템 구매
  purchaseItem: async (itemId: number): Promise<{ message: string }> => {
    try {
      const token = localStorage.getItem("token");
      const response = await baseApi.post(
        `/member/avatar/purchase`,
        { itemId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // JWT 인증
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to purchase item:", error);
      throw error;
    }
  },

  // 아이템 장착
  equipItem: async (
    memberId: number,
    itemId: number
  ): Promise<{ message: string }> => {
    try {
      const token = localStorage.getItem("token");
      const response = await baseApi.post(
        `/member/avatar/isEquipped`,
        { memberId, itemId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // JWT 인증
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to equip item:", error);
      throw error;
    }
  },

  // 아이템 해제
  unequipItem: async (itemId: number): Promise<{ message: string }> => {
    try {
      const token = localStorage.getItem("token");
      const response = await baseApi.post(
        `/member/avatar/remove`,
        { itemId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // JWT 인증
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to unequip item:", error);
      throw error;
    }
  },

  // 아이템 등록
  registerItem: async (item: {
    name: string;
    description: string;
    price: number;
    category: "hat" | "pet" | "background";
  }): Promise<{ message: string }> => {
    try {
      const token = localStorage.getItem("token");
      const response = await baseApi.post(
        `/member/avatar/register`,
        item,
        {
          headers: {
            Authorization: `Bearer ${token}`, // JWT 인증
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to register item:", error);
      throw error;
    }
  },
};
