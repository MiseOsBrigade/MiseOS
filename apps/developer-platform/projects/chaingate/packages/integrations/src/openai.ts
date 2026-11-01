export type AgentIntentProposal={tool:"prepare_registry_transaction";arguments:Record<string,unknown>;explanation:string};
export type OpenAIResponsesLike={responses:{create(input:unknown):Promise<any>}};
export async function proposeIntent(client:OpenAIResponsesLike,model:string,userRequest:string):Promise<AgentIntentProposal>{
 const response=await client.responses.create({model,input:[{role:"system",content:"Propose only typed blockchain actions. Never claim to sign, broadcast, or possess wallet keys."},{role:"user",content:userRequest}],tools:[{type:"function",name:"prepare_registry_transaction",description:"Prepare an unsigned proof-registry call",parameters:{type:"object",required:["chainScope","registryAddress","artifactHash","metadataUri"],properties:{chainScope:{type:"string"},registryAddress:{type:"string"},artifactHash:{type:"string"},metadataUri:{type:"string"}},additionalProperties:false}}],tool_choice:"required"});
 const call=response.output?.find((x:any)=>x.type==="function_call");
 if(!call) throw new Error("Model did not return the required typed proposal");
 return {tool:call.name,arguments:typeof call.arguments==="string"?JSON.parse(call.arguments):call.arguments,explanation:"AI proposal only; deterministic validation and human approval remain required."};
}
