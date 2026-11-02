import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isProjectBookmarked,
  toggleProjectBookmark,
  generateProjectLink
} from './bookmarks';

test('isProjectBookmarked correctly checks presence in array', () => {
  const saved = ['intravision-ai', 'tradepilot-ai'];
  assert.equal(isProjectBookmarked('intravision-ai', saved), true);
  assert.equal(isProjectBookmarked('tradepilot-ai', saved), true);
  assert.equal(isProjectBookmarked('developer-laboratory', saved), false);
});

test('toggleProjectBookmark adds and removes project IDs immutably', () => {
  const initial: string[] = ['intravision-ai'];

  // Add tradepilot-ai
  const afterAdd = toggleProjectBookmark('tradepilot-ai', initial);
  assert.deepEqual(afterAdd, ['intravision-ai', 'tradepilot-ai']);
  assert.deepEqual(initial, ['intravision-ai']); // Check immutability

  // Remove intravision-ai
  const afterRemove = toggleProjectBookmark('intravision-ai', afterAdd);
  assert.deepEqual(afterRemove, ['tradepilot-ai']);
});

test('generateProjectLink constructs permalink with hash', () => {
  const link1 = generateProjectLink('intravision-ai', 'https://example.com');
  assert.equal(link1, 'https://example.com#project-intravision-ai');

  const link2 = generateProjectLink('tradepilot-ai', 'https://example.com/');
  assert.equal(link2, 'https://example.com#project-tradepilot-ai');
});
