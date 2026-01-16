"use client"

import { TodoTask, PRIORITY_OPTIONS } from "@/lib/types/todo";
import { useTodoStore } from "@/lib/store/todoStore";
import { motion } from "framer-motion";
import { Check, Clock, Calendar, MoreVertical, Trash2, Edit2, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface TodoItemProps {
  task: TodoTask;
}

export function TodoItem({ task }: TodoItemProps) {
  const { toggleTask, deleteTask } = useTodoStore();
  const priority = PRIORITY_OPTIONS.find(p => p.value === task.priority);



  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        "group relative glass p-5 rounded-2xl border transition-all duration-300",
        task.is_completed ? "bg-white/5 border-white/5 opacity-60" : "bg-black/20 border-white/10 hover:border-secondary/30 shadow-xl"
      )}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={() => toggleTask(task.id)}
          className={cn(
            "mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0",
            task.is_completed 
              ? "bg-secondary border-secondary text-white" 
              : "bg-white/5 border-white/20 hover:border-secondary/50"
          )}
        >
          {task.is_completed && <Check className="w-4 h-4 stroke-[3]" />}
        </button>

        {/* Content */}
        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className={cn(
                "text-lg font-black text-white transition-all text-pop",
                task.is_completed && "line-through text-white/40"
              )}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-white font-medium line-clamp-1 text-pop">{task.description}</p>
              )}
            </div>
            
            <Badge className={cn("shrink-0 uppercase text-[10px] font-black tracking-tight shadow-lg", priority?.color, "text-white border-none")}>
              {task.priority}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            {task.due_date && (
              <div className={cn(
                "flex items-center gap-1.5",
                !task.is_completed && new Date(task.due_date) < new Date() ? "text-red-400 font-bold" : "text-white/80"
              )}>
                <Calendar className="w-3 h-3" />
                {format(new Date(task.due_date), "MMM d, yyyy")}
              </div>
            )}
            
            {task.due_time && (
              <div className="flex items-center gap-1.5 text-white/80">
                <Clock className="w-3 h-3" />
                {task.due_time}
              </div>
            )}


          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => deleteTask(task.id)}
            className="p-2 rounded-lg bg-red-400/10 text-red-400/50 hover:text-red-400 hover:bg-red-400/20 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
