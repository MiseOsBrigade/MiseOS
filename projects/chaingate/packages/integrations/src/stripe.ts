import { createHmac,timingSafeEqual } from "node:crypto";
export type StripeEvent={id:string;type:string;data:{object:any}};
export function verifyStripeSignature(rawBody:string,signatureHeader:string,secret:string,toleranceSeconds=300):boolean{
 const parts=Object.fromEntries(signatureHeader.split(",").map(p=>p.split("=") as [string,string]));
 const timestamp=Number(parts.t); const signature=parts.v1; if(!timestamp||!signature) return false;
 if(Math.abs(Date.now()/1000-timestamp)>toleranceSeconds) return false;
 const expected=createHmac("sha256",secret).update(`${timestamp}.${rawBody}`).digest("hex");
 const a=Buffer.from(expected,"hex"),b=Buffer.from(signature,"hex"); return a.length===b.length&&timingSafeEqual(a,b);
}
export function settlementFromStripe(event:StripeEvent){
 const object=event.data.object;
 return {source:"stripe" as const,reference:event.id,status:event.type==="checkout.session.completed"?"settled" as const:"pending" as const,amount:String(object.amount_total??0),currencyOrAsset:String(object.currency??"usd"),verifiedAt:new Date().toISOString()};
}
