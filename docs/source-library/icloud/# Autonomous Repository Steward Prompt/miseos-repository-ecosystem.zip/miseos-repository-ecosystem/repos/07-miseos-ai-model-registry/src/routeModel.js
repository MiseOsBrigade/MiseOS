import fs from 'node:fs';
const taxonomy = JSON.parse(fs.readFileSync(new URL('../registry/ai-model-taxonomy.json', import.meta.url), 'utf8'));

export function routeModel(taskType) {
  return taxonomy.routingRules[taskType] || 'generative';
}

export function listModelFamilies() {
  return taxonomy.businessParadigms;
}
