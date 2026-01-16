export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Subtask {
  id: string;
  title: string;
  is_completed: boolean;
}

export interface TodoCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface TodoTask {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  due_date?: string; // ISO string
  due_time?: string; // HH:mm
  priority: Priority;
  category_id?: string;
  tags: string[];
  estimated_time?: number; // in minutes
  actual_time?: number; // in minutes
  is_recurring: boolean;
  recurring_pattern?: 'daily' | 'weekly' | 'monthly';
  reminders: string[]; // ISO strings
  subtasks: Subtask[];
  attachments: string[]; // URLs or file paths
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export const PRIORITY_OPTIONS: { value: Priority; label: string; color: string; icon: string }[] = [
  { value: 'low', label: 'Low', color: 'bg-blue-400', icon: '🔵' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-400', icon: '🟡' },
  { value: 'high', label: 'High', color: 'bg-orange-400', icon: '🟠' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-400', icon: '🔴' },
];

export const DEFAULT_TODO_CATEGORIES: TodoCategory[] = [
  { id: 'work', label: 'Work', icon: '💼', color: 'bg-blue-500' },
  { id: 'personal', label: 'Personal', icon: '👤', color: 'bg-green-500' },
  { id: 'health', label: 'Health', icon: '🏥', color: 'bg-red-500' },
  { id: 'learning', label: 'Learning', icon: '📚', color: 'bg-purple-500' },
  { id: 'finance', label: 'Finance', icon: '💰', color: 'bg-yellow-500' },
];
