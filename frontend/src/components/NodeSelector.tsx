"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, MapPin, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  type BuildingNode,
  getNodeById,
  getNodeSections,
  getNodeSubtitle,
  getNodeTitle,
} from "@/data/nodes";
import { cn } from "@/lib/cn";

type NodeSelectorProps = {
  label: string;
  placeholder: string;
  value: string | null;
  nodes: BuildingNode[];
  loading?: boolean;
  error?: string | null;
  onChange: (id: string) => void;
};

export function NodeSelector({
  label,
  placeholder,
  value,
  nodes,
  loading = false,
  error = null,
  onChange,
}: NodeSelectorProps) {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const selectedNode = getNodeById(nodes, value);
  const sections = useMemo(() => getNodeSections(nodes, query), [nodes, query]);
  const disabled = loading || Boolean(error) || nodes.length === 0;
  const fallbackMessage = loading
    ? "Konumlar yükleniyor."
    : error
      ? "Konumlar yüklenemedi."
      : "Eşleşen konum bulunamadı.";

  useEffect(() => {
    if (!visible) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => searchRef.current?.focus());

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setVisible(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible]);

  function selectNode(node: BuildingNode) {
    onChange(node.id);
    setVisible(false);
    setQuery("");
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold leading-[19px] text-ink">
        {label}
      </label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setVisible(true)}
        className="flex min-h-20 w-full items-center gap-3 rounded-[20px] bg-surface p-4 text-left shadow-panel transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:opacity-75 disabled:cursor-not-allowed disabled:opacity-65"
      >
        <span className="flex size-[46px] shrink-0 items-center justify-center rounded-[14px] bg-primary-light">
          <MapPin size={20} className="text-primary-dark" />
        </span>
        <span className="min-w-0 flex-1">
          <span
            className={cn(
              "block truncate text-[17px] font-semibold leading-[22px] text-ink",
              !selectedNode && "text-muted",
            )}
          >
            {selectedNode
              ? getNodeTitle(selectedNode)
              : loading
                ? "Konumlar yükleniyor"
                : error
                  ? "Konumlar yüklenemedi"
                  : placeholder}
          </span>
          <span className="block truncate text-[13px] leading-[18px] text-muted-light">
            {selectedNode
              ? getNodeSubtitle(selectedNode)
              : error
                ? error
                : "Kat, bölüm veya oda adıyla arayın"}
          </span>
        </span>
        <ChevronDown size={22} className="shrink-0 text-muted" />
      </button>
      {error ? (
        <p className="text-[13px] font-medium leading-[18px] text-error">
          {error}
        </p>
      ) : null}

      <AnimatePresence>
        {visible ? (
          <motion.div
            className="fixed inset-0 z-50 flex bg-ink/20 p-0 sm:items-center sm:justify-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Konum seçimini kapat"
              className="absolute inset-0 cursor-default"
              onClick={() => setVisible(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Konum seç"
              className="relative mt-auto flex h-[min(100dvh,760px)] w-full flex-col bg-background px-4 pb-0 pt-3 shadow-elevated sm:mt-0 sm:max-w-app sm:rounded-[28px] sm:p-4"
              initial={{ y: 32, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <div className="flex min-h-[62px] items-center justify-between">
                <button
                  type="button"
                  aria-label="Kapat"
                  onClick={() => setVisible(false)}
                  className="flex size-11 items-center justify-center rounded-full bg-surface shadow-subtle transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:opacity-75"
                >
                  <X size={22} className="text-ink" />
                </button>
                <h2 className="text-lg font-semibold leading-6 text-ink">
                  Konum seç
                </h2>
                <div className="size-11" />
              </div>

              <div className="flex min-h-[54px] items-center gap-2 rounded-[20px] bg-surface-subtle px-4 shadow-subtle">
                <Search size={19} className="shrink-0 text-muted" />
                <input
                  ref={searchRef}
                  type="search"
                  autoCorrect="off"
                  disabled={disabled}
                  placeholder="Bölüm, kat veya konum ara"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted-light"
                />
              </div>

              <div className="no-scrollbar mt-4 flex-1 overflow-y-auto pb-8">
                {sections.length > 0 ? (
                  sections.map((section) => (
                    <div key={section.title}>
                      <h3 className="px-1 pb-2 pt-4 text-xs font-bold uppercase leading-4 text-primary-dark">
                        {section.title}
                      </h3>
                      <div className="flex flex-col gap-2">
                        {section.data.map((node, nodeIndex) => {
                          const selected = node.id === value;
                          return (
                            <button
                              key={`${section.title}-${node.id}-${nodeIndex}`}
                              type="button"
                              onClick={() => selectNode(node)}
                              className={cn(
                                "flex min-h-[68px] w-full items-center justify-between gap-3 rounded-[14px] bg-surface px-4 py-3 text-left shadow-subtle transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:opacity-75",
                                selected &&
                                  "border-l-[3px] border-primary bg-primary-light",
                              )}
                            >
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-base font-semibold leading-[21px] text-ink">
                                  {getNodeTitle(node)}
                                </span>
                                <span className="block truncate text-[13px] leading-[18px] text-muted-light">
                                  {node.id}
                                </span>
                              </span>
                              {selected ? (
                                <Check size={20} className="shrink-0 text-success" />
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-12 text-center text-[15px] leading-[21px] text-muted">
                    {fallbackMessage}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
