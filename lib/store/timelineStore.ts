import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DetailedFailureEntry } from '../types/failure';

interface TimelineState {
  failures: DetailedFailureEntry[];
  addFailure: (entry: DetailedFailureEntry) => void;
  removeFailure: (id: string) => void;
  setFailures: (failures: DetailedFailureEntry[]) => void;
}

export const useTimelineStore = create<TimelineState>()(
  persist(
    (set) => ({
      failures: [],
      addFailure: (entry) => set((state) => ({ failures: [entry, ...state.failures] })),
      removeFailure: (id) => set((state) => ({ 
        failures: state.failures.filter((f) => f.id !== id) 
      })),
      setFailures: (failures) => set({ failures }),
    }),
    {
      name: 'failure-timeline',
    }
  )
);
