export type Mood = 'terrible' | 'sad' | 'neutral' | 'okay' | 'good';

export interface FailureCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
  isCustom?: boolean;
}

export interface DetailedFailureEntry {
  id: string;
  user_id: string;
  count: number;
  occurred_at: string;
  // New fields
  category_id: string;
  title: string;
  description: string;
  mood: Mood;
  severity: number; // 1-5
  tags: string[];
  lesson: string;
  action_plan: string;
  image_url?: string | null;
}

export const MOOD_OPTIONS: { value: Mood; label: string; emoji: string }[] = [
  { value: 'terrible', label: 'Rất tệ / Terrible', emoji: '😭' },
  { value: 'sad', label: 'Buồn / Sad', emoji: '😢' },
  { value: 'neutral', label: 'Bình thường / Neutral', emoji: '😐' },
  { value: 'okay', label: 'Ổn / Okay', emoji: '🙂' },
  { value: 'good', label: 'Tốt / Good', emoji: '😊' },
];

export const DEFAULT_CATEGORIES: FailureCategory[] = [
  { id: 'rel', label: 'Tình cảm / Relationships', icon: '💔', color: 'bg-pink-500' },
  { id: 'edu', label: 'Học hành / Education', icon: '📚', color: 'bg-blue-500' },
  { id: 'car', label: 'Công việc / Career', icon: '💼', color: 'bg-slate-500' },
  { id: 'hea', label: 'Sức khỏe / Health & Fitness', icon: '💪', color: 'bg-red-500' },
  { id: 'fin', label: 'Tài chính / Finance', icon: '💰', color: 'bg-green-500' },
  { id: 'cre', label: 'Sáng tạo / Creative Projects', icon: '🎨', color: 'bg-purple-500' },
  { id: 'soc', label: 'Xã hội / Social Life', icon: '👥', color: 'bg-cyan-500' },
  { id: 'per', label: 'Mục tiêu cá nhân / Personal Goals', icon: '🎯', color: 'bg-orange-500' },
  { id: 'fam', label: 'Gia đình / Family', icon: '🏠', color: 'bg-emerald-500' },
  { id: 'ski', label: 'Kỹ năng / Skills Learning', icon: '🔧', color: 'bg-indigo-500' },
  { id: 'oth', label: 'Khác / Other', icon: '➕', color: 'bg-gray-500' },
];
