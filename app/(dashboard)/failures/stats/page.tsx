"use client"

import { StatsOverview } from "@/components/Stats/StatsOverview";
import { FailureChart } from "@/components/Stats/FailureChart";
import { motion } from "framer-motion";

export default function StatsPage() {
  return (
    <div className="w-full flex flex-col items-center gap-8">
      <div className="text-center space-y-2">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white drop-shadow-md"
        >
          Data of Persistance
        </motion.h1>
         <p className="text-lg text-white/80 drop-shadow-sm font-medium italic">
          "The only real mistake is the one from which we learn nothing."
        </p>
      </div>

      <StatsOverview />
      <FailureChart />
    </div>
  );
}
