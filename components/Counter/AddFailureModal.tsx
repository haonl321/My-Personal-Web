"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CategorySelector } from '@/components/ui/CategorySelector';
import { MoodSelector } from '@/components/ui/MoodSelector';
import { Mood, DetailedFailureEntry, DEFAULT_CATEGORIES } from '@/lib/types/failure';
import { useCounterStore } from '@/lib/store/counterStore';
import { useTimelineStore } from '@/lib/store/timelineStore';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AddFailureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

import { useUser } from '@clerk/nextjs';

export function AddFailureModal({ open, onOpenChange }: AddFailureModalProps) {
  const { user } = useUser();
  const { increment, count } = useCounterStore();
  const { addFailure } = useTimelineStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: DEFAULT_CATEGORIES[0].id,
    mood: 'neutral' as Mood,
    severity: 3,
    lesson: '',
    actionPlan: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      categoryId: DEFAULT_CATEGORIES[0].id,
      mood: 'neutral',
      severity: 3,
      lesson: '',
      actionPlan: '',
    });
  };

  const handleSave = (shouldContinue = false) => {
    if (!formData.title) {
      toast.error("Please enter a title");
      return;
    }

    const newEntry: DetailedFailureEntry = {
      id: crypto.randomUUID(),
      user_id: user?.id || 'anonymous',
      count: count + 1,
      occurred_at: new Date().toISOString(),
      category_id: formData.categoryId,
      title: formData.title,
      description: formData.description,
      mood: formData.mood,
      severity: formData.severity,
      tags: [],
      lesson: formData.lesson,
      action_plan: formData.actionPlan,
    };

    addFailure(newEntry);
    toast.success("Resilience entry saved!");

    if (shouldContinue) {
      resetForm();
    } else {
      onOpenChange(false);
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass border-white/20 p-0 gap-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-white drop-shadow-md">Thêm Thất Bại Mới</DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">Danh mục</Label>
                <CategorySelector 
                  value={formData.categoryId} 
                  onChange={(val) => setFormData(prev => ({ ...prev, categoryId: val }))} 
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Tiêu đề</Label>
                <Input 
                  placeholder="Hôm nay có chuyện gì..." 
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Mô tả chi tiết</Label>
                <Textarea 
                  placeholder="Ghi lại hoàn cảnh..." 
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">Mood</Label>
                <MoodSelector 
                  value={formData.mood} 
                  onChange={(val) => setFormData(prev => ({ ...prev, mood: val }))} 
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Độ nghiêm trọng (Severity)</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, severity: star }))}
                    >
                      <Star 
                        className={cn(
                          "w-6 h-6 transition-colors",
                          star <= formData.severity ? "text-yellow-400 fill-yellow-400" : "text-white/20"
                        )} 
                      />
                    </button>
                  ))}
                </div>
              </div>


            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white/80">Bài học rút ra</Label>
              <Textarea 
                placeholder="Tôi học được gì từ việc này?" 
                value={formData.lesson}
                onChange={(e) => setFormData(prev => ({ ...prev, lesson: e.target.value }))}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80">Kế hoạch hành động (Action plan)</Label>
              <Textarea 
                placeholder="Lần sau tôi sẽ làm khác như thế nào?" 
                value={formData.actionPlan}
                onChange={(e) => setFormData(prev => ({ ...prev, actionPlan: e.target.value }))}
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-0 flex sm:justify-between items-center bg-black/20">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-white/60 hover:text-white">
            Hủy
          </Button>
          <Button onClick={() => handleSave(false)} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
