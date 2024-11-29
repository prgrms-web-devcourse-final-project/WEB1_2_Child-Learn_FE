import { create } from 'zustand'
import { TempEquippedItem } from '../types/tempEquippedItemTypes';

interface TempEquippedStore {
    tempItems: TempEquippedItem[];
    addTempItem: (item: TempEquippedItem) => void;
    removeTempItem: (itemId: number) => void;
  }
  
  export const useTempEquippedStore = create<TempEquippedStore>((set) => ({
    tempItems: [],
    addTempItem: (item) => set((state) => ({ tempItems: [...state.tempItems, item] })),
    removeTempItem: (itemId) =>
      set((state) => ({
        tempItems: state.tempItems.filter((item) => item.item_id !== itemId),
      })),
  }));
  