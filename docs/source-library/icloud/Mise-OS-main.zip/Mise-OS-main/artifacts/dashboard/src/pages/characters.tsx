import { useState } from "react";
import { useListCharacters, useListDepartments, getListCharactersQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, stationName } from "@/lib/utils";
import { Search } from "lucide-react";

const RARITY_STYLES: Record<string, string> = {
  common:    "text-slate-400 border-slate-500/30 bg-slate-500/5",
  rare:      "text-blue-400 border-blue-500/30 bg-blue-500/5",
  epic:      "text-purple-400 border-purple-500/30 bg-purple-500/5",
  legendary: "text-amber-400 border-amber-500/30 bg-amber-500/5",
  mythic:    "text-pink-400 border-pink-500/30 bg-pink-500/5",
  genesis:   "text-primary border-primary/30 bg-primary/5",
};

const DEPT_COLOR: Record<string, string> = {
  pipeline:    "#3B82F6",
  platform:    "#14B8A6",
  reliability: "#F59E0B",
  security:    "#EF4444",
  data:        "#8B5CF6",
};

const ALL_RARITIES = ["common", "rare", "epic", "legendary", "mythic", "genesis"];

export default function Characters() {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("");
  const [rarity, setRarity] = useState("");

  const { data, isLoading } = useListCharacters(
    { q: q || undefined, department: dept || undefined, rarity: rarity || undefined },
    { query: { queryKey: getListCharactersQueryKey({ q: q || undefined, department: dept || undefined, rarity: rarity || undefined }) } }
  );
  const { data: depts } = useListDepartments();

  return (
    <div className="space-y-8" data-testid="characters-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight">Character Roster</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">
            {data ? `${data.total} of 75 agents` : "75 agents across all stations"}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            data-testid="input-search"
            type="search"
            placeholder="Search agents..."
            value={q}
            onChange={e => setQ(e.target.value)}
            className="pl-8 pr-4 py-1.5 rounded border border-border/60 bg-card text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 w-56"
          />
        </div>

        <select
          data-testid="select-department"
          value={dept}
          onChange={e => setDept(e.target.value)}
          className="px-3 py-1.5 rounded border border-border/60 bg-card text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
        >
          <option value="">All Stations</option>
          {depts?.map(d => (
            <option key={d.id} value={d.id}>{stationName(d.name)}</option>
          ))}
        </select>

        <select
          data-testid="select-rarity"
          value={rarity}
          onChange={e => setRarity(e.target.value)}
          className="px-3 py-1.5 rounded border border-border/60 bg-card text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
        >
          <option value="">All Rarities</option>
          {ALL_RARITIES.map(r => (
            <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
          ))}
        </select>

        {(q || dept || rarity) && (
          <button
            data-testid="button-clear-filters"
            onClick={() => { setQ(""); setDept(""); setRarity(""); }}
            className="px-3 py-1.5 rounded border border-border/40 text-xs font-mono text-muted-foreground hover:text-foreground hover:border-border transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-28 rounded" />)}
        </div>
      ) : data && data.characters.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {data.characters.map(char => (
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

              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[10px]"
                  style={{ color: DEPT_COLOR[char.department], backgroundColor: `${DEPT_COLOR[char.department]}15` }}
                >
                  {char.department}
                </span>
                {char.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="h-10 w-10 text-muted-foreground mb-3" />
          <h3 className="text-base font-semibold">No agents found</h3>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
