import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { useCounterStore } from "@/lib/store/counterStore";

export function CounterDisplay() {
  const { count } = useCounterStore();
  
  const springCount = useSpring(count, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    springCount.set(count);
  }, [count, springCount]);

  const displayCount = useTransform(springCount, (latest) => Math.round(latest));

  return (
    <div className="flex flex-col items-center justify-center p-8 relative">
      <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
      <motion.h1 
        className="text-[10rem] font-bold leading-none text-white drop-shadow-2xl relative z-10 text-glow"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
      >
        <motion.span>{displayCount}</motion.span>
      </motion.h1>
      <p className="text-xl text-white/80 drop-shadow-md mt-4 font-medium uppercase tracking-widest">
        Failures
      </p>
    </div>
  );
}
