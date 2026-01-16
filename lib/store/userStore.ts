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
          await supabase.from('profiles').upsert({ 
            user_id: userId, 
            custom_name: name,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
        }
      },
      setAvatar: async (avatar, userId) => {
        set({ customAvatar: avatar });
        if (userId) {
          await supabase.from('profiles').upsert({ 
            user_id: userId, 
            custom_avatar: avatar,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
        }
      },
      loadFromSupabase: async (userId) => {
        const { data, error } = await supabase
          .from('profiles')
          .select('custom_name, custom_avatar')
          .eq('user_id', userId)
          .single();
        
        if (data && !error) {
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
