"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Trash2, Filter } from "lucide-react";
import { useTimelineStore } from "@/lib/store/timelineStore";
import { useCategoryStore } from "@/lib/store/categoryStore";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { MOOD_OPTIONS } from "@/lib/types/failure";
import { cn } from "@/lib/utils";

export function TimelineList() {
  const { failures, removeFailure } = useTimelineStore();
  const { categories } = useCategoryStore();
  const [filterCategory, setFilterCategory] = useState<string | "all">("all");

  const filteredFailures = useMemo(() => {
    let result = failures;
    if (filterCategory !== "all") {
      result = result.filter(f => f.category_id === filterCategory);
    }
    return [...result].sort((a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime());
  }, [failures, filterCategory]);

  if (failures.length === 0) {
    return (
      <div className="text-center py-20 px-4 bg-black/20 rounded-3xl border border-white/5 backdrop-blur-sm w-full max-w-4xl">
        <p className="text-white/40 text-lg">No resilience records yet. Time for a new attempt?</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-4xl">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-bold text-white drop-shadow-sm">Timeline</h2>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white/70">
              <Filter className="w-4 h-4 mr-2" />
              {filterCategory === "all" ? "All Categories" : categories.find(c => c.id === filterCategory)?.label}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 glass border-white/10 p-2">
            <div className="flex flex-col gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="justify-start text-white/70"
                onClick={() => setFilterCategory("all")}
              >
                All Categories
              </Button>
              {categories.map(cat => (
                <Button 
                  key={cat.id}
                  variant="ghost" 
                  size="sm" 
                  className="justify-start text-white/70"
                  onClick={() => setFilterCategory(cat.id)}
                >
                  <span className="mr-2">{cat.icon}</span>
                  {cat.label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {filteredFailures.map((failure, index) => {
            const category = categories.find(c => c.id === failure.category_id);
            const mood = MOOD_OPTIONS.find(m => m.value === failure.mood);
            
            return (
              <motion.div
                key={failure.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="group relative flex flex-col gap-3 p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-lg hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-xl bg-opacity-20", category?.color || "bg-primary/20 text-white")}>
                      <span className="text-2xl">{category?.icon || "📅"}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg leading-tight">{failure.title || "Untitled Failure"}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium text-white/40">
                          {format(new Date(failure.occurred_at), "MMM d, yyyy • h:mm a")}
                        </span>
                        <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10 text-white/30 px-1 py-0 h-4 min-w-4 flex items-center justify-center">
                          #{failures.length - index}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-2xl leading-none" title={mood?.label}>{mood?.emoji || "😐"}</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <div 
                            key={s} 
                            className={cn(
                              "w-1 h-3 rounded-full",
                              s <= (failure.severity || 0) ? "bg-primary" : "bg-white/10"
                            )} 
                          />
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeFailure(failure.id)}
                      className="opacity-0 group-hover:opacity-100 text-destructive/50 hover:text-destructive hover:bg-destructive/10 transition-all ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {failure.description && (
                  <p className="text-sm text-white/70 leading-relaxed pl-14">
                    {failure.description}
                  </p>
                )}

                {(failure.lesson || failure.action_plan || (failure.tags && failure.tags.length > 0)) && (
                  <div className="pl-14 pt-2 flex flex-wrap gap-2">
                    {failure.tags?.map(tag => (
                      <span key={tag} className="text-[10px] text-primary/70 font-mono bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">#{tag}</span>
                    ))}
                    {failure.lesson && (
                      <div className="w-full mt-2 p-3 rounded-xl bg-primary/5 border border-primary/10">
                        <span className="text-[10px] uppercase font-bold text-primary/40 block mb-1 tracking-wider">Lesson learned</span>
                        <p className="text-sm italic text-white/90">"{failure.lesson}"</p>
                      </div>
                    )}
                    {failure.action_plan && (
                      <div className="w-full mt-1 p-3 rounded-xl bg-secondary/5 border border-secondary/10">
                        <span className="text-[10px] uppercase font-bold text-secondary/40 block mb-1 tracking-wider">Action plan</span>
                        <p className="text-sm text-white/90">{failure.action_plan}</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

