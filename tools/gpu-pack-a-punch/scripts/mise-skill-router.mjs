#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';

const indexPath = process.argv[2] || '.mise_out/skill-pack-index.json';
const query = (process.argv.slice(3).join(' ') || process.env.MISE_SKILL_QUERY || '').toLowerCase();

if (!existsSync(indexPath)) {
  // No index yet — emit empty match result rather than failing
  console.log(JSON.stringify({ query, match_count: 0, matches: [], note: "index not found (empty vendor state)" }, null, 2));
  process.exit(0);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const skills = Array.isArray(index.skills) ? index.skills : [];
const matches = skills
  .map((skill) => {
    const haystack = [skill.name, skill.first_heading, skill.path].filter(Boolean).join(' ').toLowerCase();
    const score = query ? query.split(/\s+/).filter((term) => term && haystack.includes(term)).length : 0;
    return { score, name: skill.name, heading: skill.first_heading, path: skill.path };
  })
  .filter((item) => !query || item.score > 0)
  .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
  .slice(0, 10);

console.log(JSON.stringify({ query, match_count: matches.length, matches }, null, 2));
