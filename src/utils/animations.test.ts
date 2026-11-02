import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createScrollRevealVariants,
  createStaggerContainerVariants,
  createProjectCardEntranceVariants,
  createGlowFrameVariants
} from './animations';

test('createScrollRevealVariants returns expected initial hidden state', () => {
  const variants = createScrollRevealVariants({ yOffset: 40 }) as any;
  assert.equal(variants.hidden.opacity, 0);
  assert.equal(variants.hidden.y, 40);
});

test('createScrollRevealVariants applies delay and duration to visible state', () => {
  const variants = createScrollRevealVariants({ delay: 0.25, duration: 0.8 }) as any;
  assert.equal(variants.visible.opacity, 1);
  assert.equal(variants.visible.y, 0);
  assert.equal(variants.visible.transition.delay, 0.25);
  assert.equal(variants.visible.transition.duration, 0.8);
});

test('createStaggerContainerVariants defines staggerChildren timing', () => {
  const container = createStaggerContainerVariants(0.15, 0.1) as any;
  assert.equal(container.visible.transition.staggerChildren, 0.15);
  assert.equal(container.visible.transition.delayChildren, 0.1);
});

test('createProjectCardEntranceVariants calculates staggered delay from index', () => {
  const card0 = createProjectCardEntranceVariants({ index: 0, baseDelay: 0.1, staggerIncrement: 0.15 }) as any;
  const card1 = createProjectCardEntranceVariants({ index: 1, baseDelay: 0.1, staggerIncrement: 0.15 }) as any;
  const card2 = createProjectCardEntranceVariants({ index: 2, baseDelay: 0.1, staggerIncrement: 0.15 }) as any;

  assert.equal(card0.hidden.opacity, 0);
  assert.equal(card0.hidden.scale, 0.96);
  assert.equal(card0.visible.opacity, 1);
  assert.equal(card0.visible.scale, 1);

  assert.equal(card0.visible.transition.delay, 0.1);
  assert.equal(card1.visible.transition.delay, 0.25);
  assert.equal(card2.visible.transition.delay, 0.4);
});

test('createGlowFrameVariants generates frame, aura, and corner hover states', () => {
  const variants = createGlowFrameVariants({ accentColor: '#38BDF8' }) as any;
  assert.equal(variants.frameVariants.idle.scale, 1);
  assert.equal(variants.frameVariants.hovered.borderColor, '#38BDF8');
  assert.equal(variants.frameVariants.hovered.scale, 1.015);

  assert.equal(variants.auraVariants.idle.opacity, 0);
  assert.equal(variants.auraVariants.hovered.opacity, 1);

  assert.equal(variants.cornerVariants.idle.scale, 0.95);
  assert.equal(variants.cornerVariants.hovered.scale, 1.15);
  assert.equal(variants.cornerVariants.hovered.borderColor, '#38BDF8');
});


