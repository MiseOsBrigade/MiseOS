import { scoreManifest } from '../risk'
import type { RegistryManifest } from '../types'

self.onmessage = (event: MessageEvent<RegistryManifest[]>) => {
  const risks = event.data.map(scoreManifest).sort((a, b) => b.score - a.score)
  const counts = risks.reduce(
    (acc, risk) => {
      acc[risk.level] += 1
      return acc
    },
    { low: 0, medium: 0, high: 0 },
  )

  self.postMessage({ risks, counts })
}

export {}
