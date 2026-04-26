"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  MapPin,
  Navigation,
  SlidersHorizontal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { NodeSelector } from "@/components/NodeSelector";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenShell } from "@/components/ScreenShell";
import { getNodeById, getNodeSubtitle, getNodeTitle } from "@/data/nodes";
import { cn } from "@/lib/cn";
import { useNavigationFlow } from "@/state/navigation-context";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function DestinationScreen() {
  const router = useRouter();
  const {
    startId,
    goalId,
    nodes,
    nodesLoading,
    nodesError,
    avoidStairs,
    isLoading,
    error,
    setGoalId,
    setAvoidStairs,
    requestRoute,
  } = useNavigationFlow();
  const startNode = getNodeById(nodes, startId);

  useEffect(() => {
    if (!startId) {
      router.replace("/");
    }
  }, [router, startId]);

  if (!startId) {
    return null;
  }

  async function handleFindRoute() {
    // Navigate to loading screen immediately
    router.push("/loading");
  }

  return (
    <ScreenShell
      scroll
      footer={
        <PrimaryButton
          title="Yol Bul"
          loading={isLoading}
          disabled={
            !goalId || nodesLoading || Boolean(nodesError) || nodes.length === 0
          }
          onClick={handleFindRoute}
          icon={<Navigation size={19} />}
        />
      }
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <button
          type="button"
          aria-label="Başlangıca dön"
          onClick={() => router.replace("/")}
          className="flex size-12 items-center justify-center rounded-full bg-surface shadow-subtle transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:opacity-75"
        >
          <ArrowLeft size={20} className="text-ink" />
        </button>
      </motion.div>

      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.06, duration: 0.38, type: "spring" }}
        className="flex flex-col gap-3"
      >
        <p className="text-xs font-bold uppercase leading-4 text-primary">
          Varış
        </p>
        <h1 className="text-[34px] font-bold leading-10 text-ink">
          Nereye gitmek istiyorsunuz?
        </h1>
      </motion.section>

      {startNode ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.12, duration: 0.38, type: "spring" }}
          className="flex items-center gap-3 rounded-[14px] bg-surface p-4 shadow-subtle"
        >
          <div className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-primary-light">
            <MapPin size={20} className="text-primary-dark" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase leading-[15px] text-muted-light">
              Başlangıç
            </p>
            <p className="truncate text-base font-semibold leading-[22px] text-ink">
              {getNodeTitle(startNode)}
            </p>
            <p className="truncate text-[13px] leading-[18px] text-muted">
              {getNodeSubtitle(startNode)}
            </p>
          </div>
        </motion.div>
      ) : null}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.18, duration: 0.38, type: "spring" }}
      >
        <NodeSelector
          label="Hedef konum"
          placeholder="Varış noktası seçin"
          value={goalId}
          nodes={nodes}
          loading={nodesLoading}
          error={nodesError}
          onChange={setGoalId}
        />
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.24, duration: 0.38, type: "spring" }}
      >
        <button
          type="button"
          role="switch"
          aria-checked={avoidStairs}
          onClick={() => setAvoidStairs(!avoidStairs)}
          className="flex w-full items-center gap-4 rounded-2xl bg-surface p-1 shadow-subtle transition-all hover:bg-surface-subtle active:scale-[0.99]"
        >
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-xl transition-colors",
              avoidStairs
                ? "bg-primary text-surface shadow-md"
                : "bg-surface-subtle text-muted",
            )}
          >
            <SlidersHorizontal size={22} />
          </div>
          <span className="min-w-0 flex-1 pr-4">
            <span className="block text-[15px] font-semibold text-ink">
              Merdivensiz rota
            </span>
            <span className="block text-[12px] leading-[16px] text-muted">
              Asansör ve düz geçişler öncelikli
            </span>
          </span>
          <div
            className={cn(
              "relative h-6 w-11 shrink-0 rounded-full bg-border transition-all",
              avoidStairs && "bg-primary",
            )}
          >
            <div
              className={cn(
                "absolute top-0.5 size-5 rounded-full bg-surface shadow-sm transition-all",
                avoidStairs ? "left-[22px]" : "left-0.5",
              )}
            />
          </div>
        </button>
      </motion.div>

      {error ? (
        <div className="flex items-start gap-2 rounded-[14px] border border-error-border bg-error-soft p-4">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-error" />
          <p className="text-sm font-bold leading-5 text-error">{error}</p>
        </div>
      ) : null}
    </ScreenShell>
  );
}
