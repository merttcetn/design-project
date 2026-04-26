"use client";

import { motion } from "framer-motion";

type ProgressBarProps = {
  progress: number;
};

export function ProgressBar({ progress }: ProgressBarProps) {
  const boundedProgress = Math.max(0, Math.min(progress, 1));

  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-border">
      <motion.div
        className="relative h-full rounded-full bg-primary shadow-glow"
        initial={false}
        animate={{ width: `${boundedProgress * 100}%` }}
        transition={{ duration: 0.28, ease: "easeOut" }}
      >
        <div className="absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-white/25" />
      </motion.div>
    </div>
  );
}
