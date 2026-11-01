import { analytics, generatedMeta, manifests, registryIndex } from '../registry-data.js'
import { scoreManifest } from '../risk.js'

export function ViteConsolePanel() {
  const risks = manifests.map(scoreManifest).sort((a, b) => b.score - a.score)
  const topRisks = risks.slice(0, 8)

  return (
    <section className="gallery-shell">
      <header className="gallery-header">
        <h1 className="gallery-title">Registry Console</h1>
        <p className="gallery-copy">{registryIndex.description}</p>
      </header>

      <div className="console-panel">
        <h2>Boot sequence</h2>
        <p><code>{registryIndex.bootSequence.join(' → ')}</code></p>
      </div>

      <div className="console-grid">
        <Stat label="Generated manifests" value={String(generatedMeta.manifestCount)} />
        <Stat label="Registry version" value={registryIndex.version} />
        <Stat label="High risk" value={String(analytics.counts.highRisk)} />
        <Stat label="npm scope" value={registryIndex.namespaces.npm} />
      </div>

      <div className="console-panel" style={{ marginTop: '1.5rem' }}>
        <h2>Highest review surfaces</h2>
        <div className="card-grid">
          {topRisks.map((risk) => (
            <article key={risk.id} className="console-stat">
              <strong>{risk.score}</strong>
              <span>{risk.id}</span>
              <p>{risk.level}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <article className="console-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}
