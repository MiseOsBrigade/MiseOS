import test from "node:test";
import assert from "node:assert/strict";

test("MiseOS scaffold contains expected method names", async () => {
  const fs = await import("node:fs/promises");
  const src = await fs.readFile(new URL("../src/rpcHandler.ts", import.meta.url), "utf8");
  assert.match(src, /wallet_requestExecutionPermissions/);
  assert.match(src, /wallet_revokeExecutionPermission/);
  assert.match(src, /wallet_getSupportedExecutionPermissions/);
  assert.match(src, /wallet_getGrantedExecutionPermissions/);
});
