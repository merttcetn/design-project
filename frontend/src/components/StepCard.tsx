import {
  ArrowUpFromLine,
  DoorOpen,
  Footprints,
  MapPinned,
  type LucideIcon,
} from "lucide-react";

import { getFloorLabel, getNodeById } from "@/data/nodes";
import { cn } from "@/lib/cn";
import type { RouteInstruction } from "@/types/route";

type StepCardProps = {
  instruction: RouteInstruction;
  displayText: string;
  stepNumber: number;
  totalSteps: number;
  preview?: boolean;
};

type StepMeta = {
  icon: LucideIcon;
  label: string;
  iconClassName: string;
  backgroundClassName: string;
};

const stepMeta = {
  elevator: {
    icon: DoorOpen,
    label: "Asansör",
    iconClassName: "text-info",
    backgroundClassName: "bg-info/10",
  },
  stairs: {
    icon: ArrowUpFromLine,
    label: "Merdiven",
    iconClassName: "text-warning",
    backgroundClassName: "bg-warning/15",
  },
  corridor: {
    icon: Footprints,
    label: "Koridor",
    iconClassName: "text-ink",
    backgroundClassName: "bg-ink-soft",
  },
} satisfies Record<string, StepMeta>;

export function StepCard({
  instruction,
  displayText,
  stepNumber,
  totalSteps,
  preview = false,
}: StepCardProps) {
  const meta = getStepMeta(instruction.type);
  const Icon = meta.icon;
  const floorText = getFloorTransition(instruction);

  if (preview) {
    return (
      <article className="flex min-h-[76px] items-center gap-3 rounded-[14px] border border-border bg-surface-subtle px-4 py-3 opacity-90 shadow-subtle">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-[10px]",
            meta.backgroundClassName,
          )}
        >
          <Icon size={19} className={meta.iconClassName} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-medium leading-5 text-ink">
            {displayText}
          </p>
          <p className="text-xs leading-4 text-muted-light">
            Adım {stepNumber} / {totalSteps}
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="relative flex min-h-[280px] flex-col justify-between gap-6 overflow-hidden rounded-[28px] border border-primary-light bg-surface p-7 shadow-elevated">
      <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase leading-4 text-muted-light">
          Adım {stepNumber} / {totalSteps}
        </p>
        <div
          className={cn(
            "flex min-h-9 items-center gap-1 rounded-full px-3 py-1",
            meta.backgroundClassName,
          )}
        >
          <Icon size={18} className={meta.iconClassName} />
          <span className={cn("text-[13px] font-semibold leading-[17px]", meta.iconClassName)}>
            {meta.label}
          </span>
        </div>
      </div>

      <p className="text-[28px] font-bold leading-9 text-ink">{displayText}</p>

      <div className="flex min-h-12 items-center gap-2 rounded-[14px] bg-surface-subtle px-3 py-2">
        <MapPinned size={19} className="shrink-0 text-primary-dark" />
        <p className="min-w-0 flex-1 text-[15px] font-semibold leading-5 text-primary-dark">
          {floorText}
        </p>
      </div>
    </article>
  );
}

function getStepMeta(type: string): StepMeta {
  if (type === "elevator") {
    return stepMeta.elevator;
  }
  if (type === "stairs") {
    return stepMeta.stairs;
  }
  return stepMeta.corridor;
}

function getFloorTransition(instruction: RouteInstruction) {
  const fromNode = getNodeById(instruction.from_node);
  const toNode = getNodeById(instruction.to_node);

  if (!fromNode || !toNode) {
    return `${instruction.from_node} -> ${instruction.to_node}`;
  }

  if (fromNode.kat !== toNode.kat) {
    return `${getFloorLabel(fromNode.kat)} -> ${getFloorLabel(toNode.kat)}`;
  }

  return `${getFloorLabel(toNode.kat)} · ${toNode.bolum}`;
}
