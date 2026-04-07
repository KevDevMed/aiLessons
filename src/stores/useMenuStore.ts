import { create } from 'zustand';
import { ContextMenuItem } from '../types/menu';

interface MenuStore {
  visible: boolean;
  x: number;
  y: number;
  items: ContextMenuItem[];
  show: (x: number, y: number, items: ContextMenuItem[]) => void;
  hide: () => void;
}

export const useMenuStore = create<MenuStore>((set) => ({
  visible: false,
  x: 0,
  y: 0,
  items: [],
  show: (x, y, items) => set({ visible: true, x, y, items }),
  hide: () => set({ visible: false }),
}));
