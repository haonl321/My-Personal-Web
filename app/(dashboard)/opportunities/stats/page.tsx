"use client";

import { useOpportunitiesStore } from "@/lib/store/opportunitiesStore";
import { OpportunityChart } from "@/components/Opportunities/OpportunityChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Star, BarChart3, AlertCircle, Compass, Calendar } from "lucide-react";
import { useMemo } from "react";
import { differenceInDays } from "date-fns";
import { REASON_OPTIONS } from "@/lib/types/opportunity";

export default function OpportunitiesStatsPage() {
  const { opportunities } = useOpportunitiesStore();

  const count = opportunities.length;

  const stats = useMemo(() => {
    if (count === 0) return null;

    // Regret calculations
    const sumRegret = opportunities.reduce((acc, o) => acc + o.regret_level, 0);
    const avgRegret = (sumRegret / count).toFixed(1);

    // Reasons counts
    const reasonsCounts: Record<string, number> = {};
    opportunities.forEach(o => {
      reasonsCounts[o.reason] = (reasonsCounts[o.reason] || 0) + 1;
    });

    const sortedReasons = Object.entries(reasonsCounts).sort((a, b) => b[1] - a[1]);
    const topReasonKey = sortedReasons[0]?.[0];
    const topReason = REASON_OPTIONS.find(r => r.value === topReasonKey);

    // Recent count
    const recent = opportunities.filter(o => 
      differenceInDays(new Date(), new Date(o.occurred_at)) <= 7
    ).length;

    return {
      avgRegret,
      topReason: topReason ? topReason.label.split(' / ')[0] : "N/A",
      topReasonIcon: topReason ? topReason.icon : "💡",
      recent
    };
  }, [opportunities, count]);

  return (
    <div className="w-full flex flex-col items-center gap-8 pb-20">
      <div className="text-center space-y-2 max-w-xl">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black text-white drop-shadow-md uppercase tracking-wider text-pop"
        >
          Phân tích Cơ hội bỏ lỡ
        </motion.h1>
        <p className="text-white/60 text-sm">
          Nhìn nhận sâu sắc lý do đằng sau sự trì hoãn hay nỗi sợ của bản thân để vững vàng đón nhận cơ hội kế tiếp.
        </p>
      </div>

      {stats ? (
        <div className="w-full max-w-4xl space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Regret Card */}
            <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-xl hover:bg-black/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold text-white/90">Tiếc nuối Trung bình</CardTitle>
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-white drop-shadow-sm">{stats.avgRegret} / 5.0</div>
                <p className="text-xs text-white/60">Mức độ trân trọng các cơ hội đã lỡ</p>
              </CardContent>
            </Card>

            {/* Common Reason Card */}
            <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-xl hover:bg-black/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold text-white/90">Rào cản lớn nhất</CardTitle>
                <span className="text-lg">{stats.topReasonIcon}</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-white drop-shadow-sm truncate">{stats.topReason}</div>
                <p className="text-xs text-white/60">Lý do thường trực khiến bạn chùn bước</p>
              </CardContent>
            </Card>

            {/* Recency Card */}
            <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-xl hover:bg-black/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold text-white/90">Tần suất bỏ lỡ</CardTitle>
                <Calendar className="h-5 w-5 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-white drop-shadow-sm">{stats.recent} lần</div>
                <p className="text-xs text-white/60">Cơ hội bỏ lỡ trong 7 ngày qua</p>
              </CardContent>
            </Card>
          </div>

          <div className="w-full flex justify-center">
            <OpportunityChart />
          </div>
        </div>
      ) : (
        <Card className="bg-black/40 backdrop-blur-xl border-white/10 p-20 text-center w-full max-w-4xl rounded-[2rem]">
          <p className="text-white/40 font-bold uppercase tracking-widest">Không đủ dữ liệu phân tích. Hãy ghi nhận khi bạn lỡ việc nhé! 🚀</p>
        </Card>
      )}
    </div>
  );
}
