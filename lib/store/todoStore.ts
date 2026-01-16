import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TodoTask, TodoCategory, DEFAULT_TODO_CATEGORIES } from '@/lib/types/todo';

interface TodoState {
  tasks: TodoTask[];
  categories: TodoCategory[];
  addTask: (task: TodoTask) => void;
  updateTask: (id: string, updates: Partial<TodoTask>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  addCategory: (category: TodoCategory) => void;
  removeCategory: (id: string) => void;
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      tasks: [],
      categories: DEFAULT_TODO_CATEGORIES,
      addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t)),
        })),
      deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  is_completed: !t.is_completed,
                  completed_at: !t.is_completed ? new Date().toISOString() : undefined,
                  updated_at: new Date().toISOString(),
                }
              : t
          ),
        })),
      addCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),
      removeCategory: (id) => set((state) => ({ categories: state.categories.filter((c) => c.id !== id) })),
    }),
    {
      name: 'todo-storage',
    }
  )
);
