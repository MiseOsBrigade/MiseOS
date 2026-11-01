import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('profile and templates exist', () => {
  assert.equal(fs.existsSync('profile/README.md'), true);
  assert.equal(fs.existsSync('.github/pull_request_template.md'), true);
});
