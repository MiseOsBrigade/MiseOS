export type PermissionMap = Record<string, Record<string, string>>;

export interface MiseAgentDefinition {
  id: string;
  name: string;
  capabilities: string[];
  permissions: PermissionMap;
  safeToRunWithoutHuman: boolean;
  requiresNetwork: boolean;
  outputs: string[];
}

export declare function defineAgent(definition: MiseAgentDefinition): MiseAgentDefinition;
