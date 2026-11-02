import test from 'node:test';
import assert from 'node:assert/strict';
import { parseVoiceCommand } from './voiceCommands';

test('parseVoiceCommand parses navigation keywords', () => {
  // Contact
  const c1 = parseVoiceCommand('Scroll to contact');
  assert.equal(c1.type, 'NAVIGATE');
  if (c1.type === 'NAVIGATE') assert.equal(c1.sectionId, 'contact');

  const c2 = parseVoiceCommand('go to message me');
  assert.equal(c2.type, 'NAVIGATE');
  if (c2.type === 'NAVIGATE') assert.equal(c2.sectionId, 'contact');

  // About
  const a1 = parseVoiceCommand('Scroll to about');
  assert.equal(a1.type, 'NAVIGATE');
  if (a1.type === 'NAVIGATE') assert.equal(a1.sectionId, 'about');

  // Skills
  const s1 = parseVoiceCommand('Show technical skills');
  assert.equal(s1.type, 'NAVIGATE');
  if (s1.type === 'NAVIGATE') assert.equal(s1.sectionId, 'skills');

  // Journey
  const j1 = parseVoiceCommand('Go to journey');
  assert.equal(j1.type, 'NAVIGATE');
  if (j1.type === 'NAVIGATE') assert.equal(j1.sectionId, 'journey');

  // Vlog / Life Journey
  const v1 = parseVoiceCommand('Show personal life journey');
  assert.equal(v1.type, 'NAVIGATE');
  if (v1.type === 'NAVIGATE') assert.equal(v1.sectionId, 'vlog');

  const v2 = parseVoiceCommand('Open photo album memories');
  assert.equal(v2.type, 'NAVIGATE');
  if (v2.type === 'NAVIGATE') assert.equal(v2.sectionId, 'vlog');

  // Certificates
  const cert1 = parseVoiceCommand('Show my certificates');
  assert.equal(cert1.type, 'NAVIGATE');
  if (cert1.type === 'NAVIGATE') assert.equal(cert1.sectionId, 'certificates');

  const cert2 = parseVoiceCommand('Open verified credentials');
  assert.equal(cert2.type, 'NAVIGATE');
  if (cert2.type === 'NAVIGATE') assert.equal(cert2.sectionId, 'certificates');

  // Top / Home
  const h1 = parseVoiceCommand('Scroll to top');
  assert.equal(h1.type, 'NAVIGATE');
  if (h1.type === 'NAVIGATE') assert.equal(h1.sectionId, 'hero');
});

test('parseVoiceCommand parses project category filter commands', () => {
  // AI projects
  const f1 = parseVoiceCommand('Show AI projects');
  assert.equal(f1.type, 'FILTER_PROJECTS');
  if (f1.type === 'FILTER_PROJECTS') assert.equal(f1.category, 'ai');

  // Web projects
  const f2 = parseVoiceCommand('Show web projects');
  assert.equal(f2.type, 'FILTER_PROJECTS');
  if (f2.type === 'FILTER_PROJECTS') assert.equal(f2.category, 'web');

  // Systems projects
  const f3 = parseVoiceCommand('Filter systems projects');
  assert.equal(f3.type, 'FILTER_PROJECTS');
  if (f3.type === 'FILTER_PROJECTS') assert.equal(f3.category, 'systems');

  // Saved projects / Bookmarks
  const f4 = parseVoiceCommand('Show saved projects');
  assert.equal(f4.type, 'FILTER_PROJECTS');
  if (f4.type === 'FILTER_PROJECTS') assert.equal(f4.category, 'saved');

  // All projects
  const f5 = parseVoiceCommand('Show all projects');
  assert.equal(f5.type, 'FILTER_PROJECTS');
  if (f5.type === 'FILTER_PROJECTS') assert.equal(f5.category, 'all');
});

test('parseVoiceCommand parses search commands', () => {
  const s1 = parseVoiceCommand('Search React');
  assert.equal(s1.type, 'SEARCH_PROJECTS');
  if (s1.type === 'SEARCH_PROJECTS') assert.equal(s1.query, 'react');
});

test('parseVoiceCommand parses theme commands', () => {
  const t1 = parseVoiceCommand('Switch to light mode');
  assert.equal(t1.type, 'TOGGLE_THEME');
  if (t1.type === 'TOGGLE_THEME') assert.equal(t1.targetTheme, 'light');

  const t2 = parseVoiceCommand('Dark mode please');
  assert.equal(t2.type, 'TOGGLE_THEME');
  if (t2.type === 'TOGGLE_THEME') assert.equal(t2.targetTheme, 'dark');

  const t3 = parseVoiceCommand('Toggle theme');
  assert.equal(t3.type, 'TOGGLE_THEME');
});

test('parseVoiceCommand parses resume commands', () => {
  const r1 = parseVoiceCommand('Download resume');
  assert.equal(r1.type, 'DOWNLOAD_RESUME');

  const r2 = parseVoiceCommand('Show CV');
  assert.equal(r2.type, 'DOWNLOAD_RESUME');
});

test('parseVoiceCommand handles unknown inputs gracefully', () => {
  const u1 = parseVoiceCommand('play music');
  assert.equal(u1.type, 'UNKNOWN');

  const u2 = parseVoiceCommand('');
  assert.equal(u2.type, 'UNKNOWN');
});
