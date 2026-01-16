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
          await supabase.from('todos').insert({
            user_id: userId,
            title: task.title,
            description: task.description,
            due_date: task.due_date,
            due_time: task.due_time,
            priority: task.priority,
            category_id: task.category_id,
            is_completed: task.is_completed,
            created_at: task.created_at
          });
        }
      },

      updateTask: async (id, updates) => {
        const { userId } = get();
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t)),
        }));
        if (userId) {
          await supabase.from('todos').update({
            title: updates.title,
            description: updates.description,
            due_date: updates.due_date,
            due_time: updates.due_time,
            priority: updates.priority,
            category_id: updates.category_id,
            is_completed: updates.is_completed,
            updated_at: new Date().toISOString()
          }).eq('id', id).eq('user_id', userId);
        }
      },

      deleteTask: async (id) => {
        const { userId } = get();
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
        if (userId) {
          await supabase.from('todos').delete().eq('id', id).eq('user_id', userId);
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
          await supabase.from('todos').update({
            is_completed: newStatus,
            completed_at: newStatus ? updatedAt : null,
            updated_at: updatedAt
          }).eq('id', id).eq('user_id', userId);
        }
      },

      addCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),
      removeCategory: (id) => set((state) => ({ categories: state.categories.filter((c) => c.id !== id) })),

      loadFromSupabase: async (userId) => {
        const { data, error } = await supabase
          .from('todos')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (data && !error) {
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
    }),
    {
      name: 'todo-storage',
    }
  )
);
