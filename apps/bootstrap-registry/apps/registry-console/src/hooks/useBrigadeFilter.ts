import { useMemo, useState } from 'react'
import type { BrigadeCardData, BrigadeFilterState } from '../types/brigade.js'

export function useBrigadeFilter(cards: BrigadeCardData[]) {
  const [filter, setFilter] = useState<BrigadeFilterState>({ query: '', brigade: 'All' })

  const filtered = useMemo(() => {
    const q = filter.query.trim().toLowerCase()
    return cards.filter((card) => {
      const matchesQuery = !q || [card.name, card.role, card.focus, card.tool, card.slug].join(' ').toLowerCase().includes(q)
      const matchesBrigade = filter.brigade === 'All' || card.brigade === filter.brigade
      return matchesQuery && matchesBrigade
    })
  }, [cards, filter])

  const counts = useMemo(() => {
    const map = new Map<string, number>()
    for (const card of cards) map.set(card.brigade, (map.get(card.brigade) ?? 0) + 1)
    return map
  }, [cards])

  return { filter, setFilter, filtered, counts }
}
