#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';

const [, , command, subject, name] = process.argv;

async function exists(file: string) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function init() {
  const target = path.resolve(process.cwd(), 'miseos.yaml');
  if (await exists(target)) {
    console.error('miseos.yaml already exists.');
    process.exitCode = 1;
    return;
  }

  const document = {
    apiVersion: 'miseos.dev/v1alpha1',
    kind: 'Project',
    metadata: { name: path.basename(process.cwd()) },
    workflows: [],
    security: {
      secretsProvider: 'environment',
      allowWalletPrivateKeys: false,
    },
  };

  await fs.writeFile(target, YAML.stringify(document), 'utf8');
  console.log('Created miseos.yaml');
}

async function addWorkflow(workflowName: string | undefined) {
  if (workflowName !== 'pull-request-guardian') {
    console.error('Release 0 supports only: pull-request-guardian');
    process.exitCode = 1;
    return;
  }

  const target = path.resolve(process.cwd(), 'miseos.yaml');
  if (!(await exists(target))) {
    console.error('Run `miseos init` first.');
    process.exitCode = 1;
    return;
  }

  const document = YAML.parse(await fs.readFile(target, 'utf8')) as {
    workflows?: Array<{ uses: string }>;
  };
  const workflows = document.workflows ?? [];
  const uses = 'miseos.workflow.pull-request-guardian@0.1.0';
  if (!workflows.some((workflow) => workflow.uses === uses)) workflows.push({ uses });
  document.workflows = workflows;
  await fs.writeFile(target, YAML.stringify(document), 'utf8');
  console.log('Added Pull Request Guardian to miseos.yaml');
}

if (command === 'init') {
  await init();
} else if (command === 'add' && subject === 'workflow') {
  await addWorkflow(name);
} else {
  console.log(`MiseOS CLI 0.1.0

Usage:
  miseos init
  miseos add workflow pull-request-guardian
`);
}
