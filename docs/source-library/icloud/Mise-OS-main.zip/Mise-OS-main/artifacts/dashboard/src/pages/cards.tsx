import { useMemo, useState } from "react";
import { BadgeCheck, Box, Film, Search, Shield, Sparkles } from "lucide-react";
import { BRIGADE_GROUPS } from "@/lib/brigade-data";
import { BRIGADE_CARD_PROFILES, type BrigadeCardProfile } from "@/lib/brigade-card-system";
import { toMiseOsCardMetadata } from "@/lib/brigade-card-metadata";

const imageByName = new Map(
  BRIGADE_GROUPS.flatMap((group) => group.agents.map((agent) => [agent.name, agent.img] as const)),
);

function statEntries(card: BrigadeCardProfile) {
  return [
    ["ORCH", card.stats.orchestration],
    ["BUILD", card.stats.build],
    ["RUN", card.stats.runtime],
    ["SEC", card.stats.security],
    ["INS", card.stats.insight],
    ["STAM", card.stats.stamina],
  ] as const;
}

function levelFor(card: BrigadeCardProfile): number {
  const values = Object.values(card.stats);
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function CardPreview({ card }: { card: BrigadeCardProfile }) {
  const metadata = toMiseOsCardMetadata(card);
  const img = imageByName.get(card.name);

  return (
    <article
      data-testid={`collectible-card-${card.slug}`}
      className="group relative overflow-hidden rounded-xl border bg-card/80 shadow-[0_18px_60px_rgba(0,0,0,0.32)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(0,0,0,0.45)]"
      style={{ borderColor: `${card.accent}88` }}
    >
      <div
        className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-30"
        style={{ background: `radial-gradient(circle at 50% 0%, ${card.accent}, transparent 54%)` }}
      />
      <div className="relative z-10 flex min-h-[640px] flex-col p-4">
        <div className="flex items-start justify-between gap-3 font-mono text-[10px] uppercase tracking-wider">
          <span style={{ color: card.accent }}>{card.id}</span>
          <span className="rounded-full border px-2 py-0.5" style={{ borderColor: `${card.accent}66`, color: card.accent }}>
            {card.rarity}
          </span>
        </div>

        <div
          className="mt-3 flex aspect-[4/3] items-end justify-center overflow-hidden rounded-lg border bg-black/30"
          style={{ borderColor: `${card.accent}44` }}
        >
          {img ? (
            <img
              src={img}
              alt={card.name}
              loading="lazy"
              className="h-[94%] w-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)] transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="font-mono text-xs text-muted-foreground">art pending</div>
          )}
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-bold tracking-tight">{card.name}</h2>
            <span className="font-mono text-xs text-muted-foreground">LV {levelFor(card)}</span>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {card.role} · {card.element}
          </p>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <div className="rounded border border-border/50 bg-background/40 p-2">
            <div className="text-foreground">Focus</div>
            <div>{card.workflowFocus}</div>
          </div>
          <div className="rounded border border-border/50 bg-background/40 p-2">
            <div className="text-foreground">Tool</div>
            <div>{card.primaryTool}</div>
          </div>
        </div>

        <div className="mt-3 space-y-2 text-xs leading-relaxed text-muted-foreground">
          <div className="rounded-lg border border-border/50 bg-background/40 p-3">
            <strong className="text-foreground">Lore</strong>
            <p className="mt-1">{metadata.miseos.lore}</p>
          </div>
          <div className="rounded-lg border border-border/50 bg-background/40 p-3">
            <strong className="text-foreground">Active</strong>
            <p className="mt-1">{card.activeAbility}</p>
          </div>
          <div className="rounded-lg border border-border/50 bg-background/40 p-3">
            <strong className="text-foreground">Ultimate</strong>
            <p className="mt-1">{card.ultimateMove}</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {statEntries(card).map(([label, value]) => (
            <div key={label} className="rounded border border-border/40 bg-background/50 px-2 py-1.5 text-center font-mono text-[10px]">
              <div className="text-muted-foreground">{label}</div>
              <div className="text-sm font-bold text-foreground">{value}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-lg border border-border/50 bg-black/30 p-3 font-mono text-[10px] text-gold/90">
          {card.soloCommand}
        </div>

        <div className="mt-auto grid grid-cols-3 gap-2 pt-3 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1 rounded border border-border/40 bg-background/40 p-2">
            <Film className="h-3 w-3" /> Video slot
          </div>
          <div className="flex items-center gap-1 rounded border border-border/40 bg-background/40 p-2">
            <Box className="h-3 w-3" /> 3D slot
          </div>
          <div className="flex items-center gap-1 rounded border border-border/40 bg-background/40 p-2">
            <BadgeCheck className="h-3 w-3" /> Metadata
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Cards() {
  const [q, setQ] = useState("");
  const [activeGroup, setActiveGroup] = useState("");
  const [activeRarity, setActiveRarity] = useState("");

  const query = q.trim().toLowerCase();

  const cards = useMemo(() => {
    return BRIGADE_CARD_PROFILES.filter((card) => {
      const matchesGroup = !activeGroup || card.brigadeId === activeGroup;
      const matchesRarity = !activeRarity || card.rarity === activeRarity;
      const haystack = `${card.name} ${card.role} ${card.workflowFocus} ${card.primaryTool} ${card.brigadeName}`.toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      return matchesGroup && matchesRarity && matchesQuery;
    });
  }, [activeGroup, activeRarity, query]);

  return (
    <div className="space-y-8" data-testid="cards-page">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-gold/80">
            <Sparkles className="h-3.5 w-3.5" /> Customer Card Catalog
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">
            {BRIGADE_CARD_PROFILES.length} collectible workflow cards.
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Browse every MiseOS brigade operator as an original digital collectible card with lore, metadata,
            workflow stats, single-player commands, and media slots for image, video, 3D, audio, or AR extensions.
          </p>
          <p className="mt-2 flex max-w-3xl items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5 text-gold" /> Rarity and stats describe system/game utility only; they are not financial value claims.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            data-testid="input-card-search"
            type="search"
            placeholder="Search cards, tools, actions..."
            value={q}
            onChange={(event) => setQ(event.target.value)}
            className="w-72 rounded border border-border/60 bg-card py-1.5 pl-8 pr-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>

        <select
          data-testid="select-card-rarity"
          value={activeRarity}
          onChange={(event) => setActiveRarity(event.target.value)}
          className="rounded border border-border/60 bg-card px-3 py-1.5 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
        >
          <option value="">All rarities</option>
          <option value="Core">Core</option>
          <option value="Rare">Rare</option>
          <option value="Epic">Epic</option>
          <option value="Legendary">Legendary</option>
        </select>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            data-testid="chip-card-group-all"
            onClick={() => setActiveGroup("")}
            className={`rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors ${
              activeGroup === ""
                ? "border-gold/50 bg-gold/15 text-gold"
                : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
            }`}
          >
            All
          </button>
          {BRIGADE_GROUPS.map((group) => {
            const active = activeGroup === group.id;
            return (
              <button
                key={group.id}
                data-testid={`chip-card-group-${group.id}`}
                onClick={() => setActiveGroup(active ? "" : group.id)}
                className="rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors"
                style={active ? { borderColor: `${group.accent}80`, backgroundColor: `${group.accent}22`, color: group.accent } : undefined}
              >
                <span className={active ? "" : "text-muted-foreground"}>{group.name}</span>
              </button>
            );
          })}
        </div>

        <span className="ml-auto font-mono text-[11px] text-muted-foreground">{cards.length} shown</span>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {cards.map((card) => (
          <CardPreview key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
