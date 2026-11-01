import fs from "node:fs";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const schema = JSON.parse(fs.readFileSync("schemas/metric-definition.schema.json", "utf8"));
const registry = JSON.parse(fs.readFileSync("registry/miseos-metric-registry.corrected.json", "utf8"));
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);
let ok = true;
for (const metric of registry.metrics) {
  if (!validate(metric)) {
    ok = false;
    console.error(metric.metric_id, validate.errors);
  }
}
if (!ok) process.exit(1);
console.log(`Validated ${registry.metrics.length} metrics.`);
