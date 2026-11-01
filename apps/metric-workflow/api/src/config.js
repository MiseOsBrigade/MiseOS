function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
export function loadConfig() {
  const port = Number(process.env.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT must be 1-65535");
  return Object.freeze({
    port,
    manifestPublicKey: required("MANIFEST_PUBLIC_KEY"),
    registryPath: process.env.METRIC_REGISTRY_PATH ?? "registry/miseos-metric-registry.corrected.json",
    observationPath: process.env.OBSERVATION_PATH ?? "data/metric-observations.jsonl",
    nodeEnv: process.env.NODE_ENV ?? "development"
  });
}
