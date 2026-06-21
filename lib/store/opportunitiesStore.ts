import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MissedOpportunityEntry } from '../types/opportunity';

interface OpportunitiesState {
  opportunities: MissedOpportunityEntry[];
  userId: string | null;
  setUserId: (id: string | null) => void;
  addOpportunity: (entry: MissedOpportunityEntry) => Promise<void>;
  removeOpportunity: (id: string) => Promise<void>;
  clearAllOpportunities: () => Promise<void>;
  setOpportunities: (opportunities: MissedOpportunityEntry[]) => void;
  loadFromSupabase: (userId: string) => Promise<void>;
}

export const useOpportunitiesStore = create<OpportunitiesState>()(
  persist(
    (set, get) => ({
      opportunities: [],
      userId: null,
      setUserId: (id) => set({ userId: id }),

      addOpportunity: async (entry) => {
        const { userId } = get();
        set((state) => ({ opportunities: [entry, ...state.opportunities] }));
        if (userId) {
          await fetch('/api/opportunities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...entry, user_id: userId }),
          });
        }
      },

      removeOpportunity: async (id) => {
        const { userId } = get();
        set((state) => ({ 
          opportunities: state.opportunities.filter((o) => o.id !== id) 
        }));
        if (userId) {
          await fetch(`/api/opportunities?id=${id}&userId=${userId}`, { method: 'DELETE' });
        }
      },

      clearAllOpportunities: async () => {
        const { userId } = get();
        set({ opportunities: [] });
        if (userId) {
          await fetch(`/api/opportunities?id=all&userId=${userId}`, { method: 'DELETE' });
        }
      },

      setOpportunities: (opportunities) => set({ opportunities }),

      loadFromSupabase: async (userId) => {
        const response = await fetch(`/api/opportunities?userId=${userId}`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const formattedOpportunities: MissedOpportunityEntry[] = data.map(item => ({
            id: item.id,
            user_id: item.user_id,
            title: item.title,
            description: item.description,
            reason: item.reason,
            regret_level: item.regret_level || 3,
            lesson: item.lesson,
            action_plan: item.action_plan,
            occurred_at: item.occurred_at
          }));
          set({ opportunities: formattedOpportunities });
        }
      }
    }),
    {
      name: 'opportunities-store',
    }
  )
);
