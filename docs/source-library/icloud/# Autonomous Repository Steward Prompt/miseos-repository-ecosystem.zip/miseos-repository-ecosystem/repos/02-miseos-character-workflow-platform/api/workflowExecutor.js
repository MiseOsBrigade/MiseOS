import fs from 'node:fs';
import { inspect } from '../workflow/inspect.js';
import { attest_asset } from '../workflow/attest_asset.js';
import { launch_workflow } from '../workflow/launch_workflow.js';

const registry = JSON.parse(fs.readFileSync(new URL('../workflow/registry.json', import.meta.url), 'utf8'));
const handlers = { inspect, attest_asset, launch_workflow };

export async function executeWorkflow(actionId, context = {}) {
  const entry = registry[actionId];
  if (!entry) throw new Error('Action not allowlisted');
  const fn = handlers[entry.handler];
  if (!fn) throw new Error('Workflow handler missing');
  return await fn(context);
}
