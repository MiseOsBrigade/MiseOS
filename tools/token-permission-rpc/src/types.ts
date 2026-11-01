export type Hex = `0x${string}`;
export type Address = `0x${string}`;

export type PermissionType =
  | "miseos-native-token-allowance"
  | "miseos-erc20-token-allowance"
  | "miseos-erc721-token-action"
  | "miseos-nft-mint-window"
  | "miseos-season-drop-mint";

export type RuleType =
  | "expiry"
  | "max-call-count"
  | "max-native-value"
  | "allowed-targets"
  | "allowed-functions"
  | "season-whitelist"
  | "human-approval-required"
  | "domain-verdict"
  | "matrix-risk-threshold";

export interface BasePermission<TData extends Record<string, unknown> = Record<string, unknown>> {
  type: PermissionType | string;
  isAdjustmentAllowed: boolean;
  data: TData;
}

export interface BaseRule<TData extends Record<string, unknown> = Record<string, unknown>> {
  type: RuleType | string;
  data: TData;
}

export interface PermissionRequest {
  chainId: Hex;
  from?: Address;
  to: Address;
  permission: BasePermission;
  rules?: BaseRule[];
  dapp?: {
    origin: string;
    displayName?: string;
    domainVerdict?: "safe" | "unknown" | "suspicious" | "malicious";
  };
}

export interface PermissionDependency {
  factory?: Address;
  factoryData?: Hex;
}

export interface PermissionResponse extends PermissionRequest {
  context: Hex;
  dependencies: PermissionDependency[];
  delegationManager: Address;
  grantedAt: number;
  expiresAt?: number;
  riskScore: number;
  auditId: string;
}

export interface RevokeExecutionPermissionRequestParams {
  permissionContext: Hex;
}

export type GetSupportedExecutionPermissionsResult = Record<
  string,
  {
    chainIds: Hex[];
    ruleTypes: string[];
  }
>;

export interface GrantedPermissionRecord {
  response: PermissionResponse;
  revoked: boolean;
  revokedAt?: number;
}

export interface EthereumProvider {
  request<T = unknown>(args: { method: string; params?: unknown[] | object }): Promise<T>;
}
