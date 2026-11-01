import type { CSSProperties } from 'react'
import { RARITY_META } from '../types/master-roster.js'
import type { MasterRosterCard as MasterRosterCardData, Department } from '../types/master-roster.js'

interface MasterRosterCardProps {
  card: MasterRosterCardData
  department: Department
  onCopy: (text: string, label?: string) => void
}

export function MasterRosterCard({ card, department, onCopy }: MasterRosterCardProps) {
  const meta = RARITY_META[card.rarity]

  return (
    <article className="master-card" style={{ '--rarity-color': meta.color } as CSSProperties}>
      <div className="card-top">
        <span className="rarity-pill">{meta.label}</span>
        <span className="card-id">{card.id}</span>
      </div>

      <h3 className="card-name">{card.name}</h3>
      <p className="card-role">{card.role}</p>

      <div className="card-stars" aria-label={`${meta.stars} star ${meta.label} tier`}>
        {Array.from({ length: Math.min(meta.stars, 7) }, (_, i) => (
          <StarIcon key={i} color={meta.color} />
        ))}
      </div>

      <pre className="card-command"><code>{card.command}</code></pre>

      <div className="card-footer">
        <span>Dept {department.id} · {department.name}</span>
        <button type="button" className="copy-button" onClick={() => onCopy(card.command, card.name)}>
          Copy command
        </button>
      </div>
    </article>
  )
}

function StarIcon({ color }: { color: string }) {
  return (
    <svg className="h-3.5 w-3.5" width="16" height="16" viewBox="0 0 20 20" fill={color} aria-hidden="true">
      <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6L10 1.5z" />
    </svg>
  )
}
