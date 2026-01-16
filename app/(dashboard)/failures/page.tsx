"use client"

import { CounterDisplay } from "@/components/Counter/CounterDisplay";
import { AddButton } from "@/components/Counter/AddButton";
import { ResetButton } from "@/components/Counter/ResetButton";
import { MilestoneProgress } from "@/components/Counter/MilestoneProgress";
import { ConfettiEffect } from "@/components/Counter/ConfettiEffect";
import { QuoteDisplay } from "@/components/Quotes/QuoteDisplay";
import { AddFailureModal } from "@/components/Counter/AddFailureModal";
import { motion } from "framer-motion";
import { useState } from "react";

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 relative">
      <div className="absolute top-10 right-10 flex flex-col items-center gap-2 group">
        <ResetButton />
        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest group-hover:text-white/60 transition-colors">Reset Counter</span>
      </div>

      <ConfettiEffect />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex justify-center text-pop"
      >
        <QuoteDisplay />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-dark w-full max-w-md aspect-square rounded-[3rem] flex flex-col items-center justify-center relative p-8 shadow-2xl border-white/20 ring-1 ring-white/10"
      >
        <CounterDisplay />
        
        <div className="absolute -bottom-10">
          <AddButton onClick={() => setModalOpen(true)} />
        </div>
      </motion.div>

      <div className="w-full flex flex-col items-center gap-6 mt-6 bg-black/20 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-xl">
        <MilestoneProgress />
      </div>

      <AddFailureModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
