import { appendGithubOutput, appendStepSummary, changedFiles, changedStats, readPolicy, trySh, writeJson } from './mise-utils.mjs';

const policy = readPolicy();
const baseSha = process.env.BASE_SHA || 'HEAD~1';
const headSha = process.env.HEAD_SHA || 'HEAD';
const files = changedFiles(baseSha, headSha);
const stats = changedStats(baseSha, headSha);

const context = {
  engine: 'mise-pack-a-punch-workflow-machine',
  policyVersion: policy.version,
  run: {
    event: process.env.GITHUB_EVENT_NAME || 'local',
    actor: process.env.GITHUB_ACTOR || 'local',
    ref: process.env.GITHUB_REF || trySh('git', ['rev-parse', '--abbrev-ref', 'HEAD'], 'unknown'),
    sha: process.env.GITHUB_SHA || trySh('git', ['rev-parse', 'HEAD'], 'unknown'),
    baseSha,
    headSha,
    repository: process.env.GITHUB_REPOSITORY || 'local'
  },
  measurement: {
    changedFileCount: files.length,
    changedLineCount: stats.changed,
    additions: stats.added,
    deletions: stats.deleted,
    files
  },
  coordinates: policy.stackCoordinates
};

writeJson('mise-measurement-context.json', context);
appendGithubOutput({ changed_file_count: files.length, changed_line_count: stats.changed });
appendStepSummary(`## A0 Measurement Context\n\n- Event: \`${context.run.event}\`\n- Actor: \`${context.run.actor}\`\n- Changed files: **${files.length}**\n- Changed lines: **${stats.changed}**\n`);
console.log(JSON.stringify(context, null, 2));
