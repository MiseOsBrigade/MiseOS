import path from "node:path";
import express from "express";
import helmet from "helmet";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { loadConfig } from "./config.js";
import { loadMetricRegistry } from "./registry.js";
import { JsonlObservationStore } from "./store.js";
import { MetricService } from "./metricService.js";
import { verifySignedManifest } from "./manifestVerifier.js";
import { loadWorkflowRegistry } from "./workflowRegistry.js";
import { executeWorkflow } from "./workflowExecutor.js";

export function createApp(config=loadConfig()){
 const root=process.cwd(); const registry=loadMetricRegistry(path.resolve(root,config.registryPath)); const store=new JsonlObservationStore(path.resolve(root,config.observationPath)); const metrics=new MetricService(registry,store); const workflowDir=path.resolve(root,"workflow/actions"); const workflowRegistry=loadWorkflowRegistry(path.resolve(root,"workflow/registry.json"));
 const app=express(); app.disable("x-powered-by"); app.use(helmet({contentSecurityPolicy:{useDefaults:false,directives:{defaultSrc:["'self'"],scriptSrc:["'self'"],styleSrc:["'self'"],imgSrc:["'self'","data:"],connectSrc:["'self'"],objectSrc:["'none'"],baseUri:["'none'"],frameAncestors:["'none'"],formAction:["'self'"]}}})); app.use(express.json({limit:"256kb"})); app.use(express.static(path.resolve(root,"frontend"))); app.use("/manifests", express.static(path.resolve(root,"workflow/manifests")));
 app.get("/health",(_,res)=>res.json({ok:true,metrics:registry.metrics.length}));
 app.get("/api/metrics",(_,res)=>res.json(registry.metrics));
 app.get("/api/observations",(req,res)=>res.json(store.list(req.query.metric_id)));
 app.post("/api/metrics/calculate",(req,res)=>{try{res.status(201).json(metrics.calculate(req.body));}catch(e){res.status(400).json({error:e.message});}});
 app.post("/api/manifests/verify",(req,res)=>{const valid=verifySignedManifest(req.body,config.manifestPublicKey);res.status(valid?200:400).json({valid});});
 app.post("/api/workflows/execute",async(req,res)=>{try{const {manifest,actionId,context={}}=req.body;if(!verifySignedManifest(manifest,config.manifestPublicKey))return res.status(403).json({error:"Invalid manifest signature"});const hotspot=manifest.hotspots?.find(h=>h.actionId===actionId);if(!hotspot)return res.status(403).json({error:"Action not declared by manifest"});const metric=registry.byId.get(hotspot.metricGate?.metricId);if(hotspot.metricGate && !metric)return res.status(400).json({error:"Unknown metric gate"});if(hotspot.metricGate){const observations=store.list(hotspot.metricGate.metricId);const latest=observations.at(-1);if(!latest||latest.status===hotspot.metricGate.blockOnStatus||latest.confidence<hotspot.metricGate.minimumConfidence)return res.status(403).json({error:"Metric governance gate denied action"});}const result=await executeWorkflow(actionId,{...context,manifestId:manifest.manifest_id},workflowRegistry,workflowDir);res.json({ok:true,result});}catch(e){res.status(400).json({error:e.message});}});
 return app;
}
if(import.meta.url===`file://${process.argv[1]}`){const config=loadConfig();createApp(config).listen(config.port,()=>console.log(`MiseOS API listening on ${config.port}`));}
