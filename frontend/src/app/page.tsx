"use client";

import { motion } from "framer-motion";
import { ArrowRight, Crosshair } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { NodeSelector } from "@/components/NodeSelector";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenShell } from "@/components/ScreenShell";
import { getNodeById, getNodeSubtitle, getNodeTitle } from "@/data/nodes";
import { useNavigationFlow } from "@/state/navigation-context";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function HomeScreen() {
  const router = useRouter();
  const { startId, nodes, nodesLoading, nodesError, setStartId } =
    useNavigationFlow();
  const selectedNode = getNodeById(nodes, startId);
  const nodeStatusText = nodesLoading
    ? "Konumlar yükleniyor"
    : nodesError
      ? "Konumlar yüklenemedi"
      : `${nodes.length} konum hazır`;

  return (
    <ScreenShell
      scroll
      footer={
        <PrimaryButton
          title="Devam Et"
          disabled={
            !startId || nodesLoading || Boolean(nodesError) || nodes.length === 0
          }
          onClick={() => router.push("/destination")}
          icon={<ArrowRight size={19} />}
        />
      }
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3"
      >
        <div className="flex size-14 items-center justify-center rounded-[14px] border border-border bg-surface shadow-subtle">
          <Image
            src="/hacettepe-logo.svg"
            alt="Hacettepe Üniversitesi logosu"
            width={35}
            height={50}
            priority
            className="h-[50px] w-auto"
          />
        </div>
        <div>
          <p className="text-lg font-semibold leading-6 text-ink">
            Hastane Navigasyon
          </p>
          <p className="text-[13px] leading-[18px] text-muted-light">
            {nodeStatusText}
          </p>
        </div>
      </motion.div>

      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.06, duration: 0.38, type: "spring" }}
        className="flex flex-col gap-3 pt-12"
      >
        <p className="text-xs font-bold uppercase leading-4 text-primary">
          Başlangıç
        </p>
        <h1 className="text-[40px] font-bold leading-[46px] text-ink">
          Neredesiniz?
        </h1>
        <p className="text-[17px] leading-[26px] text-muted">
          Rotayı hesaplamak için bulunduğunuz noktayı seçin. Bir sonraki adımda
          hedefinizi belirleyeceksiniz.
        </p>
      </motion.section>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.12, duration: 0.38, type: "spring" }}
      >
        <NodeSelector
          label="Başlangıç (A)"
          placeholder="Başlangıç konumu seçin"
          value={startId}
          nodes={nodes}
          loading={nodesLoading}
          error={nodesError}
          floorFilter={0}
          onChange={setStartId}
        />
      </motion.div>

      {selectedNode ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.18, duration: 0.38, type: "spring" }}
          className="flex min-h-[62px] items-center gap-3 rounded-[14px] bg-primary-light p-4 shadow-subtle"
        >
          <Crosshair size={21} className="shrink-0 text-primary-dark" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold leading-[21px] text-ink">
              {getNodeTitle(selectedNode)}
            </p>
            <p className="truncate text-[13px] leading-[18px] text-primary">
              {getNodeSubtitle(selectedNode)}
            </p>
          </div>
        </motion.div>
      ) : null}
    </ScreenShell>
  );
}
