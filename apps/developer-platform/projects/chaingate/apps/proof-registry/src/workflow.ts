import { createManifest, manifestDigest, sha256 } from "@miseos/chaingate-core";
import { prepareRegistryTransaction, type RegistryEncoder } from "@miseos/agent-tools";

export function buildProofRegistration(input:{bytes:Uint8Array;metadata:unknown;storageUri:string;issuerAccount:string;registryAddress:string;chainScope:string},encode:RegistryEncoder){
 const artifactSha256=sha256(input.bytes);
 const metadataSha256=sha256(JSON.stringify(input.metadata));
 const manifest=createManifest({artifactId:crypto.randomUUID(),artifactSha256,metadataSha256,storageUri:input.storageUri,issuerAccount:input.issuerAccount,externalIds:{}});
 const digest=manifestDigest(manifest);
 const transaction=prepareRegistryTransaction({chainScope:input.chainScope,registryAddress:input.registryAddress,artifactHash:`0x${artifactSha256}`,metadataUri:input.storageUri},encode);
 return {manifest,digest,transaction,next:["simulate","evaluate-policy","show-human-preview","request-wallet-signature","broadcast","verify-with-blockscout"]};
}
