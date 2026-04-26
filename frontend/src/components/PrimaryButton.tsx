"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/cn";

type PrimaryButtonProps = {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  variant?: "primary" | "secondary";
};

export function PrimaryButton({
  title,
  onClick,
  disabled = false,
  loading = false,
  icon,
  variant = "primary",
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;
  const isSecondary = variant === "secondary";

  return (
    <motion.button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", damping: 16, stiffness: 220 }}
      className={cn(
        "flex min-h-[60px] w-full items-center justify-center overflow-hidden rounded-[20px] px-6 text-[17px] font-semibold leading-[22px] transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        isSecondary
          ? "border border-border-strong bg-primary-light text-primary-dark"
          : "border-t border-white/15 bg-primary text-surface",
        isDisabled && "cursor-not-allowed opacity-45",
      )}
    >
      {loading ? (
        <span
          aria-label="Yükleniyor"
          className={cn(
            "size-5 animate-spin rounded-full border-2 border-current border-t-transparent",
            isSecondary ? "text-primary" : "text-surface",
          )}
        />
      ) : (
        <span className="flex items-center justify-center gap-2">
          {icon}
          {title}
        </span>
      )}
    </motion.button>
  );
}
