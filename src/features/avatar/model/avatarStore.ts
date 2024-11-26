import { create } from "zustand";
import { Avatar } from '../types/avatarTypes'

interface AvatarState {
  avatar: Avatar | null;
  setAvatar: (avatar: Avatar) => void;
  updateAvatarItem: (itemType: "background" | "pet" | "hat", itemName: string) => void;
}

export const useAvatarStore = create<AvatarState>((set) => ({
  avatar: null,
  setAvatar: (avatar) => set({ avatar }),
  updateAvatarItem: (itemType, itemName) =>
    set((state) => {
      if (!state.avatar) return state;
      return {
        avatar: {
          ...state.avatar,
          [itemType === "background" ? "cur_background" : itemType === "pet" ? "cur_pet" : "cur_hat"]: itemName,
        },
      };
    }),
}));
