import { useMemo, useState } from 'react'
import { DEPARTMENTS, MASTER_ROSTER_CARDS, getDepartmentById } from '../data/master-roster.js'
import { RARITY_META } from '../types/master-roster.js'
import type { Rarity } from '../types/master-roster.js'
import { useClipboard } from '../hooks/useClipboard.js'
import { MasterRosterCard } from './MasterRosterCard.js'

type Filter = {
  query: string
  department: 'All' | string
  rarity: 'All' | Rarity
}

const RARITIES = Object.keys(RARITY_META) as Rarity[]

export function MasterRosterGallery() {
  const [filter, setFilter] = useState<Filter>({ query: '', department: 'All', rarity: 'All' })
  const { copied, copy } = useClipboard()

  const filtered = useMemo(() => {
    const q = filter.query.trim().toLowerCase()
    return MASTER_ROSTER_CARDS.filter((card) => {
      const haystack = [card.name, card.role, card.rarityRaw, card.departmentSlug, card.registryCapability].join(' ').toLowerCase()
      const matchesQuery = !q || haystack.includes(q)
      const matchesDepartment = filter.department === 'All' || card.departmentSlug === filter.department
      const matchesRarity = filter.rarity === 'All' || card.rarity === filter.rarity
      return matchesQuery && matchesDepartment && matchesRarity
    })
  }, [filter])

  return (
    <section className="gallery-shell">
      <header className="gallery-header">
        <div className="gallery-header-row">
          <div>
            <h1 className="gallery-title">MiseOS Master Roster</h1>
            <p className="gallery-copy">
              A typed, searchable 75-card operational roster for the Mise Orchestra: pipeline, platform,
              reliability, security, and data intelligence agents with copy-ready MiseOS solo commands.
            </p>
          </div>

          <div className="gallery-controls">
            <input
              className="field"
              value={filter.query}
              onChange={(event) => setFilter((current) => ({ ...current, query: event.target.value }))}
              placeholder="Search name, role, rarity, capability..."
              type="search"
            />
            <select className="field" value={filter.department} onChange={(event) => setFilter((current) => ({ ...current, department: event.target.value }))}>
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((department) => (
                <option key={department.slug} value={department.slug}>{department.name}</option>
              ))}
            </select>
            <select className="field" value={filter.rarity} onChange={(event) => setFilter((current) => ({ ...current, rarity: event.target.value as Filter['rarity'] }))}>
              <option value="All">All Rarities</option>
              {RARITIES.map((rarity) => (
                <option key={rarity} value={rarity}>{RARITY_META[rarity].label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="chip-row">
          <span className="chip">Total: {MASTER_ROSTER_CARDS.length}</span>
          <span className="chip">Showing: {filtered.length}</span>
          {DEPARTMENTS.map((department) => (
            <span key={department.slug} className="chip">
              <span className="dot" style={{ backgroundColor: department.color }} />
              {department.name}: {department.count}
            </span>
          ))}
        </div>
      </header>

      {copied ? <div className="console-panel">Copied command for <strong>{copied}</strong>.</div> : null}

      {filtered.length > 0 ? (
        <div className="card-grid">
          {filtered.map((card) => (
            <MasterRosterCard key={card.id} card={card} department={getDepartmentById(card.departmentId)} onCopy={copy} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No roster cards found</h3>
          <p>Try adjusting search, department, or rarity filters.</p>
        </div>
      )}
    </section>
  )
}
