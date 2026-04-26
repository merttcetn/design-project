"use client";

import { motion } from "framer-motion";
import { Check, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenShell } from "@/components/ScreenShell";
import { getFloorLabel, getNodeById, getNodeTitle } from "@/data/nodes";
import { useNavigationFlow } from "@/state/navigation-context";

export default function ArrivalScreen() {
  const router = useRouter();
  const { goalId, route, nodes, resetAll } = useNavigationFlow();
  const goalNode = getNodeById(nodes, goalId);

  useEffect(() => {
    if (!goalId) {
      router.replace("/");
    }
  }, [goalId, router]);

  if (!goalNode) {
    return null;
  }

  function handleNewSearch() {
    resetAll();
    router.replace("/");
  }

  return (
    <ScreenShell
      contentClassName="items-center justify-center"
      footer={
        <PrimaryButton
          title="Yeni Arama Yap"
          onClick={handleNewSearch}
          icon={<RefreshCw size={19} />}
        />
      }
    >
      <div className="relative flex size-36 items-center justify-center">
        <motion.div
          className="absolute size-36 rounded-full border-2 border-success"
          animate={{ opacity: [0.3, 0, 0.3], scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="flex size-36 items-center justify-center rounded-full bg-success-soft shadow-[0_0_40px_rgba(27,122,78,0.20),0_0_80px_rgba(27,122,78,0.10)]"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 10, stiffness: 140 }}
        >
          <div className="flex size-28 items-center justify-center rounded-full bg-success">
            <Check size={52} strokeWidth={3} className="text-surface" />
          </div>
        </motion.div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4, type: "spring" }}
        className="flex flex-col items-center gap-2 text-center"
      >
        <h1 className="text-[34px] font-bold leading-10 text-ink">
          Hedefinize ulaştınız
        </h1>
        <p className="text-xl font-semibold leading-[27px] text-success">
          {getNodeTitle(goalNode)}
        </p>
        <p className="text-base leading-[22px] text-muted-light">
          {getFloorLabel(goalNode.kat)}
        </p>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4, type: "spring" }}
        className="w-full rounded-[20px] bg-surface p-4 shadow-panel"
      >
        <p className="text-xs font-bold uppercase leading-4 text-muted-light">
          Rota özeti
        </p>
        <p className="pt-1 text-[17px] font-semibold leading-[23px] text-ink">
          {route?.instructions.length
            ? `${route.instructions.length} adım tamamlandı.`
            : "Hedef konumdasınız."}
        </p>
      </motion.div>
    </ScreenShell>
  );
}
