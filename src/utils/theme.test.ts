import test from 'node:test';
import assert from 'node:assert/strict';
import { getOppositeTheme } from './theme';

test('getOppositeTheme alternates between dark and light', () => {
  assert.equal(getOppositeTheme('dark'), 'light');
  assert.equal(getOppositeTheme('light'), 'dark');
});
