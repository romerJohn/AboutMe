import { Project } from '../types/portfolio';
import { GitHubRepoStats, formatStarCount, formatRelativeDate } from './github';

export interface ProjectSummaryMetrics {
  totalProjects: number;
  totalStars: number;
  formattedTotalStars: string;
  languagesUsed: string[];
  languagesCount: number;
  latestActivity: string;
}

// Known primary programming/markup languages for classification
const KNOWN_LANGUAGES = new Set([
  'TypeScript',
  'JavaScript',
  'Python',
  'Rust',
  'Go',
  'C++',
  'SQL',
  'HTML',
  'CSS',
  'Solidity',
  'Java',
  'Kotlin',
  'Swift'
]);

/**
 * Calculates visual summary aggregate statistics across projects and fetched GitHub stats
 */
export function calculateProjectMetrics(
  projects: Project[],
  githubStats: Record<string, GitHubRepoStats> = {}
): ProjectSummaryMetrics {
  const totalProjects = projects.length;

  let totalStars = 0;
  const languagesSet = new Set<string>();
  let newestCommitTimestamp: number | null = null;
  let newestCommitIso: string | null = null;

  for (const project of projects) {
    const stats = githubStats[project.id];

    // 1. Accumulate Stars
    if (stats && typeof stats.stars === 'number' && !isNaN(stats.stars)) {
      totalStars += stats.stars;
    }

    // 2. Accumulate Languages from fetched GitHub repo language
    if (stats?.language) {
      languagesSet.add(stats.language);
    }

    // 3. Accumulate programming languages from project technical stack
    if (Array.isArray(project.technologies)) {
      for (const tech of project.technologies) {
        if (KNOWN_LANGUAGES.has(tech)) {
          languagesSet.add(tech);
        } else if (tech.toLowerCase().includes('python')) {
          languagesSet.add('Python');
        } else if (tech.toLowerCase().includes('typescript')) {
          languagesSet.add('TypeScript');
        } else if (tech.toLowerCase().includes('javascript')) {
          languagesSet.add('JavaScript');
        } else if (tech.toLowerCase().includes('sql') || tech.toLowerCase().includes('postgres')) {
          languagesSet.add('SQL');
        }
      }
    }

    // 4. Track latest commit timestamp
    if (stats?.latestCommitDate) {
      const time = new Date(stats.latestCommitDate).getTime();
      if (!isNaN(time)) {
        if (newestCommitTimestamp === null || time > newestCommitTimestamp) {
          newestCommitTimestamp = time;
          newestCommitIso = stats.latestCommitDate;
        }
      }
    }
  }

  // Fallback default languages if none detected
  if (languagesSet.size === 0) {
    languagesSet.add('TypeScript');
    languagesSet.add('Python');
  }

  const languagesUsed = Array.from(languagesSet).sort();
  const formattedTotalStars = formatStarCount(totalStars);
  const latestActivity = newestCommitIso ? formatRelativeDate(newestCommitIso) : 'Active';

  return {
    totalProjects,
    totalStars,
    formattedTotalStars,
    languagesUsed,
    languagesCount: languagesUsed.length,
    latestActivity
  };
}
