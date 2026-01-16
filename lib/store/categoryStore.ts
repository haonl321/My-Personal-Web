import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FailureCategory, DEFAULT_CATEGORIES } from '../types/failure';

interface CategoryState {
  categories: FailureCategory[];
  addCategory: (category: Omit<FailureCategory, 'id' | 'isCustom'>) => void;
  removeCategory: (id: string) => void;
  updateCategory: (id: string, updates: Partial<FailureCategory>) => void;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: DEFAULT_CATEGORIES,
      addCategory: (cat) => set((state) => ({
        categories: [
          ...state.categories,
          { ...cat, id: crypto.randomUUID(), isCustom: true }
        ]
      })),
      removeCategory: (id) => set((state) => ({
        categories: state.categories.filter((c) => c.id !== id || !c.isCustom)
      })),
      updateCategory: (id, updates) => set((state) => ({
        categories: state.categories.map((c) => 
          c.id === id ? { ...c, ...updates } : c
        )
      })),
    }),
    {
      name: 'failure-categories',
    }
  )
);
