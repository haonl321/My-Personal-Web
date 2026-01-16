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
          await supabase.from('failures').insert({
            id: entry.id,
            user_id: userId,
            title: entry.title,
            description: entry.description,
            category_id: entry.category_id,
            mood: entry.mood,
            severity: entry.severity,
            lesson: entry.lesson,
            action_plan: entry.action_plan,
            occurred_at: entry.occurred_at
          });
        }
      },

      removeFailure: async (id) => {
        const { userId } = get();
        set((state) => ({ 
          failures: state.failures.filter((f) => f.id !== id) 
        }));
        if (userId) {
          await supabase.from('failures').delete().eq('id', id).eq('user_id', userId);
        }
      },

      setFailures: (failures) => set({ failures }),

      loadFromSupabase: async (userId) => {
        const { data, error } = await supabase
          .from('failures')
          .select('*')
          .eq('user_id', userId)
          .order('occurred_at', { ascending: false });
        
        if (data && !error) {
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
