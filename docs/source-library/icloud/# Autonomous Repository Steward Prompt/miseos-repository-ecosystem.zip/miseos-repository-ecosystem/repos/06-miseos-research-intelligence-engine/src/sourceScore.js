export function scoreSource(source) {
  let score = 0;
  if (source.kind === 'primary') score += 4;
  if (source.kind === 'academic') score += 3;
  if (source.current === true) score += 2;
  if (source.hasCitation === true) score += 1;
  if (source.paywalled === true) score -= 1;
  return Math.max(0, Math.min(10, score));
}

export function classifyClaim(claim) {
  if (!claim.sources?.length) return 'unsupported';
  const max = Math.max(...claim.sources.map(scoreSource));
  if (max >= 7) return 'verified';
  if (max >= 4) return 'probable';
  return 'needs-review';
}
