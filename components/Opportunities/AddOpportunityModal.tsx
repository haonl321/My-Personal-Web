"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ReasonSelector } from '@/components/ui/ReasonSelector';
import { OpportunityReason, MissedOpportunityEntry } from '@/lib/types/opportunity';
import { useOpportunitiesStore } from '@/lib/store/opportunitiesStore';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';

interface AddOpportunityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddOpportunityModal({ open, onOpenChange }: AddOpportunityModalProps) {
  const { user } = useUser();
  const { addOpportunity } = useOpportunitiesStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reason: 'procrastination' as OpportunityReason,
    regretLevel: 3,
    lesson: '',
    actionPlan: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      reason: 'procrastination',
      regretLevel: 3,
      lesson: '',
      actionPlan: '',
    });
  };

  const handleSave = () => {
    if (!formData.title) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }

    const newEntry: MissedOpportunityEntry = {
      id: crypto.randomUUID(),
      user_id: user?.id || 'anonymous',
      occurred_at: new Date().toISOString(),
      title: formData.title,
      description: formData.description,
      reason: formData.reason,
      regret_level: formData.regretLevel,
      lesson: formData.lesson,
      action_plan: formData.actionPlan,
    };

    addOpportunity(newEntry);
    toast.success("Cơ hội đã được ghi nhận. Hãy rút ra bài học nhé!");
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass border-white/20 p-0 gap-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-white drop-shadow-md">Ghi Nhận Cơ Hội Bị Bỏ Lỡ</DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">Tiêu đề cơ hội</Label>
                <Input 
                  placeholder="Ví dụ: Nộp đơn học bổng, ứng tuyển vị trí X..." 
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Chi tiết cơ hội là gì?</Label>
                <Textarea 
                  placeholder="Ghi lại thông tin cơ hội và tại sao nó quan trọng..." 
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-28"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">Nguyên nhân chính bỏ lỡ</Label>
                <ReasonSelector 
                  value={formData.reason} 
                  onChange={(val) => setFormData(prev => ({ ...prev, reason: val }))} 
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Mức độ tiếc nuối (Regret Level)</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, regretLevel: star }))}
                    >
                      <Star 
                        className={cn(
                          "w-6 h-6 transition-colors",
                          star <= formData.regretLevel ? "text-yellow-400 fill-yellow-400" : "text-white/20"
                        )} 
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white/80">Bài học rút ra</Label>
              <Textarea 
                placeholder="Tại sao bạn lại bỏ lỡ nó? Bạn học được gì?" 
                value={formData.lesson}
                onChange={(e) => setFormData(prev => ({ ...prev, lesson: e.target.value }))}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80">Kế hoạch khắc phục (Action plan)</Label>
              <Textarea 
                placeholder="Nếu cơ hội này quay lại hoặc có cơ hội tương đương, bạn sẽ làm gì?" 
                value={formData.actionPlan}
                onChange={(e) => setFormData(prev => ({ ...prev, actionPlan: e.target.value }))}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-0 flex sm:justify-between items-center bg-black/20">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-white/60 hover:text-white">
            Hủy
          </Button>
          <Button onClick={handleSave} className="bg-yellow-500 text-black hover:bg-yellow-600 font-bold px-6">
            Lưu cơ hội
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
