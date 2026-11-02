import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTilt } from './tilt';

test('calculateTilt returns neutral center rotation at midpoint', () => {
  const center = calculateTilt(200, 300, 400, 600, 12);
  assert.equal(center.rotateX, 0);
  assert.equal(center.rotateY, 0);
  assert.equal(center.glareX, 50);
  assert.equal(center.glareY, 50);
});

test('calculateTilt tilts up when top-center is hovered', () => {
  const topCenter = calculateTilt(200, 0, 400, 600, 12);
  // normalizedY is -0.5, so rotateX is -(-0.5)*24 = 12
  assert.equal(topCenter.rotateX, 12);
  assert.equal(topCenter.rotateY, 0);
  assert.equal(topCenter.glareX, 50);
  assert.equal(topCenter.glareY, 0);
});

test('calculateTilt tilts right when right-center is hovered', () => {
  const rightCenter = calculateTilt(400, 300, 400, 600, 12);
  // normalizedX is 0.5, so rotateY is 0.5*24 = 12
  assert.equal(rightCenter.rotateX, 0);
  assert.equal(rightCenter.rotateY, 12);
  assert.equal(rightCenter.glareX, 100);
  assert.equal(rightCenter.glareY, 50);
});

test('calculateTilt clamps outside coordinates cleanly', () => {
  const outside = calculateTilt(1000, -500, 400, 600, 10);
  assert.equal(outside.rotateX, 10);
  assert.equal(outside.rotateY, 10);
  assert.equal(outside.glareX, 100);
  assert.equal(outside.glareY, 0);
});

test('calculateTilt handles zero dimensions safely', () => {
  const zero = calculateTilt(10, 10, 0, 0);
  assert.equal(zero.rotateX, 0);
  assert.equal(zero.rotateY, 0);
});
