export function formatReport({ summary = [], files = [], validation = [], security = [], risks = [], next = '' }) {
  return [
    'Summary:', ...summary.map(s => `- ${s}`), '',
    'Files changed:', ...files.map(f => `- ${f}`), '',
    'Validation:', ...validation.map(v => `- ${v.name}: ${v.status} — ${v.detail}`), '',
    'Security:', ...(security.length ? security.map(s => `- ${s}`) : ['- none found']), '',
    'Remaining risks:', ...(risks.length ? risks.map(r => `- ${r}`) : ['- none']), '',
    'Next recommended action:', `- ${next || 'none'}`
  ].join('\n');
}
