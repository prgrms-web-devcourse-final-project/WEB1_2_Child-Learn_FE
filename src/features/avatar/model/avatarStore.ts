import { create } from "zustand";
import { Avatar } from '../types/avatarTypes'

interface AvatarState {
  avatar: Avatar | null;
  setAvatar: (avatar: Avatar | ((prevAvatar: Avatar | null) => Avatar)) => void;
  updateAvatarItem: (itemType: "background" | "pet" | "hat", itemName: string) => void;
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
  updateAvatarItem: (itemType, itemName) =>
    set((state) => {
      if (!state.avatar) return state;
      return {
        avatar: {
          ...state.avatar,
          [itemType === "background"
            ? "cur_background"
            : itemType === "pet"
            ? "cur_pet"
            : "cur_hat"]: itemName,
        },
      };
    }),
}));