import React from 'react';
import { REASON_OPTIONS, OpportunityReason } from '@/lib/types/opportunity';
import { cn } from '@/lib/utils';

interface ReasonSelectorProps {
  value: OpportunityReason;
  onChange: (reason: OpportunityReason) => void;
}

export function ReasonSelector({ value, onChange }: ReasonSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {REASON_OPTIONS.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-200 border",
              isActive 
                ? "bg-yellow-400/20 border-yellow-400 scale-105 shadow-lg shadow-yellow-400/10" 
                : "bg-white/5 border-white/10 hover:bg-white/10 opacity-70 hover:opacity-100"
            )}
          >
            <span className="text-2xl">{opt.icon}</span>
            <span className="text-[10px] font-black text-white/70 text-center leading-tight uppercase tracking-wider">
              {opt.label.split(' / ')[0]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
