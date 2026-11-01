import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useGetDepartment, getGetDepartmentQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";
import { cn, stationName } from "@/lib/utils";

const RARITY_STYLES: Record<string, string> = {
  common:    "text-slate-400 border-slate-500/30 bg-slate-500/5",
  rare:      "text-blue-400 border-blue-500/30 bg-blue-500/5",
  epic:      "text-purple-400 border-purple-500/30 bg-purple-500/5",
  legendary: "text-amber-400 border-amber-500/30 bg-amber-500/5",
  mythic:    "text-pink-400 border-pink-500/30 bg-pink-500/5",
  genesis:   "text-primary border-primary/30 bg-primary/5",
};

const ALL_RARITIES = ["genesis", "legendary", "epic", "rare", "common"] as const;

export default function DepartmentDetail() {
  const [, params] = useRoute("/departments/:id");
  const id = params?.id ?? "";
  const [rarityFilter, setRarityFilter] = useState("");

  const { data: dept, isLoading } = useGetDepartment(id, {
    query: { enabled: !!id, queryKey: getGetDepartmentQueryKey(id) },
  });

  const filtered = dept?.characters.filter(c => !rarityFilter || c.rarity === rarityFilter) ?? [];

  return (
    <div className="space-y-8" data-testid="department-detail-page">
      <div>
        <Link href="/departments" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors font-mono mb-4">
          <ChevronLeft className="h-3.5 w-3.5" />
          Back to Stations
        </Link>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 rounded" />
            <Skeleton className="h-4 w-48 rounded" />
          </div>
        ) : dept ? (
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-1 w-8 rounded-full" style={{ backgroundColor: dept.color }} />
              <h1 className="text-2xl font-display font-bold tracking-tight">{stationName(dept.name)}</h1>
            </div>
            <p className="text-sm text-muted-foreground font-mono">{dept.tagline}</p>
          </div>
        ) : (
          <div className="text-muted-foreground">Station not found</div>
        )}
      </div>

      {/* Rarity filter */}
      <div className="flex gap-1 flex-wrap font-mono text-xs">
        <button
          data-testid="filter-all"
          onClick={() => setRarityFilter("")}
          className={cn(
            "px-3 py-1.5 rounded uppercase tracking-wider transition-colors border",
            !rarityFilter
              ? "bg-primary/10 text-primary border-primary/40"
              : "text-muted-foreground border-border/40 hover:text-foreground hover:border-border"
          )}
        >
          All ({dept?.characters.length ?? 0})
        </button>
        {ALL_RARITIES.map(r => {
          const count = dept?.characters.filter(c => c.rarity === r).length ?? 0;
          if (!count) return null;
          return (
            <button
              key={r}
              data-testid={`filter-${r}`}
              onClick={() => setRarityFilter(r)}
              className={cn(
                "px-3 py-1.5 rounded uppercase tracking-wider transition-colors border",
                rarityFilter === r
                  ? "bg-primary/10 text-primary border-primary/40"
                  : "text-muted-foreground border-border/40 hover:text-foreground hover:border-border"
              )}
            >
              {r} ({count})
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 rounded" />)}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map(char => (
            <div
              key={char.id}
              data-testid={`card-character-${char.id}`}
              className="rounded border border-border/60 bg-card p-4 space-y-3 hover:border-border transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{char.name}</div>
                  <div className="text-xs text-muted-foreground font-mono truncate">{char.title}</div>
                </div>
                <span className={cn("shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider", RARITY_STYLES[char.rarity] ?? "text-muted-foreground border-border")}>
                  {char.rarity}
                </span>
              </div>

              <div className="text-xs text-foreground/70">{char.role}</div>

              <div className="flex gap-1 flex-wrap">
                {char.tags.slice(0, 4).map(tag => (
                  <span key={tag} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground py-8 text-center">
          {rarityFilter ? `No ${rarityFilter} agents in this station` : "No agents found"}
        </div>
      )}
    </div>
  );
}
