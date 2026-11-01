export type RegistryType =
  | 'package'
  | 'container'
  | 'agent'
  | 'policy'
  | 'workflow'
  | 'template'
  | 'sdk'
  | 'analytics'
  | 'schema'

export interface RegistryOwner {
  name: string
  kind: 'person' | 'team' | 'organization'
  github?: string
}

export interface RegistryManifest {
  schemaVersion: string
  id: string
  name: string
  type: RegistryType
  version: string
  status: string
  owner: RegistryOwner
  description: string
  artifacts: Record<string, string>
  capabilities: string[]
  permissions: Record<string, unknown>
  trust: Record<string, unknown>
  changePolicy: Record<string, string>
  agentContract: {
    loadStrategy: string
    safeToRunWithoutHuman: boolean
    requiresNetwork: boolean
    outputs: string[]
    executionMode: string
  }
  analytics: {
    criticality: 'low' | 'medium' | 'high' | 'critical'
    maturity: 'seed' | 'alpha' | 'beta' | 'stable'
    riskWeight: number
    operationalTier: string
  }
  release: Record<string, string>
  answers: Record<string, string>
}

export interface RegistryIndex {
  id: string
  name: string
  version: string
  description: string
  bootSequence: string[]
  namespaces: Record<string, string>
  coreArtifacts: string[]
}

export interface RiskSummary {
  id: string
  score: number
  level: 'low' | 'medium' | 'high'
  reasons: string[]
}
