export type AnalyticsEvent={eventId:string;eventType:string;occurredAt:string;projectId:string;actorId?:string;chainScope?:string;transactionHash?:string;payload:Record<string,unknown>};
export function toAirbyteRecord(event:AnalyticsEvent){return {type:"RECORD",record:{stream:"miseos_chain_events",emitted_at:Date.now(),data:event}};}
