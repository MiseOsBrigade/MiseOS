import { useMemo, useState } from "react";
import type { BrigadeCard, BrigadeFilterState } from "../types/brigade.js";

export function useBrigadeFilter(roster: readonly BrigadeCard[]) {
  const [filter, setFilter] = useState<BrigadeFilterState>({ query: "", brigade: "All" });

  const filtered = useMemo(() => {
    const q = filter.query.trim().toLowerCase();
    return roster.filter((card) => {
      const matchesQuery =
        q === "" ||
        card.name.toLowerCase().includes(q) ||
        card.role.toLowerCase().includes(q) ||
        card.id.toLowerCase().includes(q);
      const matchesBrigade = filter.brigade === "All" || card.brigade === filter.brigade;
      return matchesQuery && matchesBrigade;
    });
  }, [roster, filter.query, filter.brigade]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const card of roster) map.set(card.brigade, (map.get(card.brigade) ?? 0) + 1);
    return map;
  }, [roster]);

  return { filter, setFilter, filtered, counts };
}
