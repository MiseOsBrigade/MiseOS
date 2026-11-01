import crypto from "node:crypto";
import {
  Address,
  GetSupportedExecutionPermissionsResult,
  GrantedPermissionRecord,
  Hex,
  PermissionRequest,
  PermissionResponse,
  RevokeExecutionPermissionRequestParams,
} from "./types";
import { scorePermissionRequest } from "./miseMatrixMetric";

export interface PermissionStore {
  granted: Map<Hex, GrantedPermissionRecord>;
  audit: Array<Record<string, unknown>>;
}

export interface RpcHandlerOptions {
  delegationManager: Address;
  supportedChains: Hex[];
  humanApproval?: (request: PermissionRequest, riskScore: number) => Promise<boolean>;
}

const DEFAULT_SUPPORTED_PERMISSION_TYPES = [
  "miseos-native-token-allowance",
  "miseos-erc20-token-allowance",
  "miseos-erc721-token-action",
  "miseos-nft-mint-window",
  "miseos-season-drop-mint",
] as const;

const DEFAULT_RULE_TYPES = [
  "expiry",
  "max-call-count",
  "max-native-value",
  "allowed-targets",
  "allowed-functions",
  "season-whitelist",
  "human-approval-required",
  "domain-verdict",
  "matrix-risk-threshold",
];

function asHex(buffer: Buffer): Hex {
  return `0x${buffer.toString("hex")}`;
}

function contextFor(request: PermissionRequest): Hex {
  const canonical = JSON.stringify(request, Object.keys(request).sort());
  return asHex(crypto.createHash("sha256").update(canonical).update(String(Date.now())).digest());
}

function auditIdFor(context: Hex): string {
  return crypto.createHash("sha256").update(context).digest("hex").slice(0, 24);
}

function extractExpiry(request: PermissionRequest): number | undefined {
  const expiry = request.rules?.find((rule) => rule.type === "expiry");
  const timestamp = Number(expiry?.data?.timestamp ?? 0);
  return timestamp > 0 ? timestamp : undefined;
}

function isExpired(response: PermissionResponse): boolean {
  return Boolean(response.expiresAt && response.expiresAt <= Math.floor(Date.now() / 1000));
}

export class MiseOSExecutionPermissionRpc {
  readonly store: PermissionStore = {
    granted: new Map(),
    audit: [],
  };

  constructor(private readonly options: RpcHandlerOptions) {}

  getSupportedExecutionPermissions(): GetSupportedExecutionPermissionsResult {
    return Object.fromEntries(
      DEFAULT_SUPPORTED_PERMISSION_TYPES.map((type) => [
        type,
        { chainIds: this.options.supportedChains, ruleTypes: DEFAULT_RULE_TYPES },
      ]),
    );
  }

  getGrantedExecutionPermissions(): PermissionResponse[] {
    return Array.from(this.store.granted.values())
      .filter((record) => !record.revoked && !isExpired(record.response))
      .map((record) => record.response);
  }

  async requestExecutionPermissions(requests: PermissionRequest[]): Promise<PermissionResponse[]> {
    const responses: PermissionResponse[] = [];

    for (const request of requests) {
      const risk = scorePermissionRequest(request);
      const allowedChain = this.options.supportedChains.includes(request.chainId);
      if (!allowedChain) {
        throw Object.assign(new Error(`Unsupported chainId ${request.chainId}`), { code: 4902 });
      }

      if (risk.requiresHumanApproval) {
        const approved = await this.options.humanApproval?.(request, risk.score);
        if (!approved) {
          throw Object.assign(new Error("User rejected high-risk permission request"), { code: 4001 });
        }
      }

      const context = contextFor(request);
      const response: PermissionResponse = {
        ...request,
        context,
        dependencies: [],
        delegationManager: this.options.delegationManager,
        grantedAt: Math.floor(Date.now() / 1000),
        expiresAt: extractExpiry(request),
        riskScore: risk.score,
        auditId: auditIdFor(context),
      };

      this.store.granted.set(context, {
        response,
        revoked: false,
      });

      this.store.audit.push({
        event: "PERMISSION_GRANTED",
        context,
        auditId: response.auditId,
        risk,
        at: new Date().toISOString(),
      });

      responses.push(response);
    }

    return responses;
  }

  revokeExecutionPermission(params: RevokeExecutionPermissionRequestParams): Record<string, never> {
    const existing = this.store.granted.get(params.permissionContext);
    if (!existing) {
      throw Object.assign(new Error("Unknown permission context"), { code: 4100 });
    }

    existing.revoked = true;
    existing.revokedAt = Math.floor(Date.now() / 1000);
    this.store.audit.push({
      event: "PERMISSION_REVOKED",
      context: params.permissionContext,
      at: new Date().toISOString(),
    });

    return {};
  }

  async handle(method: string, params: unknown): Promise<unknown> {
    switch (method) {
      case "wallet_getSupportedExecutionPermissions":
        return this.getSupportedExecutionPermissions();

      case "wallet_getGrantedExecutionPermissions":
        return this.getGrantedExecutionPermissions();

      case "wallet_requestExecutionPermissions":
        if (!Array.isArray(params)) {
          throw Object.assign(new Error("params must be PermissionRequest[]"), { code: -32602 });
        }
        return this.requestExecutionPermissions(params as PermissionRequest[]);

      case "wallet_revokeExecutionPermission":
        return this.revokeExecutionPermission(params as RevokeExecutionPermissionRequestParams);

      default:
        throw Object.assign(new Error(`Unsupported method ${method}`), { code: -32601 });
    }
  }
}
