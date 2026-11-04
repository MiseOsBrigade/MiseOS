import { modes, stations } from './modes.js';

export function renderGrid(mode = 'circuit') {
  if (!modes[mode]) throw new Error('Unknown mode');
  return { mode, description: modes[mode].metaphor, stations: stations.map((name, index) => ({ id: index + 1, name })) };
}
