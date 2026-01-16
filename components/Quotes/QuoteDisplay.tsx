import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { quotes } from "@/lib/constants/quotes";
import { useCounterStore } from "@/lib/store/counterStore";
import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function QuoteDisplay() {
  const { count } = useCounterStore();
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  // Update quote whenever count changes
  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(randomQuote);
  }, [count]);

  return (
    <div className="w-full max-w-lg relative">
      <Card className="border-none bg-transparent shadow-none">
        <CardContent className="pt-2 pb-2 px-6 relative flex items-center justify-center min-h-[60px]">
          <Quote className="absolute top-0 left-0 w-5 h-5 text-primary/30 -scale-x-100" />
          <Quote className="absolute bottom-0 right-0 w-5 h-5 text-primary/30" />
          
          <AnimatePresence mode="wait">
            <motion.p
              key={currentQuote} // Trigger animation when text changes
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-lg md:text-xl font-medium text-foreground italic text-center"
            >
              "{currentQuote}"
            </motion.p>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
