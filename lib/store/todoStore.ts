import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TodoTask, TodoCategory, DEFAULT_TODO_CATEGORIES } from '@/lib/types/todo';
import { supabase } from '@/lib/db/supabase';

interface TodoState {
  tasks: TodoTask[];
  categories: TodoCategory[];
  userId: string | null;
  setUserId: (id: string | null) => void;
  addTask: (task: TodoTask) => Promise<void>;
  updateTask: (id: string, updates: Partial<TodoTask>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  addCategory: (category: TodoCategory) => void;
  removeCategory: (id: string) => void;
  loadFromSupabase: (userId: string) => Promise<void>;
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      tasks: [],
      categories: DEFAULT_TODO_CATEGORIES,
      userId: null,
      setUserId: (id) => set({ userId: id }),

      addTask: async (task) => {
        const { userId } = get();
        set((state) => ({ tasks: [task, ...state.tasks] }));
        if (userId) {
          await fetch('/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...task, user_id: userId }),
          });
        }
      },

      updateTask: async (id, updates) => {
        const { userId } = get();
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t)),
        }));
        if (userId) {
          await fetch('/api/todos', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, user_id: userId, ...updates }),
          });
        }
      },

      deleteTask: async (id) => {
        const { userId } = get();
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
        if (userId) {
          await fetch(`/api/todos?id=${id}&userId=${userId}`, { method: 'DELETE' });
        }
      },

      toggleTask: async (id) => {
        const { userId, tasks } = get();
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        const newStatus = !task.is_completed;
        const updatedAt = new Date().toISOString();

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  is_completed: newStatus,
                  completed_at: newStatus ? updatedAt : undefined,
                  updated_at: updatedAt,
                }
              : t
          ),
        }));

        if (userId) {
          await fetch('/api/todos', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, user_id: userId, is_completed: newStatus, completed_at: newStatus ? updatedAt : null }),
          });
        }
      },

      addCategory: async (category) => {
        const { userId } = get();
        set((state) => ({ categories: [...state.categories, category] }));
        if (userId) {
          await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...category, user_id: userId }),
          });
        }
      },
      removeCategory: async (id) => {
        const { userId } = get();
        set((state) => ({ categories: state.categories.filter((c) => c.id !== id) }));
        if (userId) {
          await fetch(`/api/categories?id=${id}&userId=${userId}`, { method: 'DELETE' });
        }
      },

      loadFromSupabase: async (userId) => {
        const response = await fetch(`/api/todos?userId=${userId}`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          if (data.length === 0 && get().tasks.length > 0) {
            console.log("Syncing local todos to Supabase...");
            for (const task of get().tasks) {
              await fetch('/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...task, user_id: userId }),
              });
            }
          } else {
            const formattedTasks: TodoTask[] = data.map(item => ({
              id: item.id,
              user_id: item.user_id,
              title: item.title,
              description: item.description,
              due_date: item.due_date,
              due_time: item.due_time,
              priority: item.priority,
              category_id: item.category_id,
              is_completed: item.is_completed,
              completed_at: item.completed_at,
              created_at: item.created_at,
              updated_at: item.updated_at,
              tags: item.tags || [],
              is_recurring: item.is_recurring || false,
              reminders: item.reminders || [],
              subtasks: item.subtasks || [],
              attachments: item.attachments || []
            }));
            set({ tasks: formattedTasks });
          }
        }

        const catResponse = await fetch(`/api/categories?userId=${userId}`);
        const catData = await catResponse.json();
        if (Array.isArray(catData) && catData.length > 0) {
          set({ categories: catData });
        }
      }
    }),
    {
      name: 'todo-storage',
    }
  )
);
