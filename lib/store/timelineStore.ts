import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DetailedFailureEntry } from '../types/failure';
import { supabase } from '@/lib/db/supabase';

interface TimelineState {
  failures: DetailedFailureEntry[];
  userId: string | null;
  setUserId: (id: string | null) => void;
  addFailure: (entry: DetailedFailureEntry) => Promise<void>;
  removeFailure: (id: string) => Promise<void>;
  setFailures: (failures: DetailedFailureEntry[]) => void;
  loadFromSupabase: (userId: string) => Promise<void>;
}

export const useTimelineStore = create<TimelineState>()(
  persist(
    (set, get) => ({
      failures: [],
      userId: null,
      setUserId: (id) => set({ userId: id }),

      addFailure: async (entry) => {
        const { userId } = get();
        set((state) => ({ failures: [entry, ...state.failures] }));
        if (userId) {
          await fetch('/api/failures', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...entry, user_id: userId }),
          });
        }
      },

      removeFailure: async (id) => {
        const { userId } = get();
        set((state) => ({ 
          failures: state.failures.filter((f) => f.id !== id) 
        }));
        if (userId) {
          await fetch(`/api/failures?id=${id}&userId=${userId}`, { method: 'DELETE' });
        }
      },

      setFailures: (failures) => set({ failures }),

      loadFromSupabase: async (userId) => {
        const response = await fetch(`/api/failures?userId=${userId}`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const formattedFailures: DetailedFailureEntry[] = data.map(item => ({
            id: item.id,
            user_id: item.user_id,
            count: item.count || 1,
            occurred_at: item.occurred_at,
            category_id: item.category_id,
            title: item.title,
            description: item.description,
            mood: item.mood,
            severity: item.severity,
            lesson: item.lesson,
            action_plan: item.action_plan,
            tags: item.tags || [],
            image_url: item.image_url
          }));
          set({ failures: formattedFailures });
        }
      }
    }),
    {
      name: 'failure-timeline',
    }
  )
);
