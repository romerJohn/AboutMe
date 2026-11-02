import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRadialGlow } from './radialGlow';

test('calculateRadialGlow positions gradient accurately at mouse coordinates', () => {
  const result = calculateRadialGlow(120, 85, 300, 400);
  assert.equal(result.x, 120);
  assert.equal(result.y, 85);
  assert.ok(result.background.includes('120px 85px'));
  assert.ok(result.background.includes('rgba(0, 229, 255, 0.15)'));
});

test('calculateRadialGlow clamps coordinates within element bounds', () => {
  const outOfBounds = calculateRadialGlow(-50, 600, 300, 400);
  assert.equal(outOfBounds.x, 0);
  assert.equal(outOfBounds.y, 400);
  assert.ok(outOfBounds.background.includes('0px 400px'));
});

test('calculateRadialGlow respects custom color and radius options', () => {
  const custom = calculateRadialGlow(50, 50, 200, 200, {
    color: 'rgba(0, 229, 255, 0.25)',
    radius: 450,
    falloffPercent: 70
  });
  assert.ok(custom.background.includes('450px circle'));
  assert.ok(custom.background.includes('rgba(0, 229, 255, 0.25)'));
  assert.ok(custom.background.includes('70%'));
});
