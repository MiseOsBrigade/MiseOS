import fs from "node:fs";
import crypto from "node:crypto";
import { canonicalize } from "../api/src/canonicalize.js";

const [input, output, keyFile, keyId = "dev-key-1"] = process.argv.slice(2);
if (!input || !output || !keyFile) {
  throw new Error("Usage: node scripts/sign-manifest.mjs in.json out.json private.pem [keyId]");
}
const manifest = JSON.parse(fs.readFileSync(input, "utf8"));
delete manifest.signature;
const value = crypto.sign(
  null,
  Buffer.from(canonicalize(manifest)),
  fs.readFileSync(keyFile)
).toString("base64");
fs.writeFileSync(
  output,
  JSON.stringify({ ...manifest, signature: { alg: "ed25519", keyId, value } }, null, 2) + "\n"
);
console.log(`Signed ${output}`);
