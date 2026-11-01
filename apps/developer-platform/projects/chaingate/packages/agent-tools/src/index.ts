import { z } from "zod";
export const PrepareRegistryTransactionInput = z.object({ chainScope:z.string(), registryAddress:z.string(), artifactHash:z.string().regex(/^0x[0-9a-fA-F]{64}$/), metadataUri:z.string().url() });
export type PrepareRegistryTransactionInput = z.infer<typeof PrepareRegistryTransactionInput>;
export type RegistryEncoder = (method:string,args:readonly unknown[])=>`0x${string}`;
export function prepareRegistryTransaction(input:PrepareRegistryTransactionInput, encode:RegistryEncoder){
 const valid=PrepareRegistryTransactionInput.parse(input);
 return { scope:valid.chainScope, to:valid.registryAddress, data:encode("registerArtifact",[valid.artifactHash,valid.metadataUri]), value:"0x0", requiresHumanApproval:true, canSign:false, canBroadcast:false };
}
