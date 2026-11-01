import crypto from "node:crypto";
import { canonicalize } from "./canonicalize.js";
export function verifySignedManifest(manifest, publicKeyPem) {
  if (!manifest?.signature || manifest.signature.alg !== "ed25519") return false;
  const { signature, ...unsigned } = manifest;
  try {
    return crypto.verify(null, Buffer.from(canonicalize(unsigned)), publicKeyPem, Buffer.from(signature.value, "base64"));
  } catch { return false; }
}
