import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  theme: 'dark' | 'light' | 'system';
  soundEnabled: boolean;
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  toggleSound: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      soundEnabled: true,
      setTheme: (theme) => set({ theme }),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
    }),
    {
      name: 'failure-settings',
    }
  )
);
