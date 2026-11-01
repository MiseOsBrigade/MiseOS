import registryIndexJson from './generated/index.json'
import analyticsJson from './generated/analytics.json'
import { generatedAt, manifestCount } from './generated/meta'
import type { RegistryIndex, RegistryManifest } from './types'

const manifestModules = import.meta.glob('./generated/manifests/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, RegistryManifest>

export const registryIndex = registryIndexJson as RegistryIndex
export const analytics = analyticsJson
export const generatedMeta = { generatedAt, manifestCount }

export const manifests = Object.values(manifestModules).sort((a, b) =>
  a.id.localeCompare(b.id),
)

export const manifestsById = new Map(manifests.map((manifest) => [manifest.id, manifest]))

export function getCoreManifests(): RegistryManifest[] {
  return registryIndex.coreArtifacts
    .map((id) => manifestsById.get(id))
    .filter((manifest): manifest is RegistryManifest => Boolean(manifest))
}

export function groupByType(): Record<string, number> {
  return manifests.reduce<Record<string, number>>((acc, manifest) => {
    acc[manifest.type] = (acc[manifest.type] ?? 0) + 1
    return acc
  }, {})
}
