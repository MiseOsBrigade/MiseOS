export const ECOSYSTEM_LAYER_IDS = ['character-ip', 'agent-utility', 'participation-economy'] as const;
export type EcosystemLayerId = typeof ECOSYSTEM_LAYER_IDS[number];

export interface EcosystemComponent {
  id: string;
  label: string;
  description: string;
  recordKinds: readonly string[];
}

export interface EcosystemLayer {
  id: EcosystemLayerId;
  order: 1 | 2 | 3;
  name: string;
  surface: string;
  question: string;
  purpose: string;
  strategicRole: string;
  components: readonly EcosystemComponent[];
}

export interface AgentTrustDefinition {
  identity: { characterId: string; role: string; personality?: string };
  capability: { operations: readonly string[]; tools: readonly string[] };
  authority: { permissions: readonly string[]; approvalRequirements: readonly string[] };
  evidence: { proofGates: readonly string[]; metrics: readonly string[]; auditRequired: boolean };
}

export interface EcosystemTransition {
  from: EcosystemLayerId;
  to: EcosystemLayerId;
  mechanism: string;
  requiredEvidence: readonly string[];
}

export interface MiseOSEcosystemModel {
  schema: 'miseos.ecosystem.three-layer.v1';
  category: 'Character-Native Agent Operations';
  positioning: string;
  strategicPrinciple: 'identity + capability + authority + evidence';
  layers: readonly EcosystemLayer[];
  transitions: readonly EcosystemTransition[];
  activationLoop: readonly string[];
  marketEntry: readonly string[];
}
