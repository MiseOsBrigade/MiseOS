export type EIP1193Provider = { request(args:{method:string;params?:readonly unknown[]|object}):Promise<unknown>; on?(event:string,listener:(...args:any[])=>void):void; };
export type ProviderDetail = { info:{uuid:string;name:string;icon:string;rdns:string}; provider:EIP1193Provider };
export function discoverInjectedWallets(onProvider:(detail:ProviderDetail)=>void):()=>void {
  const seen=new Set<string>();
  const handler=(event:Event)=>{ const detail=(event as CustomEvent<ProviderDetail>).detail; if(!detail || seen.has(detail.info.uuid)) return; seen.add(detail.info.uuid); onProvider(detail); };
  window.addEventListener("eip6963:announceProvider",handler);
  window.dispatchEvent(new Event("eip6963:requestProvider"));
  return ()=>window.removeEventListener("eip6963:announceProvider",handler);
}
export function safeWalletIconProps(uri:string){ return { src:uri, referrerPolicy:"no-referrer" as const, alt:"Wallet icon" }; }
