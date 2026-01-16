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
  const { reset } = useCounterStore();
  // We might not want to clear timeline on reset, just the counter? 
  // Usually "Reset" means start over towards the goal (124).
  // The timeline should probably persist to show history of failures over time.
  // We'll clarify: "Reset Counter" only.

  const handleReset = () => {
    reset();
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
          <DialogTitle>Reset Counter?</DialogTitle>
          <DialogDescription>
            This will reset your current failure count to 0. Your history will be preserved.
            "Keep moving forward!"
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
