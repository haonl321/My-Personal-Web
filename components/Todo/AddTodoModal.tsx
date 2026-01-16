"use client"

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTodoStore } from '@/lib/store/todoStore';
import { PRIORITY_OPTIONS, Priority, TodoTask, DEFAULT_TODO_CATEGORIES } from '@/lib/types/todo';
import { Calendar as CalendarIcon, Clock, Flag, Tag, ListTodo, RotateCcw, Bell, Plus, Minus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AddTodoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTodoModal({ open, onOpenChange }: AddTodoModalProps) {
  const { addTask } = useTodoStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '12:00',
    priority: 'medium' as Priority,
    categoryId: DEFAULT_TODO_CATEGORIES[0].id,
    tags: '',
    estimatedTime: 30,
    isRecurring: false,
    setReminder: false
  });

  const [newSubtask, setNewSubtask] = useState('');

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '12:00',
      priority: 'medium',
      categoryId: DEFAULT_TODO_CATEGORIES[0].id,
      tags: '',
      estimatedTime: 30,
      isRecurring: false,
      setReminder: false
    });
  };



  const handleSave = (shouldContinue = false) => {
    if (!formData.title.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    const newTask: TodoTask = {
      id: crypto.randomUUID(),
      user_id: 'user_1',
      title: formData.title,
      description: formData.description,
      is_completed: false,
      due_date: formData.dueDate,
      due_time: formData.dueTime,
      priority: formData.priority,
      category_id: formData.categoryId,
      tags: [],
      estimated_time: formData.estimatedTime,
      is_recurring: formData.isRecurring,
      reminders: formData.setReminder ? [new Date().toISOString()] : [],
      subtasks: [],
      attachments: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    addTask(newTask);
    toast.success("Task added successfully!");

    if (shouldContinue) {
      resetForm();
    } else {
      onOpenChange(false);
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto glass-dark border-white/20 p-0 gap-0">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-3xl font-black text-white flex items-center gap-3">
            <Plus className="w-8 h-8 text-secondary" /> Thêm Task Mới
          </DialogTitle>
        </DialogHeader>

        <div className="p-8 pt-0 space-y-8">
          {/* Main Title Input */}
          <div className="space-y-2">
            <Label className="text-lg font-bold text-white/90">Tiêu đề</Label>
            <Input 
              placeholder="Bạn định làm gì?" 
              value={formData.title}
              onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
              className="text-xl h-14 bg-black/20 border-white/10 focus:border-secondary/50 transition-all font-medium text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-white/70"><CalendarIcon className="w-4 h-4" /> Due Date</Label>
                <Input 
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(p => ({ ...p, dueDate: e.target.value }))}
                  className="bg-black/20 border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-white/70"><Clock className="w-4 h-4" /> Time</Label>
                <Input 
                  type="time"
                  value={formData.dueTime}
                  onChange={(e) => setFormData(p => ({ ...p, dueTime: e.target.value }))}
                  className="bg-black/20 border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-white/70"><Flag className="w-4 h-4" /> Priority</Label>
                <div className="grid grid-cols-2 gap-2">
                  {PRIORITY_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setFormData(p => ({ ...p, priority: opt.value }))}
                      className={cn(
                        "flex items-center justify-center gap-2 p-3 rounded-xl border transition-all text-xs font-bold uppercase tracking-widest",
                        formData.priority === opt.value 
                          ? `${opt.color} text-white border-white/20 shadow-lg scale-105` 
                          : "bg-black/20 border-white/5 text-white/40 hover:bg-black/40"
                      )}
                    >
                      <span>{opt.icon}</span> {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-white/70"><Tag className="w-4 h-4" /> Category</Label>
                <select 
                  className="w-full h-10 px-3 rounded-md bg-black/20 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-secondary/50"
                  value={formData.categoryId}
                  onChange={(e) => setFormData(p => ({ ...p, categoryId: e.target.value }))}
                >
                  {DEFAULT_TODO_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                  ))}
                </select>
              </div>



              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-white/70"><Clock className="w-4 h-4" /> Estimated Time (minutes)</Label>
                <Input 
                  type="number"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData(p => ({ ...p, estimatedTime: parseInt(e.target.value) || 0 }))}
                  className="bg-black/20 border-white/10 text-white"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white/70">Description</Label>
            <Textarea 
              placeholder="Chi tiết công việc..." 
              value={formData.description}
              onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
              className="bg-black/20 border-white/10 min-h-[100px] text-white"
            />
          </div>



          {/* Toggles */}
          <div className="flex flex-wrap gap-6 pt-4 border-t border-white/5">
            <button 
              onClick={() => setFormData(p => ({ ...p, setReminder: !p.setReminder }))}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-xs font-bold",
                formData.setReminder ? "bg-yellow-400/20 border-yellow-400/50 text-yellow-400" : "bg-white/5 border-white/5 text-white/40"
              )}
            >
              <Bell className="w-4 h-4" /> Set Reminder
            </button>
            <button 
              onClick={() => setFormData(p => ({ ...p, isRecurring: !p.isRecurring }))}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-xs font-bold",
                formData.isRecurring ? "bg-blue-400/20 border-blue-400/50 text-blue-400" : "bg-white/5 border-white/5 text-white/40"
              )}
            >
              <RotateCcw className="w-4 h-4" /> Recurring Task
            </button>
          </div>
        </div>

        <DialogFooter className="p-8 pt-4 flex flex-col sm:flex-row justify-between items-center bg-black/40 border-t border-white/10 gap-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-white/40 hover:text-white order-2 sm:order-1 w-full sm:w-auto">
            Cancel
          </Button>
          <div className="flex gap-3 w-full sm:w-auto order-1 sm:order-2">
            <Button 
              variant="outline" 
              onClick={() => handleSave(true)}
              className="flex-1 sm:flex-none border-secondary/50 text-secondary hover:bg-secondary/10"
            >
              Save & Add More
            </Button>
            <Button onClick={() => handleSave(false)} className="flex-1 sm:flex-none bg-secondary text-white hover:bg-secondary/90 shadow-xl shadow-secondary/20">
              Save Task
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
