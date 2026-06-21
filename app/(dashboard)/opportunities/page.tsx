"use client";

import { useState } from "react";
import { useOpportunitiesStore } from "@/lib/store/opportunitiesStore";
import { AddOpportunityModal } from "@/components/Opportunities/AddOpportunityModal";
import { OpportunityList } from "@/components/Opportunities/OpportunityList";
import { OpportunityChart } from "@/components/Opportunities/OpportunityChart";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Plus, BarChart3, Clock, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function OpportunitiesDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const { opportunities } = useOpportunitiesStore();

  const count = opportunities.length;

  return (
    <div className="w-full flex flex-col items-center justify-center gap-8 relative pb-20">
      
      {/* Header */}
      <header className="text-center space-y-4 max-w-2xl">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl uppercase tracking-wider text-pop"
        >
          Cơ hội bị bỏ lỡ
        </motion.h1>
        <p className="text-white/70 text-lg italic">
          "Cơ hội thứ hai thường được tạo ra khi ta rút được bài học sâu sắc từ cơ hội đầu tiên bị bỏ lỡ."
        </p>
      </header>

      {/* Stats Counter & Controls */}
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        
        {/* Count Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-dark p-8 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col items-center justify-center gap-4 relative overflow-hidden"
        >
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/20 border border-yellow-400/30 text-[10px] font-black text-yellow-400 uppercase tracking-widest">
            <AlertTriangle className="w-3.5 h-3.5" /> Inaction
          </div>
          <span className="text-white/50 text-xs font-black uppercase tracking-[0.2em]">Tổng số lần bỏ lỡ</span>
          <span className="text-8xl font-black text-yellow-400 font-mono drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]">
            {count}
          </span>
          <Button 
            onClick={() => setModalOpen(true)}
            className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold px-8 py-6 rounded-2xl shadow-xl shadow-yellow-400/10 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-wider"
          >
            <Plus className="w-5 h-5 mr-2" /> Ghi nhận bỏ lỡ
          </Button>
        </motion.div>

        {/* Navigation & Actions */}
        <div className="flex flex-col gap-4 justify-between h-full">
          
          <Link href="/opportunities/stats" className="w-full flex-1">
            <motion.div
              whileHover={{ x: 6 }}
              className="glass p-6 rounded-[2rem] border border-white/10 flex items-center justify-between h-full group hover:border-yellow-400/30 transition-all cursor-pointer shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-yellow-400/10 flex items-center justify-center text-yellow-400">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white tracking-wide uppercase">Thống kê nguyên nhân</h3>
                  <p className="text-sm text-white/50">Xem biểu đồ tỷ lệ sợ hãi, trì hoãn...</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-yellow-400 transition-colors" />
            </motion.div>
          </Link>

          <Link href="/opportunities/timeline" className="w-full flex-1">
            <motion.div
              whileHover={{ x: 6 }}
              className="glass p-6 rounded-[2rem] border border-white/10 flex items-center justify-between h-full group hover:border-yellow-400/30 transition-all cursor-pointer shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Clock className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white tracking-wide uppercase">Dòng thời gian chi tiết</h3>
                  <p className="text-sm text-white/50">Xem lại bài học và kế hoạch cải thiện...</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
            </motion.div>
          </Link>
          
        </div>
      </div>

      {/* Quick overview of chart */}
      {count > 0 && (
        <div className="w-full flex flex-col items-center gap-6 mt-4">
          <OpportunityChart />
        </div>
      )}

      <AddOpportunityModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
