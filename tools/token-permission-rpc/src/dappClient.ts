import { EthereumProvider, PermissionRequest, PermissionResponse, RevokeExecutionPermissionRequestParams } from "./types";

export async function getSupportedExecutionPermissions(provider: EthereumProvider) {
  return provider.request({
    method: "wallet_getSupportedExecutionPermissions",
    params: [],
  });
}

export async function requestExecutionPermissions(
  provider: EthereumProvider,
  requests: PermissionRequest[],
): Promise<PermissionResponse[]> {
  return provider.request<PermissionResponse[]>({
    method: "wallet_requestExecutionPermissions",
    params: requests,
  });
}

export async function revokeExecutionPermission(
  provider: EthereumProvider,
  permissionContext: `0x${string}`,
): Promise<Record<string, never>> {
  const params: RevokeExecutionPermissionRequestParams = { permissionContext };
  return provider.request<Record<string, never>>({
    method: "wallet_revokeExecutionPermission",
    params,
  });
}

export async function getGrantedExecutionPermissions(
  provider: EthereumProvider,
): Promise<PermissionResponse[]> {
  return provider.request<PermissionResponse[]>({
    method: "wallet_getGrantedExecutionPermissions",
    params: [],
  });
}
