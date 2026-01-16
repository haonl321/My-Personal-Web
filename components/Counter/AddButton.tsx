import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddButtonProps {
  onClick: () => void;
}

export function AddButton({ onClick }: AddButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative group"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200" />
      <Button
        size="lg"
        onClick={onClick}
        className="relative w-24 h-24 rounded-full bg-black/30 backdrop-blur-md border border-primary/50 hover:bg-primary/20 text-primary shadow-2xl flex items-center justify-center p-0 transition-all duration-300"
      >
        <Plus className="w-12 h-12" />
      </Button>
    </motion.div>
  );
}
