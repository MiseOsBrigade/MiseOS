import { createHash } from "node:crypto";

export type ArtifactManifest = { schema:"miseos.provenance.v1"; artifactId:string; artifactSha256:string; metadataSha256:string; storageUri:string; issuerAccount:string; issuedAt:string; externalIds:Record<string,string>; };
export function sha256(data: Uint8Array|string): string { return createHash("sha256").update(data).digest("hex"); }
export function createManifest(input: Omit<ArtifactManifest,"schema"|"issuedAt">): ArtifactManifest { return { schema:"miseos.provenance.v1", issuedAt:new Date().toISOString(), ...input }; }
export function manifestDigest(manifest: ArtifactManifest): string { return sha256(JSON.stringify(manifest)); }
