"use client"

import { useTimelineStore } from "@/lib/store/timelineStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, ComposedChart } from "recharts";
import { useMemo } from "react";
import { format, subDays, isSameDay } from "date-fns";
import { MOOD_OPTIONS, Mood } from "@/lib/types/failure";

const MOOD_VALUES: Record<Mood, number> = {
  terrible: 1,
  sad: 2,
  neutral: 3,
  okay: 4,
  good: 5
};

export function FailureChart() {
  const { failures } = useTimelineStore();

  const data = useMemo(() => {
    // Generate last 7 days
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(new Date(), 6 - i);
      return {
        name: format(d, "EEE"), 
        date: d,
        count: 0,
        moodTotal: 0,
        moodCount: 0,
        avgMood: 0
      };
    });

    // Process failures
    failures.forEach(f => {
      const fDate = new Date(f.occurred_at);
      const day = last7Days.find(d => isSameDay(d.date, fDate));
      if (day) {
        day.count++;
        const val = MOOD_VALUES[f.mood] || 3;
        day.moodTotal += val;
        day.moodCount++;
      }
    });

    // Calculate averages
    return last7Days.map(d => ({
      ...d,
      avgMood: d.moodCount > 0 ? d.moodTotal / d.moodCount : null
    }));
  }, [failures]);

  return (
    <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-xl col-span-4 w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Activity & Resilience
          <div className="flex gap-4 text-xs font-normal">
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary" /> Lessons</div>
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-secondary" /> Avg Mood</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <XAxis 
                dataKey="name" 
                stroke="#666" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis
                yAxisId="left"
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                tickFormatter={(val) => {
                  if (val === 1) return "😭";
                  if (val === 3) return "😐";
                  if (val === 5) return "😊";
                  return "";
                }}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 15, 25, 0.9)', 
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  color: '#fff',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}
              />
              <Bar 
                yAxisId="left"
                dataKey="count" 
                fill="oklch(0.6 0.25 270)" 
                radius={[6, 6, 0, 0]}
                barSize={32}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgMood"
                stroke="oklch(0.7 0.25 150)" // Secondary emerald/cyan
                strokeWidth={3}
                dot={{ fill: 'oklch(0.7 0.25 150)', r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                connectNulls
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

