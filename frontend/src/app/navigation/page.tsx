"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { PrimaryButton } from "@/components/PrimaryButton";
import { ProgressBar } from "@/components/ProgressBar";
import { ScreenShell } from "@/components/ScreenShell";
import { StepCard } from "@/components/StepCard";
import { getNodeById, getNodeTitle } from "@/data/nodes";
import { useNavigationFlow } from "@/state/navigation-context";
import type { RouteResponse } from "@/types/route";

export default function NavigationScreen() {
  const router = useRouter();
  const { startId, goalId, route, currentIndex, completeStep } =
    useNavigationFlow();
  const [animating, setAnimating] = useState(false);

  const totalSteps = route?.instructions.length ?? 0;
  const activeInstruction = route?.instructions[currentIndex] ?? null;
  const startNode = getNodeById(startId);
  const goalNode = getNodeById(goalId);

  useEffect(() => {
    if (!route) {
      router.replace("/");
      return;
    }
    if (route.instructions.length === 0) {
      router.replace("/arrival");
    }
  }, [route, router]);

  const finishStep = useCallback(() => {
    setAnimating(false);

    if (currentIndex >= totalSteps - 1) {
      router.replace("/arrival");
      return;
    }

    completeStep();
  }, [completeStep, currentIndex, router, totalSteps]);

  function handleComplete() {
    if (animating) {
      return;
    }
    setAnimating(true);
  }

  if (!route || !activeInstruction) {
    return null;
  }

  const progress = totalSteps > 0 ? (currentIndex + 1) / totalSteps : 1;
  const nextInstructions = route.instructions.slice(
    currentIndex + 1,
    currentIndex + 3,
  );

  return (
    <ScreenShell
      footer={
        <PrimaryButton
          title={currentIndex >= totalSteps - 1 ? "Varışa Geç" : "Tamamlandı"}
          disabled={animating}
          onClick={handleComplete}
          icon={<Check size={20} />}
        />
      }
    >
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="flex items-center gap-3"
      >
        <button
          type="button"
          aria-label="Varış seçimine dön"
          onClick={() => router.replace("/destination")}
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface shadow-subtle transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:opacity-75"
        >
          <ArrowLeft size={20} className="text-ink" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[17px] font-semibold leading-[23px] text-ink">
            {getNodeTitle(startNode)} -&gt; {getNodeTitle(goalNode)}
          </p>
          <p className="text-[13px] leading-[18px] text-muted-light">
            {currentIndex + 1} / {totalSteps} adım
          </p>
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06, duration: 0.3 }}
      >
        <ProgressBar progress={progress} />
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.4, type: "spring" }}
        className="flex flex-col gap-3 pt-4"
      >
        <motion.div
          key={currentIndex}
          initial={{ opacity: 1, y: 0, scale: 1 }}
          animate={
            animating
              ? { opacity: 0, y: -520, scale: 0.96 }
              : { opacity: 1, y: 0, scale: 1 }
          }
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onAnimationComplete={() => {
            if (animating) {
              finishStep();
            }
          }}
        >
          <StepCard
            instruction={activeInstruction}
            displayText={getDisplayText(route, currentIndex)}
            stepNumber={currentIndex + 1}
            totalSteps={totalSteps}
          />
        </motion.div>

        <div className="flex flex-col gap-2">
          {nextInstructions.map((instruction, offset) => {
            const instructionIndex = currentIndex + offset + 1;
            return (
              <StepCard
                key={`${instruction.from_node}-${instruction.to_node}-${instruction.index}`}
                instruction={instruction}
                displayText={getDisplayText(route, instructionIndex)}
                stepNumber={instructionIndex + 1}
                totalSteps={totalSteps}
                preview
              />
            );
          })}
        </div>
      </motion.section>
    </ScreenShell>
  );
}

function getDisplayText(route: RouteResponse, index: number) {
  return (
    route.enhanced_instructions[index] ||
    route.instructions[index]?.instruction ||
    ""
  );
}
