import { useMemo, useState } from "react";
import { DEPARTMENTS, MASTER_ROSTER, COMMAND_NODE, cardsByDepartment, departmentFor } from "../data/master-roster.js";
import type { MasterRosterCard as MasterRosterCardData } from "../types/master-roster.js";
import { MasterRosterCard } from "./MasterRosterCard.js";

export function MasterRosterGallery() {
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q === "") return null; // null = "show grouped by department" (default view)
    return MASTER_ROSTER.filter(
      (c) => c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) || c.id.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-8">
      <header className="mb-10">
        <h1 className="mb-2 text-4xl font-bold tracking-tight" style={{ color: "var(--gs-cream)" }}>
          Master Franchise Roster
        </h1>
        <p className="mb-6 max-w-2xl text-sm text-gray-400 md:text-base">
          75 operational spirits across 5 Departments. Mise sustains harmony; Entropy pulls it
          apart — the Orchestra exists to hold that line.
        </p>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search all 75 by name, role, or id..."
          className="w-full max-w-md rounded-lg border px-4 py-2.5 transition-all focus:ring-2 focus:outline-none"
          style={{
            backgroundColor: "var(--gs-obsidian-raised)",
            borderColor: "var(--gs-obsidian-border)",
            color: "var(--gs-cream)",
          }}
        />
      </header>

      <CommandNodeSection />

      {matches ? (
        <SearchResultsGrid cards={matches} />
      ) : (
        DEPARTMENTS.map((dept) => (
          <section key={dept.id} className="mb-12">
            <div
              className="mb-5 rounded-lg border-l-4 px-4 py-3"
              style={{ borderColor: dept.themeColor, backgroundColor: `${dept.themeColor}14` }}
            >
              <h2 className="text-xl font-bold" style={{ color: dept.themeColor }}>
                Department {dept.id}: {dept.name}{" "}
                <span className="text-sm font-normal text-gray-400">
                  ({dept.range[0]}-{dept.range[1]})
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Motto: {dept.motto} · HQ: {dept.headquarters}
                {dept.leader ? ` · Led by ${dept.leader}` : ""}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {cardsByDepartment(dept.id).map((card) => (
                <MasterRosterCard key={card.id} card={card} department={departmentFor(card)} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

function SearchResultsGrid({ cards }: { cards: MasterRosterCardData[] }) {
  if (cards.length === 0) {
    return (
      <div className="py-20 text-center">
        <h3 className="text-xl font-medium text-gray-400">No profiles found</h3>
        <p className="mt-1 text-gray-500">Try a different name, role, or id.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {cards.map((card) => (
        <MasterRosterCard key={card.id} card={card} department={departmentFor(card)} />
      ))}
    </div>
  );
}

/** The leadership layer above the numbered 75 — Orchestra Core, Kurogami
 * Senpai, and the four Prime satellites. Rendered distinctly since it isn't
 * part of the 1-75 count and Orchestra Core's rarity is a one-of-one. */
function CommandNodeSection() {
  const [core, kurogami, ...primes] = COMMAND_NODE;
  if (!core || !kurogami) return null;

  return (
    <section className="mb-12">
      <h2 className="mb-4 text-sm font-semibold tracking-widest text-gray-400 uppercase">Command Node</h2>
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LeadershipCard name={kurogami.name} role={kurogami.role} detail={kurogami.artifact} quote={kurogami.quote} accent="#D4AF37" />
        <LeadershipCard name={core.name} role={core.role} detail={core.artifact} quote={core.designation} accent="#5B8DEF" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {primes.map((p) => (
          <LeadershipCard key={p.name} name={p.name} role={p.domain ?? p.role} compact accent="#26B6A6" />
        ))}
      </div>
    </section>
  );
}

function LeadershipCard({
  name,
  role,
  detail,
  quote,
  accent,
  compact = false,
}: {
  name: string;
  role: string;
  detail?: string;
  quote?: string;
  accent: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border ${compact ? "p-3" : "p-4"}`}
      style={{ borderColor: accent, backgroundColor: `${accent}12` }}
    >
      <p className="font-bold" style={{ color: "var(--gs-cream)" }}>
        {name}
      </p>
      <p className="text-xs" style={{ color: accent }}>
        {role}
      </p>
      {detail && !compact && <p className="mt-2 text-xs text-gray-400">Artifact: {detail}</p>}
      {quote && !compact && <p className="mt-1 text-xs text-gray-500 italic">"{quote}"</p>}
    </div>
  );
}
