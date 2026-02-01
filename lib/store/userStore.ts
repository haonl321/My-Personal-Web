import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/db/supabase';

interface UserState {
  customName: string;
  customAvatar: string;
  setName: (name: string, userId?: string) => void;
  setAvatar: (avatar: string, userId?: string) => void;
  loadFromSupabase: (userId: string) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      customName: '',
      customAvatar: '',
      setName: async (name, userId) => {
        set({ customName: name });
        if (userId) {
          await fetch('/api/profiles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, custom_name: name }),
          });
        }
      },
      setAvatar: async (avatar, userId) => {
        set({ customAvatar: avatar });
        if (userId) {
          await fetch('/api/profiles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, custom_avatar: avatar }),
          });
        }
      },
      loadFromSupabase: async (userId) => {
        const response = await fetch(`/api/profiles?userId=${userId}`);
        const data = await response.json();
        
        if (data) {
          set({ 
            customName: data.custom_name || '', 
            customAvatar: data.custom_avatar || '' 
          });
        }
      }
    }),
    {
      name: 'user-storage',
    }
  )
);
