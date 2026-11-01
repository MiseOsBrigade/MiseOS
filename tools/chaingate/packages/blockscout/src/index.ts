export type NormalizedReceipt={scope:string;transactionHash:string;status:"pending"|"confirmed"|"failed";blockNumber?:number;from:string;to?:string;method?:string;indexedAt:string};
export async function fetchReceipt(apiBase:string,scope:string,hash:string,fetcher:typeof fetch=fetch):Promise<NormalizedReceipt>{
 const response=await fetcher(`${apiBase}/transactions/${encodeURIComponent(hash)}`);
 if(!response.ok) throw new Error(`Blockscout request failed: ${response.status}`);
 const tx:any=await response.json();
 return {scope,transactionHash:tx.hash??hash,status:tx.status==="ok"?"confirmed":tx.status==="error"?"failed":"pending",blockNumber:tx.block_number,from:tx.from?.hash??tx.from,to:tx.to?.hash??tx.to,method:tx.method,indexedAt:new Date().toISOString()};
}
