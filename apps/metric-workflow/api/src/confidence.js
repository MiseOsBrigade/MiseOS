const FACTORS = ["freshness","completeness","source_reliability","calculation_reliability","historical_stability","independent_verification","provenance_completeness"];
export function calculateConfidence(values, weights) {
  for (const key of FACTORS) {
    if (!Number.isFinite(values[key]) || values[key] < 0 || values[key] > 1) throw new Error(`Invalid confidence factor: ${key}`);
  }
  const totalWeight = FACTORS.reduce((sum,key)=>sum+weights[key],0);
  if (Math.abs(totalWeight - 1) > 1e-9) throw new Error("Confidence weights must total 1");
  return Number(FACTORS.reduce((sum,key)=>sum+values[key]*weights[key],0).toFixed(6));
}
