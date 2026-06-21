"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Trash2, Filter, Star } from "lucide-react";
import { useOpportunitiesStore } from "@/lib/store/opportunitiesStore";
import { REASON_OPTIONS, OpportunityReason } from "@/lib/types/opportunity";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function OpportunityList() {
  const { opportunities, removeOpportunity } = useOpportunitiesStore();
  const [filterReason, setFilterReason] = useState<string | "all">("all");

  const filteredOpportunities = useMemo(() => {
    let result = opportunities;
    if (filterReason !== "all") {
      result = result.filter(o => o.reason === filterReason);
    }
    return [...result].sort((a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime());
  }, [opportunities, filterReason]);

  if (opportunities.length === 0) {
    return (
      <div className="text-center py-20 px-4 bg-black/20 rounded-3xl border border-white/5 backdrop-blur-sm w-full max-w-4xl">
        <p className="text-white/40 text-lg">Chưa ghi nhận cơ hội nào bị bỏ lỡ. Rất tốt! Tiếp tục phát huy nhé! 🚀</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-4xl">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-bold text-white drop-shadow-sm">Dòng thời gian cơ hội bỏ lỡ</h2>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white/70">
              <Filter className="w-4 h-4 mr-2" />
              {filterReason === "all" ? "Tất cả lý do" : REASON_OPTIONS.find(r => r.value === filterReason)?.label.split(' / ')[0]}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 glass border-white/10 p-2">
            <div className="flex flex-col gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="justify-start text-white/70"
                onClick={() => setFilterReason("all")}
              >
                Tất cả lý do
              </Button>
              {REASON_OPTIONS.map(opt => (
                <Button 
                  key={opt.value}
                  variant="ghost" 
                  size="sm" 
                  className="justify-start text-white/70"
                  onClick={() => setFilterReason(opt.value)}
                >
                  <span className="mr-2">{opt.icon}</span>
                  {opt.label.split(' / ')[0]}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {filteredOpportunities.map((opp, index) => {
            const reasonOpt = REASON_OPTIONS.find(r => r.value === opp.reason);
            
            return (
              <motion.div
                key={opp.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="group relative flex flex-col gap-3 p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-lg hover:border-yellow-400/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-xl bg-opacity-20", reasonOpt?.color || "bg-yellow-500/20 text-white")}>
                      <span className="text-2xl">{reasonOpt?.icon || "⏳"}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg leading-tight">{opp.title || "Cơ hội không tên"}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium text-white/40">
                          {format(new Date(opp.occurred_at), "dd/MM/yyyy • h:mm a")}
                        </span>
                        <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10 text-white/30 px-1 py-0 h-4 min-w-4 flex items-center justify-center">
                          #{opportunities.length - index}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-white/40 uppercase tracking-widest font-black">Regret Level</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star 
                            key={s} 
                            className={cn(
                              "w-3.5 h-3.5",
                              s <= (opp.regret_level || 3) ? "text-yellow-400 fill-yellow-400" : "text-white/10"
                            )} 
                          />
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOpportunity(opp.id)}
                      className="opacity-0 group-hover:opacity-100 text-destructive/50 hover:text-destructive hover:bg-destructive/10 transition-all ml-2 h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {opp.description && (
                  <p className="text-sm text-white/70 leading-relaxed pl-14">
                    {opp.description}
                  </p>
                )}

                {(opp.lesson || opp.action_plan) && (
                  <div className="pl-14 pt-2 flex flex-col gap-2">
                    {opp.lesson && (
                      <div className="w-full p-3 rounded-xl bg-yellow-400/5 border border-yellow-400/10">
                        <span className="text-[10px] uppercase font-bold text-yellow-400/60 block mb-1 tracking-wider">Bài học rút ra</span>
                        <p className="text-sm italic text-white/90">"{opp.lesson}"</p>
                      </div>
                    )}
                    {opp.action_plan && (
                      <div className="w-full p-3 rounded-xl bg-emerald-400/5 border border-emerald-400/10">
                        <span className="text-[10px] uppercase font-bold text-emerald-400/60 block mb-1 tracking-wider">Kế hoạch cải thiện lần sau</span>
                        <p className="text-sm text-white/90">{opp.action_plan}</p>
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
