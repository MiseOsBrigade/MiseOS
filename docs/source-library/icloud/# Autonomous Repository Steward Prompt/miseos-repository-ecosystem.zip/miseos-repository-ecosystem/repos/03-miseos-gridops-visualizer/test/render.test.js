import test from 'node:test';
import assert from 'node:assert/strict';
import { renderGrid } from '../src/render.js';

test('renders all grid modes', () => {
  for (const mode of ['circuit','city','sheets']) {
    const out = renderGrid(mode);
    assert.equal(out.mode, mode);
    assert.equal(out.stations.length, 8);
  }
});
