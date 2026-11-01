import { readFileSync } from "node:fs";
const catalog = JSON.parse(readFileSync(new URL("../payments/miseos-fileops-products.json", import.meta.url), "utf8"));
const errors = [];
if (catalog.currency !== "usd") errors.push("currency must be usd");
if (!Array.isArray(catalog.packages) || catalog.packages.length < 1) errors.push("packages must be non-empty");
const ids = new Set();
for (const plan of catalog.packages ?? []) { if (!plan.id) errors.push("plan missing id"); if (ids.has(plan.id)) errors.push(`duplicate plan id ${plan.id}`); ids.add(plan.id); if (!plan.name) errors.push(`${plan.id} missing name`); if (plan.price_cents !== null && (!Number.isInteger(plan.price_cents) || plan.price_cents < 0)) errors.push(`${plan.id} has invalid price_cents`); if (!Array.isArray(plan.features) || plan.features.length < 2) errors.push(`${plan.id} needs at least two features`); }
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(`MiseOS FileOps payment catalog valid: ${catalog.packages.length} packages.`);
