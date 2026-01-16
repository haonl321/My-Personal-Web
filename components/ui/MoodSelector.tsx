import React from 'react';
import { MOOD_OPTIONS, Mood } from '@/lib/types/failure';
import { cn } from '@/lib/utils';

interface MoodSelectorProps {
  value: Mood;
  onChange: (mood: Mood) => void;
}

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {MOOD_OPTIONS.map((mood) => {
        const isActive = value === mood.value;
        return (
          <button
            key={mood.value}
            type="button"
            onClick={() => onChange(mood.value)}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 border",
              isActive 
                ? "bg-primary/20 border-primary scale-110 shadow-lg shadow-primary/20" 
                : "bg-white/5 border-white/10 hover:bg-white/10 grayscale opacity-70 hover:grayscale-0 hover:opacity-100"
            )}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="text-[10px] font-medium text-white/70 text-center leading-tight">
              {mood.label.split(' / ')[0]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
