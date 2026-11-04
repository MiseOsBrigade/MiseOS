import test from 'node:test';
import assert from 'node:assert/strict';
import { getColor, getCharacter } from '../src/brand.js';

test('brand colors exist', () => {
  assert.equal(getColor('gold'), '#D9A941');
});

test('character roster includes Repo Pet', () => {
  assert.equal(getCharacter('repo-pet').name, 'MiseOS Repo Pet');
});
