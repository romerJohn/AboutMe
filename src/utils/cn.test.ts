import test from 'node:test';
import assert from 'node:assert/strict';
import { cn } from './cn';

test('cn correctly concatenates string classnames', () => {
  const result = cn('px-4', 'py-2', 'bg-black');
  assert.equal(result, 'px-4 py-2 bg-black');
});

test('cn handles conditional falsy arguments and objects', () => {
  const isHovered = false;
  const isActive = true;
  const result = cn(
    'text-white',
    isHovered && 'bg-cyan-500',
    { 'border-cyan-400': isActive, 'opacity-50': false },
    undefined,
    null
  );
  assert.equal(result, 'text-white border-cyan-400');
});

test('cn resolves conflicting Tailwind utility classes', () => {
  const result = cn('px-2 py-1', 'px-4');
  assert.equal(result, 'py-1 px-4');

  const bgResult = cn('bg-red-500 text-white', 'bg-[#00E5FF]');
  assert.equal(bgResult, 'text-white bg-[#00E5FF]');
});

test('cn handles array of class values', () => {
  const result = cn(['font-mono', 'text-xs'], 'tracking-wider');
  assert.equal(result, 'font-mono text-xs tracking-wider');
});
