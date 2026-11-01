import path from 'node:path';

function int(name, fallback) {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} must be a positive number`);
  }
  return value;
}

export const config = Object.freeze({
  port: int('PORT', 3000),
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:8080',
  appDomain: process.env.APP_DOMAIN ?? 'localhost',
  sessionTtlMs: int('SESSION_TTL_MS', 24 * 60 * 60 * 1000),
  nonceTtlMs: int('NONCE_TTL_MS', 5 * 60 * 1000),
  workflowTimeoutMs: int('WORKFLOW_TIMEOUT_MS', 30_000),
  maxImageBytes: int('MAX_IMAGE_BYTES', 10 * 1024 * 1024),
  publicKeyPath: path.resolve(
    process.env.MANIFEST_PUBLIC_KEY_PATH ?? './keys/manifest-public.pem'
  ),
  rpcUrl: process.env.RPC_URL ?? '',
  nftContractAddress: process.env.NFT_CONTRACT_ADDRESS ?? '',
  nftTokenStandard: process.env.NFT_TOKEN_STANDARD ?? 'ERC721',
  nftTokenId: process.env.NFT_TOKEN_ID ?? ''
});
