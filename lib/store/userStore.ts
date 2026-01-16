import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  customName: string;
  customAvatar: string;
  setName: (name: string) => void;
  setAvatar: (avatar: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      customName: '',
      customAvatar: '',
      setName: (name) => set({ customName: name }),
      setAvatar: (avatar) => set({ customAvatar: avatar }),
    }),
    {
      name: 'user-storage',
    }
  )
);
