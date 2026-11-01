export function defineAgent(definition) {
  const required = ['id', 'name', 'capabilities', 'permissions', 'safeToRunWithoutHuman', 'requiresNetwork', 'outputs'];
  for (const key of required) {
    if (!(key in definition)) {
      throw new Error(`Agent definition missing required field: ${key}`);
    }
  }
  if (!Array.isArray(definition.capabilities) || definition.capabilities.length === 0) {
    throw new Error('Agent must declare at least one capability');
  }
  return Object.freeze({ ...definition });
}
