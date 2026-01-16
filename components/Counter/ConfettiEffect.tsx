import confetti from "canvas-confetti";
import { useEffect } from "react";
import { useCounterStore } from "@/lib/store/counterStore";

// Milestones from Meet the Robinsons theme or arbitrary goals
const MILESTONES = [10, 25, 50, 75, 100, 124];

export function ConfettiEffect() {
  const { count } = useCounterStore();

  useEffect(() => {
    if (MILESTONES.includes(count)) {
      triggerConfetti();
    }
  }, [count]);

  const triggerConfetti = () => {
    const end = Date.now() + 3 * 1000;
    const colors = ["#ff0000", "#ffa500", "#ffff00", "#008000", "#0000ff", "#4b0082", "#ee82ee"];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  return null; // This component handles side effects only
}
