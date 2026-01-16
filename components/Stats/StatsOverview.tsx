import { useCounterStore } from "@/lib/store/counterStore";
import { useTimelineStore } from "@/lib/store/timelineStore";
import { useCategoryStore } from "@/lib/store/categoryStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Award, Clock, Heart, Smile } from "lucide-react";
import { useMemo } from "react";
import { differenceInDays, formatDistanceToNow } from "date-fns";
import { MOOD_OPTIONS } from "@/lib/types/failure";
import { cn } from "@/lib/utils";

export function StatsOverview() {
  const { count } = useCounterStore();
  const { failures } = useTimelineStore();
  const { categories } = useCategoryStore();

  const stats = useMemo(() => {
    if (failures.length === 0) return null;

    const sorted = [...failures].sort((a, b) => new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime());
    
    // Category Breakdown
    const categoryCounts: Record<string, number> = {};
    failures.forEach(f => {
      categoryCounts[f.category_id] = (categoryCounts[f.category_id] || 0) + 1;
    });

    const breakdown = Object.entries(categoryCounts)
      .map(([id, count]) => ({
        ...categories.find(c => c.id === id),
        count,
        percentage: (count / failures.length) * 100
      }))
      .sort((a, b) => b.count - a.count);

    // Mood Stats
    const moodCounts: Record<string, number> = {};
    failures.forEach(f => {
      moodCounts[f.mood] = (moodCounts[f.mood] || 0) + 1;
    });

    // Correlation: Most frequent category for bad moods
    const badMoodFailures = failures.filter(f => f.mood === 'terrible' || f.mood === 'sad');
    const badMoodCategories: Record<string, number> = {};
    badMoodFailures.forEach(f => {
      badMoodCategories[f.category_id] = (badMoodCategories[f.category_id] || 0) + 1;
    });
    const worstCategory = Object.entries(badMoodCategories)
      .sort((a, b) => b[1] - a[1])[0]?.[0];

    // Recovery Time calculation (simple version)
    // Avg time between a 'bad' mood and a 'good' failure or current time if latest is good
    // Or just time since last bad failure.
    const lastBadIndex = sorted.findLastIndex(f => f.mood === 'terrible' || f.mood === 'sad');
    const recoveryTime = lastBadIndex !== -1 
      ? formatDistanceToNow(new Date(sorted[lastBadIndex].occurred_at))
      : "No setbacks yet!";

    return {
      breakdown,
      moodCounts,
      worstCategory: categories.find(c => c.id === worstCategory),
      recoveryTime,
      last7Days: failures.filter(f => differenceInDays(new Date(), new Date(f.occurred_at)) <= 7).length,
      daysSinceLast: failures.length > 0 
        ? differenceInDays(new Date(), new Date(failures[0].occurred_at)) 
        : 0
    };
  }, [failures, categories]);

  if (!stats) {
    return (
      <Card className="bg-black/40 backdrop-blur-xl border-white/10 p-20 text-center">
        <p className="text-white/40">Not enough data to generate analytics. Keep failing! 🚀</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-4xl">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-xl hover:bg-black/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Total Failures</CardTitle>
            <Award className="h-4 w-4 text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white drop-shadow-sm">{count}</div>
            <p className="text-xs text-white/60">Lifetime lessons learned</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-xl hover:bg-black/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Intensity</CardTitle>
            <TrendingUp className="h-4 w-4 text-secondary drop-shadow-[0_0_8px_rgba(var(--secondary),0.5)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white drop-shadow-sm">{stats.last7Days}</div>
            <p className="text-xs text-white/60">Failures this week</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-xl hover:bg-black/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Recovery Pulse</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white drop-shadow-sm">
              {stats.daysSinceLast === 0 ? "Today" : `${stats.daysSinceLast} days ago`}
            </div>
            <p className="text-xs text-white/60">Since your last attempt</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" />
              Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.breakdown.map((item) => (
              <div key={item.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-white/80 flex items-center gap-2">
                    <span>{item.icon}</span>
                    {item.label}
                  </span>
                  <span className="text-white/40">{item.count}</span>
                </div>
                <Progress value={item.percentage} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Smile className="w-5 h-5 text-yellow-400" />
              Mood Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="space-y-1">
                <span className="text-xs text-white/40 uppercase tracking-wider font-bold">Latest Setback</span>
                <p className="text-lg font-bold text-white">{stats.recoveryTime}</p>
              </div>
              <Clock className="w-8 h-8 text-primary/40" />
            </div>

            {stats.worstCategory && (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-red-400/10 border border-red-400/20">
                <div className="space-y-1">
                  <span className="text-xs text-red-400/60 uppercase tracking-wider font-bold">Hardest Challenge</span>
                  <p className="text-lg font-bold text-white">{stats.worstCategory.label}</p>
                </div>
                <span className="text-3xl">{stats.worstCategory.icon}</span>
              </div>
            )}

            <div className="flex justify-between items-center px-2">
                {MOOD_OPTIONS.map(mood => (
                  <div key={mood.value} className="flex flex-col items-center gap-1">
                    <span className="text-xl">{mood.emoji}</span>
                    <span className="text-[10px] text-white/40">{stats.moodCounts[mood.value] || 0}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

