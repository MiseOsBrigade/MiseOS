export type ObjectStore={put(key:string,body:Uint8Array,options:{contentType:string;metadata:Record<string,string>}):Promise<{etag:string;uri:string}>};
export async function storeArtifact(store:ObjectStore,input:{artifactId:string;bytes:Uint8Array;sha256:string;contentType:string}){
 const key=`artifacts/${input.artifactId}/${input.sha256}`;
 return store.put(key,input.bytes,{contentType:input.contentType,metadata:{sha256:input.sha256,artifactId:input.artifactId}});
}
