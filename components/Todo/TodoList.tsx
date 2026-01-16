"use client"

import { TodoTask, Priority } from "@/lib/types/todo";
import { TodoItem } from "./TodoItem";
import { motion, AnimatePresence } from "framer-motion";
import { useTodoStore } from "@/lib/store/todoStore";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface TodoListProps {
  filter: 'today' | 'upcoming' | 'overdue' | 'completed' | 'all';
  searchQuery?: string;
  sortBy?: 'due' | 'priority' | 'created';
}

export function TodoList({ filter, searchQuery = '', sortBy = 'due' }: TodoListProps) {
  const { tasks } = useTodoStore();

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Search
    if (searchQuery) {
      result = result.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter
    const today = new Date().toISOString().split('T')[0];
    switch (filter) {
      case 'today':
        result = result.filter(t => t.due_date === today && !t.is_completed);
        break;
      case 'upcoming':
        result = result.filter(t => t.due_date && t.due_date > today && !t.is_completed);
        break;
      case 'overdue':
        result = result.filter(t => t.due_date && t.due_date < today && !t.is_completed);
        break;
      case 'completed':
        result = result.filter(t => t.is_completed);
        break;
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityScore = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityScore[b.priority] - priorityScore[a.priority];
      }
      if (sortBy === 'due') {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return result;
  }, [tasks, filter, searchQuery, sortBy]);

  // Group by priority for "Today" view as requested in UI design
  const groupedTasks = useMemo(() => {
    if (filter !== 'today') return { all: filteredTasks };
    
    return {
      urgent: filteredTasks.filter(t => t.priority === 'urgent'),
      high: filteredTasks.filter(t => t.priority === 'high'),
      medium: filteredTasks.filter(t => t.priority === 'medium'),
      low: filteredTasks.filter(t => t.priority === 'low'),
    };
  }, [filteredTasks, filter]);

  if (filteredTasks.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-24 bg-black/20 backdrop-blur-3xl rounded-[2rem] border border-white/10 shadow-2xl"
      >
        <p className="text-white font-bold text-lg drop-shadow-lg uppercase tracking-widest opacity-80">
          Chưa có công việc nào trong danh sách.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-10">
      <AnimatePresence mode="popLayout" initial={false}>
        {filter === 'today' ? (
          <>
            {Object.entries(groupedTasks).map(([priority, typedTasks]) => {
              const tasksList = typedTasks as TodoTask[];
              if (tasksList.length === 0) return null;
              return (
                <div key={priority} className="space-y-4">
                  <h2 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-3">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      priority === 'urgent' ? "bg-red-400" : 
                      priority === 'high' ? "bg-orange-400" : 
                      priority === 'medium' ? "bg-yellow-400" : "bg-blue-400"
                    )} />
                    {priority} ({tasksList.length})
                  </h2>
                  <div className="grid gap-3">
                    {tasksList.map((task: TodoTask) => (
                      <TodoItem key={task.id} task={task} />
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="grid gap-3">
            {filteredTasks.map(task => (
              <TodoItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
