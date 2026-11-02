import test from 'node:test';
import assert from 'node:assert/strict';
import { parseGitHubRepo, formatStarCount, formatRelativeDate } from './github';

test('parseGitHubRepo accurately parses standard and trailing slash GitHub URLs', () => {
  const p1 = parseGitHubRepo('https://github.com/developer/intravision-ai');
  assert.deepEqual(p1, { owner: 'developer', repo: 'intravision-ai' });

  const p2 = parseGitHubRepo('https://github.com/developer/tradepilot-ai/');
  assert.deepEqual(p2, { owner: 'developer', repo: 'tradepilot-ai' });

  const p3 = parseGitHubRepo('github.com/facebook/react.git');
  assert.deepEqual(p3, { owner: 'facebook', repo: 'react' });

  assert.equal(parseGitHubRepo(''), null);
  assert.equal(parseGitHubRepo('https://example.com/not-github'), null);
});

test('formatStarCount formats counts into readable numbers and k/M suffixes', () => {
  assert.equal(formatStarCount(0), '0');
  assert.equal(formatStarCount(42), '42');
  assert.equal(formatStarCount(999), '999');
  assert.equal(formatStarCount(1200), '1.2k');
  assert.equal(formatStarCount(15000), '15k');
  assert.equal(formatStarCount(250000), '250k');
  assert.equal(formatStarCount(1000000), '1M');
});

test('formatRelativeDate computes accurate relative time intervals', () => {
  const baseNow = new Date('2026-10-29T12:00:00Z');

  // 30 seconds ago
  const t1 = new Date('2026-10-29T11:59:30Z').toISOString();
  assert.equal(formatRelativeDate(t1, baseNow), 'Just now');

  // 15 minutes ago
  const t2 = new Date('2026-10-29T11:45:00Z').toISOString();
  assert.equal(formatRelativeDate(t2, baseNow), '15m ago');

  // 4 hours ago
  const t3 = new Date('2026-10-29T08:00:00Z').toISOString();
  assert.equal(formatRelativeDate(t3, baseNow), '4h ago');

  // 2 days ago
  const t4 = new Date('2026-10-27T12:00:00Z').toISOString();
  assert.equal(formatRelativeDate(t4, baseNow), '2d ago');
});
