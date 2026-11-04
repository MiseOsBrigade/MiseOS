import { appendStepSummary, readPolicy, writeJson } from './mise-utils.mjs';

const policy = readPolicy();
const coordinates = policy.stackCoordinates;

const mermaid = [
  '```mermaid',
  'flowchart LR',
  '  A0[A0: measurement-context] --> B1[B1: risk-gate]',
  '  B1 --> C2[C2: quality-stack]',
  '  B1 --> D3[D3: supply-chain-scan]',
  '  B1 --> E4[E4: branch-advisor]',
  '  C2 --> F5[F5: evidence-report]',
  '  D3 --> F5',
  '  E4 --> F5',
  '  B1 --> F5',
  '```'
].join('\n');

const table = [
  '| Coordinate | Stack Node | Purpose |',
  '|---|---|---|',
  ...coordinates.map((node) => `| ${node.id} | ${node.name} | ${node.purpose} |`)
].join('\n');

const report = { gate: 'stack-graph', mermaid, table, coordinates };
writeJson('mise-stack-graph.json', report);
appendStepSummary(`## Stack Coordinate Graph\n\n${mermaid}\n\n${table}\n`);
console.log(`${mermaid}\n\n${table}`);
