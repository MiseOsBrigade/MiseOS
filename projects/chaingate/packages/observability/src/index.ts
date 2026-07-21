export type AuditEvent={traceId:string;event:string;actorType:"user"|"agent"|"service";actorId:string;projectId:string;intentId?:string;chainScope?:string;transactionHash?:string;outcome:"started"|"allowed"|"denied"|"failed"|"confirmed";timestamp:string;details:Record<string,unknown>};
export interface AuditSink{write(event:AuditEvent):Promise<void>}
export async function audit(sink:AuditSink,event:Omit<AuditEvent,"timestamp">){await sink.write({...event,timestamp:new Date().toISOString()});}
