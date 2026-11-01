function matches(value, rule) {
  const v = rule.value;
  switch (rule.operator) {
    case ">": return value > v; case ">=": return value >= v; case "<": return value < v; case "<=": return value <= v; case "==": return value === v;
    case "between": return value >= v[0] && value <= v[1];
    case "outside": return value < v[0] || value > v[1];
    default: return false;
  }
}
export function classify(value, thresholds) {
  if (!Number.isFinite(value)) return "unknown";
  if (matches(value, thresholds.green)) return "green";
  if (matches(value, thresholds.red)) return "red";
  if (matches(value, thresholds.amber)) return "amber";
  return "unknown";
}
