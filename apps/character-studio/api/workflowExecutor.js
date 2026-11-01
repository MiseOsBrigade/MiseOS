import { config } from './config.js';
import { inspectCharacter } from '../workflow/inspect.js';
import { launchWorkflow } from '../workflow/launch-workflow.js';
import { openRegistry } from '../workflow/open-registry.js';

const handlers = Object.freeze({
  'character.inspect': inspectCharacter,
  'workflow.launch': launchWorkflow,
  'registry.open': openRegistry
});

export function workflowExists(actionId) {
  return Object.hasOwn(handlers, actionId);
}

export async function executeWorkflow(actionId, context) {
  const handler = handlers[actionId];
  if (!handler) throw new Error('Workflow is not allowlisted');

  return Promise.race([
    handler(Object.freeze(structuredClone(context))),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Workflow timeout')), config.workflowTimeoutMs);
    })
  ]);
}

export function listWorkflows() {
  return Object.keys(handlers);
}
