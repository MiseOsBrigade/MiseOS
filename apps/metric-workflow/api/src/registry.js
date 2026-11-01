import fs from "node:fs";
export function loadMetricRegistry(filePath) {
  const registry = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const byId = new Map(registry.metrics.map(metric => [metric.metric_id, Object.freeze(metric)]));
  if (byId.size !== registry.metrics.length) throw new Error("Duplicate metric_id in registry");
  return Object.freeze({ ...registry, byId });
}
