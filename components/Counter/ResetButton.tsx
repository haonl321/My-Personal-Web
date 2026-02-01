import { RotateCcw } from "lucide-react";
import { useCounterStore } from "@/lib/store/counterStore";
import { useTimelineStore } from "@/lib/store/timelineStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";

export function ResetButton() {
  const { clearAllFailures } = useTimelineStore();

  const handleReset = () => {
    clearAllFailures();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10 text-white/40 hover:text-red-400 hover:bg-black/60 hover:border-red-400/50 transition-all shadow-2xl backdrop-blur-xl">
          <RotateCcw className="w-8 h-8" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Counter & History?</DialogTitle>
          <DialogDescription>
            This will permanently delete ALL recorded failures from your history.
            "A clean slate for a fresh start!"
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={handleReset}>
              Reset
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
