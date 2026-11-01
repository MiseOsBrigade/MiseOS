import { useMemo } from "react";
import type { BrigadeCard as BrigadeCardData } from "../types/brigade.js";
import { buildSoloCommand } from "../data/brigade-roster.js";
import { useClipboard } from "../hooks/useClipboard.js";

interface BrigadeCardProps {
  card: BrigadeCardData;
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function BrigadeCard({ card }: BrigadeCardProps) {
  const command = useMemo(() => buildSoloCommand(card), [card]);
  const { status, copy } = useClipboard();
  const glow = useMemo(() => hexToRgba(card.color, 0.06), [card.color]);

  return (
    <div
      className="gs-card group relative flex flex-col overflow-hidden rounded-xl border"
      style={{
        backgroundColor: "var(--gs-obsidian-raised)",
        borderColor: "var(--gs-obsidian-border)",
        boxShadow: `0 4px 30px ${glow}`,
      }}
    >
      <div
        className="gs-trim absolute top-0 left-0 h-2 w-full group-hover:h-3"
        style={{ backgroundColor: card.color }}
        aria-hidden="true"
      />

      <div className="flex flex-grow flex-col p-6 pt-8">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight" style={{ color: "var(--gs-cream)" }}>
              {card.name}
            </h3>
            <p className="text-sm font-medium" style={{ color: card.color }}>
              {card.role}
            </p>
          </div>
          <span
            className="rounded border px-2 py-1 font-mono text-xs"
            style={{ borderColor: "var(--gs-obsidian-border)", color: "#9CA3AF", backgroundColor: "var(--gs-obsidian)" }}
          >
            {card.id}
          </span>
        </div>

        <dl className="mb-6 flex-grow space-y-3">
          <Row label="Brigade" value={card.brigade} />
          <Row label="Focus" value={card.focus} />
          <Row label="Tool" value={card.tool} mono />
        </dl>

        <div className="mt-auto border-t pt-4" style={{ borderColor: "var(--gs-obsidian-border)" }}>
          <label className="mb-2 block text-xs tracking-wider uppercase" style={{ color: "#9CA3AF" }}>
            Solo Command
          </label>
          <div className="group/code relative">
            <div
              className="overflow-x-auto rounded-lg border p-3 pr-12 font-mono text-xs whitespace-nowrap"
              style={{ backgroundColor: "var(--gs-obsidian)", borderColor: "var(--gs-obsidian-border)", color: "#D1D5DB" }}
            >
              {command}
            </div>
            <button
              type="button"
              onClick={() => void copy(command)}
              className="absolute top-2 right-2 rounded p-1.5 opacity-0 transition-colors group-hover/code:opacity-100 focus:opacity-100"
              style={{
                backgroundColor: status === "copied" ? "var(--gs-forest)" : "var(--gs-obsidian-border)",
                color: "var(--gs-cream)",
              }}
              title={status === "copied" ? "Copied!" : "Copy command"}
              aria-label="Copy solo command"
            >
              <CopyIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between border-b pb-2" style={{ borderColor: "var(--gs-obsidian-border)" }}>
      <dt className="text-xs tracking-wider uppercase" style={{ color: "#9CA3AF" }}>
        {label}
      </dt>
      <dd
        className={mono ? "rounded px-2 py-0.5 font-mono text-sm" : "text-sm"}
        style={{ color: "var(--gs-cream)", backgroundColor: mono ? "var(--gs-obsidian)" : "transparent" }}
      >
        {value}
      </dd>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}
