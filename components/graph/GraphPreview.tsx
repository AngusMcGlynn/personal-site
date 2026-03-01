"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import type { GraphNode } from "@/lib/graph-data";

interface Props {
  entry: GraphNode;
  onClose: () => void;
}

export function GraphPreview({ entry, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        ref={panelRef}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 z-40 w-full max-w-sm border-l border-white/10 bg-bg p-8 overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-secondary hover:text-heading transition-colors text-sm"
        >
          close
        </button>

        <div className="mt-8">
          {entry.entryType && (
            <span className="text-xs text-secondary uppercase tracking-wider">
              {entry.entryType}
            </span>
          )}
          <h2 className="text-xl font-sans text-heading mt-1">{entry.label}</h2>
          <p className="text-sm text-secondary mt-3 leading-relaxed">
            {entry.description}
          </p>

          {entry.status && (
            <p className="text-xs text-secondary mt-4">
              status: <span className="text-foreground">{entry.status}</span>
            </p>
          )}

          {entry.permalink && (
            <Link
              href={entry.permalink}
              className="inline-block mt-6 text-sm text-accent hover:underline underline-offset-4"
            >
              read more &rarr;
            </Link>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
