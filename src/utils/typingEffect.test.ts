import test from 'node:test';
import assert from 'node:assert/strict';
import { getNextTypingState, DEFAULT_ROLES, TypingState } from './typingEffect';

test('getNextTypingState types characters forward', () => {
  let state: TypingState = {
    wordIndex: 0,
    charIndex: 0,
    isDeleting: false,
    displayText: ''
  };

  // Type first character
  state = getNextTypingState(state, ['AI Engineer']);
  assert.equal(state.displayText, 'A');
  assert.equal(state.charIndex, 1);
  assert.equal(state.isDeleting, false);

  // Type second character
  state = getNextTypingState(state, ['AI Engineer']);
  assert.equal(state.displayText, 'AI');
  assert.equal(state.charIndex, 2);
});

test('getNextTypingState switches to deleting once word is complete', () => {
  let state: TypingState = {
    wordIndex: 0,
    charIndex: 2,
    isDeleting: false,
    displayText: 'AI'
  };

  state = getNextTypingState(state, ['AI']);
  assert.equal(state.isDeleting, true);
  assert.equal(state.displayText, 'AI');

  // Next step deletes a character
  state = getNextTypingState(state, ['AI']);
  assert.equal(state.displayText, 'A');
  assert.equal(state.charIndex, 1);
  assert.equal(state.isDeleting, true);
});

test('getNextTypingState advances to next role when fully deleted', () => {
  let state: TypingState = {
    wordIndex: 0,
    charIndex: 0,
    isDeleting: true,
    displayText: ''
  };

  const words = ['AI Engineer', 'Full-stack Developer'];
  state = getNextTypingState(state, words);
  assert.equal(state.wordIndex, 1);
  assert.equal(state.charIndex, 0);
  assert.equal(state.isDeleting, false);
  assert.equal(state.displayText, '');
});

test('DEFAULT_ROLES includes requested roles', () => {
  assert.ok(DEFAULT_ROLES.includes('AI Engineer'));
  assert.ok(DEFAULT_ROLES.includes('Full-stack Developer'));
  assert.ok(DEFAULT_ROLES.includes('Tech Innovator'));
});
