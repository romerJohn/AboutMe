import test from 'node:test';
import assert from 'node:assert/strict';
import { validateContactForm, generateMailtoUrl, validateNewsletterEmail } from './validation';

test('validateContactForm rejects empty fields', () => {
  const result = validateContactForm({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.name);
  assert.ok(result.errors.email);
  assert.ok(result.errors.subject);
  assert.ok(result.errors.message);
});

test('validateContactForm detects invalid email syntax', () => {
  const result = validateContactForm({
    name: 'Ada Lovelace',
    email: 'not-an-email',
    subject: 'Project collaboration',
    message: 'Let us build an intelligent algorithm together.'
  });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.email);
  assert.equal(result.errors.name, undefined);
});

test('validateContactForm passes valid submission', () => {
  const validData = {
    name: 'Alan Turing',
    email: 'alan@bletchley.org',
    subject: 'IntraVision AI feedback',
    message: 'I have some ideas about tournament scheduling algorithms.'
  };
  const result = validateContactForm(validData);
  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
});

test('generateMailtoUrl constructs encoded url', () => {
  const url = generateMailtoUrl('test@example.com', {
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Hello World',
    message: 'Nice portfolio website!'
  });
  assert.ok(url.startsWith('mailto:test@example.com?'));
  assert.ok(url.includes('Hello%20World'));
  assert.ok(url.includes('John%20Doe'));
});

test('validateNewsletterEmail rejects empty or whitespace-only email', () => {
  const empty = validateNewsletterEmail('');
  assert.equal(empty.isValid, false);
  assert.ok(empty.error);

  const spaces = validateNewsletterEmail('   ');
  assert.equal(spaces.isValid, false);
});

test('validateNewsletterEmail rejects invalid email format', () => {
  const invalid = validateNewsletterEmail('invalid-email-address');
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.error);
});

test('validateNewsletterEmail accepts valid email address', () => {
  const valid = validateNewsletterEmail('engineer@domain.com');
  assert.equal(valid.isValid, true);
  assert.equal(valid.error, undefined);
});

