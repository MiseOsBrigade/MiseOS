function divide(a,b,policy) {
  if (b !== 0) return a/b;
  if (policy === "zero") return 0; if (policy === "one") return 1; if (policy === "error") throw new Error("Zero denominator");
  return null;
}
export function calculateValue(metric, inputs) {
  const expr = metric.calculation.expression;
  if (expr.includes(" / ") && metric.calculation.inputs.length === 2) {
    const [a,b] = metric.calculation.inputs.map(k => Number(inputs[k]));
    if (![a,b].every(Number.isFinite)) throw new Error("Missing numeric calculation input");
    return divide(a,b,metric.calculation.zero_denominator_policy);
  }
  if (expr.startsWith("avg(") && Array.isArray(inputs.samples)) {
    return inputs.samples.length ? inputs.samples.reduce((a,b)=>a+b,0)/inputs.samples.length : null;
  }
  if (expr === "percent_promoters - percent_detractors") return Number(inputs.percent_promoters)-Number(inputs.percent_detractors);
  if (expr.startsWith("revenue - ")) return metric.calculation.inputs.reduce((total,key,index)=> index===0 ? Number(inputs[key]) : total-Number(inputs[key]),0);
  if (expr === "weighted_sum(domain_scores)") {
    const scores=inputs.domain_scores; const weights=inputs.weights;
    return Object.keys(scores).reduce((sum,k)=>sum+scores[k]*(weights[k]??0),0);
  }
  throw new Error(`Unsupported calculation expression: ${expr}`);
}
