"use client"

import { useUser } from "@clerk/nextjs";
import { Sparkles, CheckCircle, ArrowRight, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCounterStore } from "@/lib/store/counterStore";
import { useTodoStore } from "@/lib/store/todoStore";
import { useTimelineStore } from "@/lib/store/timelineStore";
import { useOpportunitiesStore } from "@/lib/store/opportunitiesStore";
import { differenceInDays } from "date-fns";

export default function HubPage() {
  const { user } = useUser();
  const { count } = useCounterStore();
  const { tasks } = useTodoStore();
  const { failures } = useTimelineStore();
  const { opportunities } = useOpportunitiesStore();

  const pendingTasks = tasks.filter(t => !t.is_completed).length;
  
  // Calculate failures this week
  const failuresThisWeek = failures.filter(f => 
    differenceInDays(new Date(), new Date(f.occurred_at)) <= 7
  ).length;

  // Calculate tasks completed today
  const tasksDoneToday = tasks.filter(t => 
    t.is_completed && 
    t.completed_at && 
    differenceInDays(new Date(), new Date(t.completed_at)) === 0
  ).length;

  // Calculate opportunities this week
  const opportunitiesCount = opportunities.length;
  const opportunitiesThisWeek = opportunities.filter(o => 
    differenceInDays(new Date(), new Date(o.occurred_at)) <= 7
  ).length;

  return (
    <div className="w-full max-w-4xl space-y-12">
      <header className="text-center space-y-4">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg"
        >
          Welcome back, <span className="text-primary">{user?.firstName || 'Hero'}</span>! 
        </motion.h1>
        <p className="text-white/70 text-lg italic">"Your destiny is what you make it."</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Failure Tracker Card */}
        <ModuleCard 
          title="FAILURE TRACKER"
          description={`${count} failures`}
          icon={<Sparkles className="w-12 h-12 text-primary" />}
          href="/failures"
          color="hover:border-primary/50"
          accent="bg-primary/10"
          stats={`${failuresThisWeek} this week`}
        />

        {/* Missed Opportunities Card */}
        <ModuleCard 
          title="OPPORTUNITIES"
          description={`${opportunitiesCount} missed`}
          icon={<Zap className="w-12 h-12 text-yellow-400" />}
          href="/opportunities"
          color="hover:border-yellow-400/50"
          accent="bg-yellow-400/10"
          stats={`${opportunitiesThisWeek} this week`}
        />

        {/* Todo List Card */}
        <ModuleCard 
          title="TODO LIST"
          description={`${pendingTasks} pending`}
          icon={<CheckCircle className="w-12 h-12 text-secondary" />}
          href="/todos"
          color="hover:border-secondary/50"
          accent="bg-secondary/10"
          stats={`${tasksDoneToday} done today`}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass p-8 rounded-[2rem] border border-white/10 flex flex-col md:flex-row justify-around items-center gap-8"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-white/50 text-sm font-bold uppercase tracking-widest">
            <TrendingUp className="w-4 h-4" /> Quick Stats
          </div>
          <p className="text-2xl font-bold text-white">Focus: Persistence</p>
        </div>

        <div className="h-12 w-px bg-white/10 hidden md:block" />

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-white/50 text-sm font-bold uppercase tracking-widest">
            <Zap className="w-4 h-4 text-yellow-400" /> Current Streak
          </div>
          <p className="text-2xl font-bold text-white">7 Days</p>
        </div>
      </motion.div>
    </div>
  );
}

function ModuleCard({ title, description, icon, href, color, accent, stats }: any) {
  return (
    <Link href={href}>
      <motion.div 
        whileHover={{ y: -10, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`glass-dark p-10 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 transition-all duration-300 relative overflow-hidden group ${color}`}
      >
        <div className={`absolute inset-0 ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        <div className="relative z-10 w-24 h-24 rounded-3xl bg-black/60 flex items-center justify-center shadow-inner">
          {icon}
        </div>
        
        <div className="relative z-10 text-center space-y-2">
          <h2 className="text-2xl font-black text-white tracking-wider text-pop">{title}</h2>
          <p className="text-white font-bold text-pop">{description}</p>
        </div>

        <div className="relative z-10 py-2 px-4 rounded-full bg-black/40 border border-white/20 text-xs font-black text-white uppercase tracking-tighter shadow-lg">
          {stats}
        </div>

        <div className="relative z-10 mt-2 flex items-center gap-2 text-primary font-black drop-shadow-lg group-hover:translate-x-2 transition-transform">
          Enter <ArrowRight className="w-4 h-4" />
        </div>
      </motion.div>
    </Link>
  );
}
