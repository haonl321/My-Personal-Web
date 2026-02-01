"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useUserStore } from "@/lib/store/userStore";
import { useTodoStore } from "@/lib/store/todoStore";
import { useTimelineStore } from "@/lib/store/timelineStore";
import { useCounterStore } from "@/lib/store/counterStore";

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  
  const userStore = useUserStore();
  const todoStore = useTodoStore();
  const timelineStore = useTimelineStore();
  const counterStore = useCounterStore();

  useEffect(() => {
    if (isLoaded && user) {
      const userId = user.id;

      // Set userId in all stores
      todoStore.setUserId(userId);
      timelineStore.setUserId(userId);
      counterStore.setUserId(userId);

      // Load data from Supabase
      const initData = async () => {
        await Promise.all([
          userStore.loadFromSupabase(userId),
          todoStore.loadFromSupabase(userId),
          timelineStore.loadFromSupabase(userId),
        ]);
        
        // Update counter based on failures length
        const failureCount = timelineStore.failures.length;
        counterStore.setCount(failureCount);
      };

      initData();
    } else if (isLoaded && !user) {
      // Clear userId if logged out
      todoStore.setUserId(null);
      timelineStore.setUserId(null);
      counterStore.setUserId(null);
    }
  }, [user, isLoaded]);

  return <>{children}</>;
}
