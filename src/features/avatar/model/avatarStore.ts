import { create } from "zustand";
import { Avatar } from "../types/avatarTypes";
import { Item } from "../types/itemTypes";

interface AvatarState {
  avatar: Avatar | null; // 아바타 상태
  setAvatar: (avatar: Avatar | ((prevAvatar: Avatar | null) => Avatar)) => void;
  updateAvatarItem: (itemType: "background" | "pet" | "hat", item: Item) => void; // 아이템 업데이트
}

export const useAvatarStore = create<AvatarState>((set) => ({
  avatar: null,
  setAvatar: (avatarOrUpdater) =>
    set((state) => {
      const newAvatar =
        typeof avatarOrUpdater === "function"
          ? avatarOrUpdater(state.avatar) // 함수형 업데이트
          : avatarOrUpdater; // 객체 업데이트
      return { avatar: newAvatar };
    }),
  updateAvatarItem: (itemType, item) =>
    set((state) => {
      if (!state.avatar) return state;
      return {
        avatar: {
          ...state.avatar,
          [itemType]: item,
        },
      };
    }),
}));
