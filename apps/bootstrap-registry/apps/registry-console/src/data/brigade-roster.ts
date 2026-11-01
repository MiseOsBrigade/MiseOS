import { manifests } from '../registry-data.js'
import type { BrigadeCardData } from '../types/brigade.js'

const COLORS: Record<string, string> = {
  package: '#38bdf8',
  container: '#f2c94c',
  agent: '#a855f7',
  policy: '#ef4444',
  workflow: '#22c55e',
  template: '#e97b22',
  sdk: '#1e9bb8',
  analytics: '#c46c2d',
  schema: '#e4ddd3',
}

export const BRIGADE_ROSTER: BrigadeCardData[] = manifests.map((manifest, index) => ({
  id: `MO-${String(index + 1).padStart(3, '0')}`,
  name: manifest.name,
  brigade: manifest.type,
  role: manifest.analytics.operationalTier,
  focus: manifest.description,
  tool: Object.values(manifest.artifacts)[0] ?? manifest.id,
  slug: manifest.id.replace('miseos.', '').replaceAll('.', '-'),
  mode: manifest.agentContract.executionMode,
  color: COLORS[manifest.type] ?? '#e4ddd3',
  command: `miseos package inspect ${manifest.id}`,
}))

export const BRIGADES = [...new Set(BRIGADE_ROSTER.map((card) => card.brigade))].sort()
