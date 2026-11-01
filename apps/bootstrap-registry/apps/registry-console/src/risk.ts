import type { RegistryManifest, RiskSummary } from './types'

function flattenPermissions(permissions: Record<string, unknown>): string[] {
  return Object.entries(permissions).flatMap(([surface, value]) => {
    if (Array.isArray(value)) return value.map((item) => `${surface}.${String(item)}`)
    if (typeof value === 'object' && value !== null) {
      return Object.entries(value as Record<string, unknown>).map(
        ([name, level]) => `${surface}.${name}:${String(level)}`,
      )
    }
    return [`${surface}:${String(value)}`]
  })
}

export function scoreManifest(manifest: RegistryManifest): RiskSummary {
  const reasons: string[] = []
  let score = Math.round((manifest.analytics.riskWeight ?? 0.3) * 30)
  const permissions = flattenPermissions(manifest.permissions).join(' ')
  const add = (points: number, reason: string) => {
    score += points
    reasons.push(reason)
  }

  if (permissions.includes('write')) add(18, 'write permission requested')
  if (manifest.agentContract.requiresNetwork) add(12, 'network access required')
  if (!manifest.agentContract.safeToRunWithoutHuman) add(15, 'not autonomous-safe')
  if (manifest.agentContract.executionMode === 'approved_write') add(10, 'approved write mode')
  if (Object.values(manifest.trust).some((value) => value === false)) add(18, 'trust gate disabled')

  const normalized = Math.min(100, score)
  return {
    id: manifest.id,
    score: normalized,
    level: normalized >= 60 ? 'high' : normalized >= 30 ? 'medium' : 'low',
    reasons,
  }
}
