"use client"

import { useState } from "react";
import { TodoList } from "@/components/Todo/TodoList";
import { AddTodoModal } from "@/components/Todo/AddTodoModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Plus, Search, Settings, Filter, Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { useTodoStore } from "@/lib/store/todoStore";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function TodoPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<'today' | 'upcoming' | 'overdue' | 'completed' | 'all'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { tasks } = useTodoStore();
  
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.due_date === today);
  const completedToday = todayTasks.filter(t => t.is_completed).length;
  const progress = todayTasks.length > 0 ? (completedToday / todayTasks.length) * 100 : 0;

  return (
    <div className="w-full space-y-8 pb-32">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white flex items-center gap-3 drop-shadow-2xl">
            <CheckCircle2 className="w-10 h-10 text-secondary" />  Todo List
          </h1>
          <p className="text-white font-bold drop-shadow-md bg-black/20 px-3 py-1 rounded-full inline-block backdrop-blur-sm">
            {filter === 'today' ? `Hôm nay (${format(new Date(), "dd/MM/yyyy")})` : filter.charAt(0).toUpperCase() + filter.slice(1)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-secondary transition-colors" />
            <Input 
              placeholder="Tìm kiếm task..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-48 lg:w-64 bg-black/20 border-white/20 focus:border-secondary/50 focus:w-80 transition-all text-white placeholder:text-white/40"
            />
          </div>
          <Button variant="outline" size="icon" className="glass border-white/10 hover:bg-white/20 text-white">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Main Action & Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 glass-dark rounded-[2rem] border border-white/10 shadow-2xl">
        <div className="flex flex-wrap items-center gap-2">
          <FilterButton active={filter === 'today'} onClick={() => setFilter('today')} label="Today" />
          <FilterButton active={filter === 'upcoming'} onClick={() => setFilter('upcoming')} label="Upcoming" />
          <FilterButton active={filter === 'overdue'} onClick={() => setFilter('overdue')} label="Overdue" />
          <FilterButton active={filter === 'completed'} onClick={() => setFilter('completed')} label="Completed" />
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} label="All" />
        </div>

        <Button 
          onClick={() => setModalOpen(true)}
          className="bg-secondary text-white hover:bg-secondary/90 px-8 h-12 rounded-2xl shadow-xl shadow-secondary/20 font-bold transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" /> Thêm task mới
        </Button>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <TodoList filter={filter} searchQuery={searchQuery} />
        </div>

        {/* Sidebar / Stats */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-dark p-8 rounded-[2rem] shadow-2xl space-y-6 sticky top-24"
          >
            <div className="space-y-4">
              <h3 className="text-lg font-black text-white tracking-widest uppercase text-pop">Progress Today</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-black text-white text-pop">
                  <span>Completed</span>
                  <span>{completedToday}/{todayTasks.length}</span>
                </div>
                <div className="h-6 bg-black/30 rounded-full overflow-hidden p-1 border border-white/10">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-secondary rounded-full shadow-[0_0_15px_rgba(var(--secondary),0.8)]" 
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between p-4 rounded-3xl bg-black/20 border border-white/10 shadow-inner">
                  <div className="space-y-1">
                    <span className="text-[10px] text-white font-black tracking-widest uppercase opacity-70">Efficiency</span>
                    <p className="text-xl font-bold text-white text-pop">84%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-secondary" />
               </div>
               
               <Link href="/todos/calendar" className="flex items-center justify-between p-4 rounded-3xl bg-primary/20 border border-primary/40 hover:bg-primary/30 transition-all group shadow-lg">
                  <div className="space-y-1">
                    <span className="text-[10px] text-primary font-black uppercase tracking-widest drop-shadow-sm">Calendar</span>
                    <p className="text-lg font-bold text-white text-pop">View Schedule</p>
                  </div>
                  <CalendarIcon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
               </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <AddTodoModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}

function FilterButton({ active, onClick, label }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all drop-shadow-sm",
        active 
          ? "bg-secondary text-white shadow-[0_0_20px_rgba(var(--secondary),0.4)]" 
          : "text-white/70 hover:text-white hover:bg-white/10"
      )}
    >
      {label}
    </button>
  );
}

import { TrendingUp } from "lucide-react";
import Link from "next/link";
