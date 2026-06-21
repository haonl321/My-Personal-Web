"use client";

import { useOpportunitiesStore } from "@/lib/store/opportunitiesStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useMemo } from "react";
import { REASON_OPTIONS } from "@/lib/types/opportunity";

const COLORS = {
  procrastination: '#f59e0b', // Amber
  fear: '#ef4444',            // Red
  unprepared: '#3b82f6',      // Blue
  other: '#64748b'            // Slate
};

export function OpportunityChart() {
  const { opportunities } = useOpportunitiesStore();

  const data = useMemo(() => {
    // Count reasons
    const counts: Record<string, number> = {
      procrastination: 0,
      fear: 0,
      unprepared: 0,
      other: 0
    };

    opportunities.forEach(opp => {
      if (counts[opp.reason] !== undefined) {
        counts[opp.reason]++;
      } else {
        counts.other++;
      }
    });

    return Object.entries(counts)
      .map(([key, count]) => {
        const option = REASON_OPTIONS.find(o => o.value === key);
        return {
          name: option ? option.label.split(' / ')[0] : 'Khác',
          value: count,
          key: key
        };
      })
      .filter(item => item.value > 0);
  }, [opportunities]);

  if (opportunities.length === 0) {
    return null;
  }

  return (
    <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-xl w-full max-w-4xl col-span-4">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white flex items-center justify-between">
          Phân Tích Nguyên Nhân Bỏ Lỡ Cơ Hội
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6">
        {data.length === 0 ? (
          <p className="text-white/40 py-10">Không có dữ liệu nguyên nhân.</p>
        ) : (
          <div className="h-[300px] w-full max-w-md">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.key as keyof typeof COLORS] || COLORS.other} 
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 15, 25, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    color: '#fff',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    fontSize: '12px'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  iconSize={10}
                  formatter={(value) => <span className="text-white/80 text-xs font-bold">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
