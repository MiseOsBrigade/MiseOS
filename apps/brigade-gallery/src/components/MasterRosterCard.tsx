import { RARITY_META } from "../types/master-roster.js";
import type { MasterRosterCard as MasterRosterCardData, Department } from "../types/master-roster.js";

interface MasterRosterCardProps {
  card: MasterRosterCardData;
  department: Department;
}

export function MasterRosterCard({ card, department }: MasterRosterCardProps) {
  const meta = RARITY_META[card.rarity];

  return (
    <div
      className="gs-card relative flex flex-col overflow-hidden rounded-xl border-2 p-5"
      style={{
        backgroundColor: "var(--gs-obsidian-raised)",
        borderColor: meta.color,
        boxShadow: `0 0 24px ${meta.color}22`,
      }}
    >
      <div className="mb-3 flex items-start justify-between">
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase"
          style={{ backgroundColor: `${meta.color}26`, color: meta.color }}
        >
          {meta.label}
        </span>
        <span className="font-mono text-[10px] text-gray-500">{card.id}</span>
      </div>

      <h3 className="text-lg font-bold" style={{ color: "var(--gs-cream)" }}>
        {card.name}
      </h3>
      <p className="mb-3 text-sm" style={{ color: meta.color }}>
        {card.role}
      </p>

      <div className="mb-3 flex" aria-label={`${meta.stars} of 5 stars`}>
        {Array.from({ length: 5 }, (_, i) => (
          <StarIcon key={i} filled={i < meta.stars} color={meta.color} />
        ))}
      </div>

      <div
        className="mt-auto flex items-center justify-between border-t pt-3 text-xs"
        style={{ borderColor: "var(--gs-obsidian-border)", color: "#9CA3AF" }}
      >
        <span>Dept {department.id} · {department.name}</span>
        <span className="font-mono">#{String(card.number).padStart(2, "0")}/75</span>
      </div>
    </div>
  );
}

function StarIcon({ filled, color }: { filled: boolean; color: string }) {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 20 20"
      fill={filled ? color : "none"}
      stroke={filled ? "none" : "#4B5563"}
      aria-hidden="true"
    >
      <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6L10 1.5z" />
    </svg>
  );
}
