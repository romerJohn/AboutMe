import test from 'node:test';
import assert from 'node:assert/strict';
import { filterProjects, getCategoryCounts } from './projectFilter';
import { Project } from '../types/portfolio';

const mockProjects: Project[] = [
  {
    id: 'p1',
    title: 'IntraVision AI',
    subtitle: 'Intramural system',
    description: 'Tournament management system',
    longDescription: 'Long description',
    category: 'ai',
    categories: ['ai', 'web'],
    technologies: ['React', 'TypeScript', 'Supabase'],
    status: 'In Development',
    featured: true,
    keyFeatures: ['Feature 1'],
    architectureOverview: 'Overview',
    challengesAndLearnings: 'Challenges',
    accentColor: '#00E5FF',
    previewType: 'intravision'
  },
  {
    id: 'p2',
    title: 'TradePilot AI',
    subtitle: 'Trading assistant',
    description: 'Crypto risk analyzer',
    longDescription: 'Long description',
    category: 'systems',
    categories: ['ai', 'systems'],
    technologies: ['Python', 'FastAPI', 'PostgreSQL'],
    status: 'In Development',
    featured: true,
    keyFeatures: ['Feature 2'],
    architectureOverview: 'Overview',
    challengesAndLearnings: 'Challenges',
    accentColor: '#8B5CF6',
    previewType: 'tradepilot'
  },
  {
    id: 'p3',
    title: 'Developer Laboratory',
    subtitle: 'Experiments',
    description: 'Prototypes collection',
    longDescription: 'Long description',
    category: 'systems',
    categories: ['web', 'systems'],
    technologies: ['TypeScript', 'Canvas API'],
    status: 'Prototype',
    featured: true,
    keyFeatures: ['Feature 3'],
    architectureOverview: 'Overview',
    challengesAndLearnings: 'Challenges',
    accentColor: '#38BDF8',
    previewType: 'laboratory'
  }
];

test('filterProjects handles category filtering for AI, Web, Systems', () => {
  const all = filterProjects(mockProjects, 'all');
  assert.equal(all.length, 3);

  const aiOnly = filterProjects(mockProjects, 'ai');
  assert.equal(aiOnly.length, 2);
  assert.equal(aiOnly[0].id, 'p1');
  assert.equal(aiOnly[1].id, 'p2');

  const webOnly = filterProjects(mockProjects, 'web');
  assert.equal(webOnly.length, 2);
  assert.equal(webOnly[0].id, 'p1');
  assert.equal(webOnly[1].id, 'p3');

  const systemsOnly = filterProjects(mockProjects, 'systems');
  assert.equal(systemsOnly.length, 2);
  assert.equal(systemsOnly[0].id, 'p2');
  assert.equal(systemsOnly[1].id, 'p3');

  const savedOnly = filterProjects(mockProjects, 'saved', '', ['p1']);
  assert.equal(savedOnly.length, 1);
  assert.equal(savedOnly[0].id, 'p1');
});

test('filterProjects handles search queries across titles and technologies', () => {
  const searchPostgres = filterProjects(mockProjects, 'all', 'postgresql');
  assert.equal(searchPostgres.length, 1);
  assert.equal(searchPostgres[0].id, 'p2');

  const searchIntramural = filterProjects(mockProjects, 'all', 'intramural');
  assert.equal(searchIntramural.length, 1);
  assert.equal(searchIntramural[0].id, 'p1');
});

test('filterProjects handles search queries across coreTechnologies', () => {
  const customProjects: Project[] = [
    {
      ...mockProjects[0],
      coreTechnologies: ['React', 'AI', 'Node.js']
    },
    {
      ...mockProjects[1],
      coreTechnologies: ['Python', 'AI', 'FastAPI']
    }
  ];

  const searchNode = filterProjects(customProjects, 'all', 'node.js');
  assert.equal(searchNode.length, 1);
  assert.equal(searchNode[0].id, 'p1');

  const searchPython = filterProjects(customProjects, 'all', 'python');
  assert.equal(searchPython.length, 1);
  assert.equal(searchPython[0].id, 'p2');
});

test('getCategoryCounts accurately tabulates categories for AI, Web, Systems', () => {
  const counts = getCategoryCounts(mockProjects);
  assert.equal(counts.all, 3);
  assert.equal(counts.ai, 2);
  assert.equal(counts.web, 2);
  assert.equal(counts.systems, 2);
});
