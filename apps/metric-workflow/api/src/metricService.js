import crypto from "node:crypto";
import { canonicalize } from "./canonicalize.js";
import { calculateConfidence } from "./confidence.js";
import { calculateValue } from "./calculations.js";
import { classify } from "./thresholds.js";
export class MetricService {
  constructor(registry,store){this.registry=registry;this.store=store;}
  calculate({metricId,inputs,confidenceFactors,window,dimensions={},evidence=[]}) {
    const metric=this.registry.byId.get(metricId); if(!metric) throw new Error("Unknown metric_id");
    const evidenceHash=crypto.createHash("sha256").update(canonicalize(evidence)).digest("hex");
    const value=calculateValue(metric,inputs);
    const confidence=calculateConfidence(confidenceFactors,metric.confidence_policy.factors);
    const status=classify(value,metric.thresholds);
    const evidenceComplete=!metric.governance.requires_provenance || evidence.length>0;
    const eligible=Boolean(metric.governance.automation_allowed && evidenceComplete && confidence>=metric.confidence_policy.minimum_for_automation && status!=="unknown");
    const seed=canonicalize({metricId,inputs,window,dimensions,evidenceHash,version:metric.version});
    const observation={observation_id:`obs_${crypto.createHash("sha256").update(seed).digest("hex").slice(0,24)}`,metric_id:metricId,calculated_at:new Date().toISOString(),window,value,status,confidence,confidence_factors:confidenceFactors,dimensions,evidence_snapshot_hash:evidenceHash,calculation_version:metric.version,inputs,automation:{eligible,reason:eligible?"Policy, confidence, and evidence gates passed":"One or more automation gates failed"}};
    this.store.append(observation); return observation;
  }
}
