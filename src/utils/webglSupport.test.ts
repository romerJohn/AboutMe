import test from 'node:test';
import assert from 'node:assert/strict';
import { isWebGLAvailable } from './webglSupport';

test('isWebGLAvailable returns boolean without throwing in Node environments', () => {
  const available = isWebGLAvailable();
  assert.equal(typeof available, 'boolean');
  assert.equal(available, false); // in Node, window/document is undefined
});
