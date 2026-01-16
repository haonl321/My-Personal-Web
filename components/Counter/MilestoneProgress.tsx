import { Progress } from "@/components/ui/progress";
import { useCounterStore } from "@/lib/store/counterStore";
import { useMemo } from "react";

const MILESTONES = [10, 25, 50, 75, 100, 124, 200, 500, 1000];

export function MilestoneProgress() {
  const { count } = useCounterStore();

  const nextMilestone = useMemo(() => {
    return MILESTONES.find(m => m > count) || MILESTONES[MILESTONES.length - 1];
  }, [count]);

  const prevMilestone = useMemo(() => {
    // Find the largest milestone smaller than current count
    const found = [...MILESTONES].reverse().find(m => m <= count);
    return found || 0;
  }, [count]);

  const progress = useMemo(() => {
    if (count >= MILESTONES[MILESTONES.length - 1]) return 100;
    // Calculate progress between prev and next milestone
    const totalDetails = nextMilestone - prevMilestone;
    const currentDetails = count - prevMilestone;
    return (currentDetails / totalDetails) * 100;
  }, [count, nextMilestone, prevMilestone]);

  return (
    <div className="w-full max-w-xs mt-8 space-y-2">
      <div className="flex justify-between text-xs text-white/90 drop-shadow-md uppercase tracking-wider font-semibold">
        <span>Level {prevMilestone}</span>
        <span>Goal: {nextMilestone}</span>
      </div>
      <Progress value={progress} className="h-2 bg-white/20 backdrop-blur-sm" indicatorClassName="bg-gradient-to-r from-primary to-secondary" />
      <p className="text-center text-xs text-white/80 drop-shadow mt-2">
        {nextMilestone - count} more failures to next breakthrough!
      </p>
    </div>
  );
}
