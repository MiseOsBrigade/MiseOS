import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import Ajv2020 from "ajv/dist/2020.js";

test("all metrics validate", () => {
  const schema = JSON.parse(fs.readFileSync("schemas/metric-definition.schema.json", "utf8"));
  const reg = JSON.parse(fs.readFileSync("registry/miseos-metric-registry.corrected.json", "utf8"));
  const validate = new Ajv2020({ strict: false }).compile(schema);
  for (const m of reg.metrics) {
    assert.equal(validate(m), true, `${m.metric_id}: ${JSON.stringify(validate.errors)}`);
  }
});
