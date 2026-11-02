import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateProjectMetrics } from './projectMetrics';
import { Project } from '../types/portfolio';
import { GitHubRepoStats } from './github';

const mockProjects: Project[] = [
  {
    id: 'p1',
    title: 'IntraVision AI',
    subtitle: 'System',
    description: 'System',
    longDescription: 'Long',
    category: 'ai',
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
    subtitle: 'System',
    description: 'System',
    longDescription: 'Long',
    category: 'systems',
    technologies: ['FastAPI', 'Python', 'PostgreSQL'],
    status: 'In Development',
    featured: true,
    keyFeatures: ['Feature 2'],
    architectureOverview: 'Overview',
    challengesAndLearnings: 'Challenges',
    accentColor: '#8B5CF6',
    previewType: 'tradepilot'
  }
];

test('calculateProjectMetrics correctly calculates total projects and aggregate stars', () => {
  const mockStats: Record<string, GitHubRepoStats> = {
    p1: {
      stars: 42,
      latestCommitDate: '2026-10-28T12:00:00Z',
      formattedCommitDate: '1d ago',
      formattedStars: '42',
      language: 'TypeScript',
      isLoading: false,
      isError: false,
      repoUrl: 'https://github.com/developer/intravision-ai'
    },
    p2: {
      stars: 1200,
      latestCommitDate: '2026-10-29T08:00:00Z',
      formattedCommitDate: '4h ago',
      formattedStars: '1.2k',
      language: 'Python',
      isLoading: false,
      isError: false,
      repoUrl: 'https://github.com/developer/tradepilot-ai'
    }
  };

  const metrics = calculateProjectMetrics(mockProjects, mockStats);

  assert.equal(metrics.totalProjects, 2);
  assert.equal(metrics.totalStars, 1242);
  assert.equal(metrics.formattedTotalStars, '1.2k');
  assert.ok(metrics.languagesUsed.includes('TypeScript'));
  assert.ok(metrics.languagesUsed.includes('Python'));
  assert.ok(metrics.languagesCount >= 2);
});

test('calculateProjectMetrics gracefully handles empty or pending stats', () => {
  const metrics = calculateProjectMetrics(mockProjects, {});

  assert.equal(metrics.totalProjects, 2);
  assert.equal(metrics.totalStars, 0);
  assert.equal(metrics.formattedTotalStars, '0');
  assert.ok(metrics.languagesUsed.includes('TypeScript'));
  assert.ok(metrics.languagesUsed.includes('Python'));
});
