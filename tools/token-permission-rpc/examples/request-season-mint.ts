import { MiseOSExecutionPermissionRpc } from "../src/rpcHandler";
import { PermissionRequest } from "../src/types";

const rpc = new MiseOSExecutionPermissionRpc({
  delegationManager: "0x0000000000000000000000000000000000007715",
  supportedChains: ["0x1", "0x2105"],
  humanApproval: async (_request, riskScore) => {
    console.log("Human approval required. Risk:", riskScore.toFixed(3));
    return true;
  },
});

const oneHour = Math.floor(Date.now() / 1000) + 3600;

const request: PermissionRequest = {
  chainId: "0x2105",
  to: "0x016562aA41A8697720ce0943F003141f5dEAe006",
  permission: {
    type: "miseos-season-drop-mint",
    isAdjustmentAllowed: true,
    data: {
      seasonId: "genesis",
      maxMints: "0x1",
    },
  },
  rules: [
    { type: "expiry", data: { timestamp: oneHour } },
    { type: "max-call-count", data: { count: 1 } },
    { type: "season-whitelist", data: { listId: "miseos-genesis-v1" } },
    { type: "human-approval-required", data: { reason: "NFT mint permission" } },
  ],
  dapp: {
    origin: "https://miseos.example",
    displayName: "MiseOS Command Kitchen",
    domainVerdict: "unknown",
  },
};

const response = await rpc.handle("wallet_requestExecutionPermissions", [request]);
console.log(JSON.stringify(response, null, 2));
