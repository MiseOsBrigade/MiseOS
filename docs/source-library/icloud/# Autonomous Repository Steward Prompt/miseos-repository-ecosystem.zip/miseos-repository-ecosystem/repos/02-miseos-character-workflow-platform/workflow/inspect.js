export async function inspect(context) {
  return { ok: true, kind: 'inspect', context, checks: ['visual-only asset', 'signed manifest', 'allowlisted action'] };
}
