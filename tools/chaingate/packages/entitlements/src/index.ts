export type SettlementEvidence={source:"stripe"|"onchain";reference:string;status:"pending"|"settled"|"failed";amount:string;currencyOrAsset:string;verifiedAt?:string};
export function entitlementGranted(e:SettlementEvidence):boolean{return e.status==="settled" && Boolean(e.verifiedAt);}
