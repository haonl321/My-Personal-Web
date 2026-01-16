import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CounterState {
  count: number;
  userId: string | null;
  setUserId: (id: string | null) => void;
  increment: () => void;
  reset: () => void;
  setCount: (count: number) => void;
}

export const useCounterStore = create<CounterState>()(
  persist(
    (set) => ({
      count: 0,
      userId: null,
      setUserId: (id) => set({ userId: id }),
      increment: () => set((state) => ({ count: state.count + 1 })),
      reset: () => set({ count: 0 }),
      setCount: (count) => set({ count }),
    }),
    {
      name: 'failure-counter',
    }
  )
);
