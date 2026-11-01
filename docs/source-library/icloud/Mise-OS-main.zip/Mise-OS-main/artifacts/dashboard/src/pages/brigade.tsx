import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { BRIGADE_GROUPS, BRIGADE_TOTAL, type BrigadeAgent } from "@/lib/brigade-data";

function AgentCard({ agent, accent }: { agent: BrigadeAgent; accent: string }) {
  return (
    <div
      data-testid={`card-agent-${agent.name.replace(/\s+/g, "-").toLowerCase()}`}
      className="group relative flex flex-col overflow-hidden rounded-md border border-border/60 bg-card transition-colors hover:border-border"
    >
      <div
        className="relative flex aspect-square items-end justify-center overflow-hidden"
        style={{
          background: `radial-gradient(120% 90% at 50% 8%, ${accent}26 0%, ${accent}0d 42%, transparent 72%)`,
        }}
      >
        <span
          className="absolute inset-x-0 top-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        />
        {agent.img ? (
          <img
            src={agent.img}
            alt={agent.name}
            loading="lazy"
            className="h-[88%] w-auto object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-[10px] text-muted-foreground">
            no art
          </div>
        )}
      </div>
      <div className="border-t border-border/50 px-3 py-2.5">
        <div className="truncate text-sm font-semibold tracking-tight">{agent.name}</div>
        <div className="truncate font-mono text-[11px] text-muted-foreground">{agent.role}</div>
      </div>
    </div>
  );
}

export default function Brigade() {
  const [q, setQ] = useState("");
  const [activeGroup, setActiveGroup] = useState("");

  const query = q.trim().toLowerCase();

  const groups = useMemo(() => {
    return BRIGADE_GROUPS
      .filter((g) => !activeGroup || g.id === activeGroup)
      .map((g) => ({
        ...g,
        agents: query
          ? g.agents.filter(
              (a) =>
                a.name.toLowerCase().includes(query) ||
                a.role.toLowerCase().includes(query),
            )
          : g.agents,
      }))
      .filter((g) => g.agents.length > 0);
  }, [query, activeGroup]);

  const shown = groups.reduce((n, g) => n + g.agents.length, 0);

  return (
    <div className="space-y-8" data-testid="brigade-page">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold/80">
            The Agent Brigade
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">
            {BRIGADE_TOTAL} agents. 7 groups. One orchestra.
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Every agent has a role. Every role has a purpose. Every action is orchestrated.
            Browse the full MiseOS brigade by station.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            data-testid="input-brigade-search"
            type="search"
            placeholder="Search the brigade..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-60 rounded border border-border/60 bg-card py-1.5 pl-8 pr-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            data-testid="chip-group-all"
            onClick={() => setActiveGroup("")}
            className={`rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors ${
              activeGroup === ""
                ? "border-gold/50 bg-gold/15 text-gold"
                : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
            }`}
          >
            All
          </button>
          {BRIGADE_GROUPS.map((g) => {
            const active = activeGroup === g.id;
            return (
              <button
                key={g.id}
                data-testid={`chip-group-${g.id}`}
                onClick={() => setActiveGroup(active ? "" : g.id)}
                className="rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors"
                style={
                  active
                    ? { borderColor: `${g.accent}80`, backgroundColor: `${g.accent}22`, color: g.accent }
                    : undefined
                }
              >
                <span className={active ? "" : "text-muted-foreground"}>{g.name}</span>
              </button>
            );
          })}
        </div>

        <span className="ml-auto font-mono text-[11px] text-muted-foreground">
          {shown} shown
        </span>
      </div>

      {/* Groups */}
      {groups.length > 0 ? (
        <div className="space-y-12">
          {groups.map((g) => (
            <section key={g.id} data-testid={`section-group-${g.id}`}>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-8 w-1 rounded-full" style={{ backgroundColor: g.accent }} />
                <div className="flex-1">
                  <h2 className="font-display text-lg font-bold tracking-tight" style={{ color: g.accent }}>
                    {g.name}
                  </h2>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {g.tagline}
                  </p>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {g.agents.length} agents
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                {g.agents.map((a) => (
                  <AgentCard key={a.name} agent={a} accent={g.accent} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="mb-3 h-10 w-10 text-muted-foreground" />
          <h3 className="text-base font-semibold">No agents found</h3>
          <p className="mt-1 text-sm text-muted-foreground">Try a different search or group.</p>
        </div>
      )}
    </div>
  );
}
