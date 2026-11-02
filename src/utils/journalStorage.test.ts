import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getVisibleMemories,
  filterMemoriesByCategory,
  sortMemoriesChronologically,
  sortMemories,
  groupMemoriesByYear,
  validateMemoryForm,
  verifyOwnerPasscode,
  getMemoryAspectRatioClass,
  detectImageOrientation
} from './journalStorage';
import { JournalMemory } from '../types/journal';

const sampleMemories: JournalMemory[] = [
  {
    id: 'm1',
    title: 'Summit of Mount Rainier',
    story: 'Sunrise ascent above the cloud inversion layer.',
    date: '2026-08-14',
    location: 'Mount Rainier National Park, WA',
    category: 'Adventures & Hiking',
    tags: ['Hiking', 'Mountains', 'Summit'],
    images: [{ id: 'img-1', url: 'data:image/jpeg;base64,...', isCover: true }],
    isPublished: true,
    isFeatured: true,
    createdAt: 1000,
    updatedAt: 1000
  },
  {
    id: 'm2',
    title: 'Late Night Hackathon with College Friends',
    story: 'Building our first distributed compiler prototype over pizza.',
    date: '2025-11-20',
    location: 'Engineering Building Lab 3',
    category: 'School Life',
    tags: ['Hackathon', 'Coding', 'Friends'],
    images: [{ id: 'img-2', url: 'data:image/jpeg;base64,...', isCover: true }],
    isPublished: true,
    isFeatured: false,
    createdAt: 2000,
    updatedAt: 2000
  },
  {
    id: 'm3',
    title: 'Unpublished Draft Trail Notes',
    story: 'Working draft of notes from Olympic National Park trip.',
    date: '2026-09-02',
    location: 'Olympic Peninsula, WA',
    category: 'Adventures & Hiking',
    tags: ['Draft', 'Pacific Northwest'],
    images: [{ id: 'img-3', url: 'data:image/jpeg;base64,...', isCover: true }],
    isPublished: false,
    isFeatured: false,
    createdAt: 3000,
    updatedAt: 3000
  }
];

test('getVisibleMemories hides drafts from visitors and shows drafts to owner', () => {
  const visitorView = getVisibleMemories(sampleMemories, false);
  assert.equal(visitorView.length, 2);
  assert.ok(visitorView.every((m) => m.isPublished));

  const ownerView = getVisibleMemories(sampleMemories, true);
  assert.equal(ownerView.length, 3);
  assert.ok(ownerView.some((m) => !m.isPublished));
});

test('filterMemoriesByCategory filters by selected category and respects All', () => {
  const adventures = filterMemoriesByCategory(sampleMemories, 'Adventures & Hiking');
  assert.equal(adventures.length, 2);
  assert.ok(adventures.every((m) => m.category === 'Adventures & Hiking'));

  const school = filterMemoriesByCategory(sampleMemories, 'School Life');
  assert.equal(school.length, 1);
  assert.equal(school[0].id, 'm2');

  const all = filterMemoriesByCategory(sampleMemories, 'All');
  assert.equal(all.length, 3);
});

test('sortMemoriesChronologically sorts by date descending and ascending', () => {
  const desc = sortMemoriesChronologically(sampleMemories, 'desc');
  assert.equal(desc[0].id, 'm3'); // 2026-09-02
  assert.equal(desc[1].id, 'm1'); // 2026-08-14
  assert.equal(desc[2].id, 'm2'); // 2025-11-20

  const asc = sortMemoriesChronologically(sampleMemories, 'asc');
  assert.equal(asc[0].id, 'm2');
  assert.equal(asc[2].id, 'm3');
});

test('sortMemories supports newest, oldest, and photos', () => {
  const newest = sortMemories(sampleMemories, 'newest');
  assert.equal(newest[0].id, 'm3');

  const oldest = sortMemories(sampleMemories, 'oldest');
  assert.equal(oldest[0].id, 'm2');

  const photos = sortMemories(sampleMemories, 'photos');
  assert.equal(photos.length, 3);
});


test('groupMemoriesByYear buckets memories into calendar years', () => {
  const groups = groupMemoriesByYear(sampleMemories);
  assert.ok(groups['2026']);
  assert.ok(groups['2025']);
  assert.equal(groups['2026'].length, 2);
  assert.equal(groups['2025'].length, 1);
});

test('validateMemoryForm validates required fields correctly', () => {
  const invalid = validateMemoryForm({});
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.title);
  assert.ok(invalid.errors.date);
  assert.ok(invalid.errors.location);
  assert.ok(invalid.errors.category);
  assert.ok(invalid.errors.story);
  assert.ok(invalid.errors.images);

  const valid = validateMemoryForm({
    title: 'Kayaking in the San Juans',
    date: '2026-07-22',
    location: 'Orcas Island, WA',
    category: 'Adventures & Hiking',
    story: 'Paddling through bioluminescent waters at dusk.',
    images: [{ id: '1', url: 'img.jpg', isCover: true }]
  });
  assert.equal(valid.isValid, true);
  assert.deepEqual(valid.errors, {});
});

test('verifyOwnerPasscode accurately authenticates owner passcodes', () => {
  assert.equal(verifyOwnerPasscode('kai2026'), true);
  assert.equal(verifyOwnerPasscode('  KAI-ROSS-JOURNEY  '), true);
  assert.equal(verifyOwnerPasscode('wrong-passcode'), false);
  assert.equal(verifyOwnerPasscode(''), false);
});

test('getMemoryAspectRatioClass resolves specified and rhythmic aspect ratios', () => {
  assert.equal(getMemoryAspectRatioClass('portrait'), 'aspect-[3/4]');
  assert.equal(getMemoryAspectRatioClass('tall'), 'aspect-[2/3]');
  assert.equal(getMemoryAspectRatioClass('square'), 'aspect-square');
  assert.equal(getMemoryAspectRatioClass('wide'), 'aspect-[16/9]');
  assert.equal(getMemoryAspectRatioClass('landscape'), 'aspect-[16/10]');

  // Auto / rhythmic variety by index
  assert.equal(getMemoryAspectRatioClass('auto', 0), 'aspect-[16/10]');
  assert.equal(getMemoryAspectRatioClass('auto', 1), 'aspect-[3/4]');
  assert.equal(getMemoryAspectRatioClass('auto', 2), 'aspect-square');
  assert.equal(getMemoryAspectRatioClass(undefined, 3), 'aspect-[2/3]');
  assert.equal(getMemoryAspectRatioClass(undefined, 4), 'aspect-[16/9]');
});

test('detectImageOrientation classifies aspect ratios based on image dimensions', () => {
  assert.equal(detectImageOrientation(1920, 1080), 'wide');       // 16:9
  assert.equal(detectImageOrientation(1600, 1000), 'landscape');  // 16:10
  assert.equal(detectImageOrientation(1000, 1000), 'square');     // 1:1
  assert.equal(detectImageOrientation(800, 1066), 'portrait');    // 3:4
  assert.equal(detectImageOrientation(600, 1000), 'tall');        // 9:16 or 2:3
});

