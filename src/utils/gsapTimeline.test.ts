import test from 'node:test';
import assert from 'node:assert/strict';
import { gsap } from 'gsap';

test('gsap is loaded and can create timelines', () => {
  assert.ok(gsap);
  assert.equal(typeof gsap.timeline, 'function');

  const tl = gsap.timeline({ paused: true });
  assert.equal(typeof tl.fromTo, 'function');
  assert.equal(typeof tl.to, 'function');
});

test('gsap context handles scoped teardown without errors', () => {
  const ctx = gsap.context(() => {});
  assert.equal(typeof ctx.revert, 'function');
  ctx.revert();
});
