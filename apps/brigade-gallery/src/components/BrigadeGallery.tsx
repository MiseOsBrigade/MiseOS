import { BRIGADE_ROSTER, BRIGADES } from "../data/brigade-roster.js";
import { useBrigadeFilter } from "../hooks/useBrigadeFilter.js";
import { BrigadeCard } from "./BrigadeCard.js";

/** Brigade name -> its trim color, derived once from the roster so the stat
 * chips stay in sync with card colors without a second source of truth. */
function brigadeColors(): Map<string, string> {
  const map = new Map<string, string>();
  for (const card of BRIGADE_ROSTER) {
    if (!map.has(card.brigade)) map.set(card.brigade, card.color);
  }
  return map;
}

export function BrigadeGallery() {
  const { filter, setFilter, filtered, counts } = useBrigadeFilter(BRIGADE_ROSTER);
  const colors = brigadeColors();

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-8">
      <header className="mb-10 text-center md:text-left">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1
              className="mb-2 text-4xl font-bold tracking-tight"
              style={{ color: "var(--gs-cream)" }}
            >
              MiseOS Brigade Profiles
            </h1>
            <p className="max-w-2xl text-sm text-gray-400 md:text-base">
              Collectible workflow-card profiles mapping characters to development actions,
              tools, and solo commands.
            </p>
          </div>

          <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
            <div className="relative flex-1 sm:min-w-[220px] sm:flex-none">
              <input
                type="text"
                value={filter.query}
                onChange={(e) => setFilter((f) => ({ ...f, query: e.target.value }))}
                placeholder="Search characters or roles..."
                className="w-full rounded-lg border py-2.5 pr-4 pl-10 transition-all focus:ring-2 focus:outline-none"
                style={{
                  backgroundColor: "var(--gs-obsidian-raised)",
                  borderColor: "var(--gs-obsidian-border)",
                  color: "var(--gs-cream)",
                }}
              />
              <SearchIcon />
            </div>

            <select
              value={filter.brigade}
              onChange={(e) => setFilter((f) => ({ ...f, brigade: e.target.value }))}
              className="cursor-pointer rounded-lg border px-4 py-2.5 transition-all focus:ring-2 focus:outline-none"
              style={{
                backgroundColor: "var(--gs-obsidian-raised)",
                borderColor: "var(--gs-obsidian-border)",
                color: "var(--gs-cream)",
              }}
            >
              <option value="All">All Brigades</option>
              {BRIGADES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <span
            className="rounded-full border px-3 py-1 text-xs font-medium"
            style={{ backgroundColor: "var(--gs-obsidian-raised)", borderColor: "var(--gs-obsidian-border)", color: "#D1D5DB" }}
          >
            Total: {BRIGADE_ROSTER.length}
          </span>
          {[...counts.entries()].map(([brigade, count]) => (
            <span
              key={brigade}
              className="flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
              style={{ backgroundColor: "var(--gs-obsidian-raised)", borderColor: "var(--gs-obsidian-border)", color: "#D1D5DB" }}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.get(brigade) }} />
              {brigade}: {count}
            </span>
          ))}
        </div>
      </header>

      <main>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((card) => (
              <BrigadeCard key={card.id} card={card} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <h3 className="text-xl font-medium text-gray-400">No profiles found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </main>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg className="absolute top-3 left-3 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}
