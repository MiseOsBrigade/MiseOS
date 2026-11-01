import type { CSSProperties } from 'react'
import type { BrigadeCardData } from '../types/brigade.js'
import { useClipboard } from '../hooks/useClipboard.js'

export function BrigadeCard({ card }: { card: BrigadeCardData }) {
  const { copied, copy } = useClipboard()
  return (
    <article className="master-card" style={{ '--rarity-color': card.color } as CSSProperties}>
      <div className="card-top">
        <span className="rarity-pill">{card.brigade}</span>
        <span className="card-id">{card.id}</span>
      </div>
      <h3 className="card-name">{card.name}</h3>
      <p className="card-role">{card.role}</p>
      <p className="gallery-copy">{card.focus}</p>
      <pre className="card-command"><code>{card.command}</code></pre>
      <div className="card-footer">
        <span>{card.mode}</span>
        <button type="button" className="copy-button" onClick={() => copy(card.command, card.name)}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </article>
  )
}
