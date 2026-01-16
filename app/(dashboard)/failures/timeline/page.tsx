"use client"

import { TimelineList } from "@/components/Timeline/TimelineList";
import { motion } from "framer-motion";

export default function TimelinePage() {
  return (
    <div className="w-full flex flex-col items-center gap-8">
      <div className="text-center space-y-2">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white drop-shadow-md"
        >
          History of Resilience
        </motion.h1>
        <p className="text-lg text-white/80 drop-shadow-sm font-medium">
          Every entry is a lesson learned.
        </p>
      </div>

      <div className="w-full flex justify-center">
        <TimelineList />
      </div>
    </div>
  );
}
