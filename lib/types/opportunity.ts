export type OpportunityReason = 'fear' | 'procrastination' | 'unprepared' | 'other';

export interface MissedOpportunityEntry {
  id: string;
  user_id: string;
  title: string;
  description: string;
  reason: OpportunityReason;
  regret_level: number; // 1-5 sao
  lesson: string;
  action_plan: string;
  occurred_at: string;
}

export const REASON_OPTIONS: { value: OpportunityReason; label: string; icon: string; color: string }[] = [
  { value: 'procrastination', label: 'Trì hoãn / Procrastination', icon: '⏳', color: 'bg-amber-500' },
  { value: 'fear', label: 'Sợ hãi, do dự / Fear & Hesitation', icon: '😨', color: 'bg-red-500' },
  { value: 'unprepared', label: 'Thiếu chuẩn bị / Unprepared', icon: '📋', color: 'bg-blue-500' },
  { value: 'other', label: 'Khác / Other', icon: '🌀', color: 'bg-slate-500' },
];
