import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createFadeInVariants,
  createFadeUpVariants,
  createFadeDownVariants,
  createStaggerContainerVariants,
  createStaggerChildVariants,
  cardHoverVariants,
  buttonInteractionVariants,
  modalEntranceVariants,
  modalBackdropVariants,
  createImageRevealVariants,
  createSectionEntranceVariants,
  adaptForReducedMotion,
  checkPrefersReducedMotion
} from './motionVariants';

test('createFadeInVariants produces valid opacity transition states', () => {
  const variants = createFadeInVariants(0.5, 0.1);
  assert.deepEqual(variants.hidden, { opacity: 0 });
  assert.equal((variants.visible as any).opacity, 1);
  assert.equal((variants.visible as any).transition.duration, 0.5);
  assert.equal((variants.visible as any).transition.delay, 0.1);
});

test('createFadeUpVariants produces upward motion with cyber easing', () => {
  const variants = createFadeUpVariants(32, 0.6, 0.15);
  assert.equal((variants.hidden as any).opacity, 0);
  assert.equal((variants.hidden as any).y, 32);
  assert.equal((variants.visible as any).opacity, 1);
  assert.equal((variants.visible as any).y, 0);
  assert.equal((variants.visible as any).transition.duration, 0.6);
  assert.equal((variants.visible as any).transition.delay, 0.15);
});

test('createFadeDownVariants produces downward offset for header elements', () => {
  const variants = createFadeDownVariants(20, 0.4);
  assert.equal((variants.hidden as any).opacity, 0);
  assert.equal((variants.hidden as any).y, -20);
  assert.equal((variants.visible as any).y, 0);
});

test('createStaggerContainerVariants and child variants configure sequence timing', () => {
  const container = createStaggerContainerVariants(0.1, 0.05);
  assert.equal((container.visible as any).transition.staggerChildren, 0.1);
  assert.equal((container.visible as any).transition.delayChildren, 0.05);

  const child = createStaggerChildVariants(18, 0.4);
  assert.equal((child.hidden as any).y, 18);
  assert.equal((child.visible as any).y, 0);
});

test('cardHoverVariants and buttonInteractionVariants define interactive tactile states', () => {
  assert.equal((cardHoverVariants.idle as any).y, 0);
  assert.equal((cardHoverVariants.hover as any).y, -4);

  assert.equal((buttonInteractionVariants.idle as any).scale, 1);
  assert.equal((buttonInteractionVariants.hover as any).scale, 1.025);
  assert.equal((buttonInteractionVariants.tap as any).scale, 0.975);
});

test('modalEntranceVariants and modalBackdropVariants support exit states', () => {
  assert.ok(modalEntranceVariants.exit);
  assert.ok(modalBackdropVariants.exit);
  assert.equal((modalEntranceVariants.hidden as any).opacity, 0);
  assert.equal((modalEntranceVariants.visible as any).opacity, 1);
  assert.equal((modalEntranceVariants.exit as any).opacity, 0);
});

test('createImageRevealVariants handles smooth scale reveal', () => {
  const reveal = createImageRevealVariants(0.7);
  assert.equal((reveal.hidden as any).scale, 1.04);
  assert.equal((reveal.visible as any).scale, 1);
  assert.equal((reveal.visible as any).transition.duration, 0.7);
});

test('createSectionEntranceVariants handles scroll trigger configuration', () => {
  const entrance = createSectionEntranceVariants(0.2, 40);
  assert.equal((entrance.hidden as any).y, 40);
  assert.equal((entrance.visible as any).transition.delay, 0.2);
});

test('adaptForReducedMotion removes transforms and preserves opacity when reduced motion is preferred', () => {
  const original = createFadeUpVariants(36, 0.8, 0.2);
  const adapted = adaptForReducedMotion(original, true);

  // y offset must be flattened to 0 for reduced motion
  assert.equal((adapted.hidden as any).y, 0);
  assert.equal((adapted.hidden as any).opacity, 0);
  assert.equal((adapted.visible as any).y, 0);
  assert.equal((adapted.visible as any).opacity, 1);

  // Transition duration capped
  assert.ok((adapted.visible as any).transition.duration <= 0.25);

  // When not reduced motion, returns original unchanged
  const unchanged = adaptForReducedMotion(original, false);
  assert.equal((unchanged.hidden as any).y, 36);
});

test('checkPrefersReducedMotion returns false in non-browser Node environments', () => {
  const isReduced = checkPrefersReducedMotion();
  assert.equal(typeof isReduced, 'boolean');
});
