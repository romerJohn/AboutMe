export interface GitHubRepoStats {
  stars: number;
  latestCommitDate: string | null;
  formattedCommitDate: string;
  formattedStars: string;
  language?: string | null;
  isLoading: boolean;
  isError: boolean;
  repoUrl: string;
}

const statsCache = new Map<string, GitHubRepoStats>();

/**
 * Extracts { owner, repo } from a github.com URL
 * Supports: https://github.com/owner/repo or github.com/owner/repo
 */
export function parseGitHubRepo(url?: string): { owner: string; repo: string } | null {
  if (!url) return null;
  try {
    const cleaned = url.trim().replace(/\/$/, '');
    const match = cleaned.match(/github\.com\/([^/]+)\/([^/#?]+)/i);
    if (!match) return null;
    return {
      owner: match[1],
      repo: match[2].replace(/\.git$/i, '')
    };
  } catch {
    return null;
  }
}

/**
 * Formats a raw number of stars into compact notation (e.g. 1.2k, 250k, 14)
 */
export function formatStarCount(stars: number): string {
  if (stars < 0 || isNaN(stars)) return '0';
  if (stars >= 1_000_000) {
    return `${(stars / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (stars >= 1_000) {
    return `${(stars / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return String(stars);
}

/**
 * Formats an ISO date into human-readable relative time
 */
export function formatRelativeDate(isoDate: string, now: Date = new Date()): string {
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return 'Recently';

    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0) return 'Just now';

    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  } catch {
    return 'Recently';
  }
}

/**
 * Fetches repository metadata and latest commit date from GitHub REST API
 */
export async function fetchRepoStats(githubUrl: string): Promise<GitHubRepoStats> {
  const parsed = parseGitHubRepo(githubUrl);
  if (!parsed) {
    return {
      stars: 0,
      latestCommitDate: null,
      formattedCommitDate: 'No repo',
      formattedStars: '0',
      isLoading: false,
      isError: true,
      repoUrl: githubUrl
    };
  }

  const cacheKey = `${parsed.owner}/${parsed.repo}`;
  if (statsCache.has(cacheKey)) {
    return statsCache.get(cacheKey)!;
  }

  try {
    // 1. Fetch main repo details (for stars and pushed_at)
    const repoRes = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json'
      }
    });

    if (!repoRes.ok) {
      // If repo not found (e.g. private or placeholder), return clean placeholder stats
      const fallbackStats: GitHubRepoStats = {
        stars: 0,
        latestCommitDate: null,
        formattedCommitDate: 'Sync pending',
        formattedStars: '—',
        isLoading: false,
        isError: false,
        repoUrl: githubUrl
      };
      statsCache.set(cacheKey, fallbackStats);
      return fallbackStats;
    }

    const repoData = await repoRes.json();
    const stars = typeof repoData.stargazers_count === 'number' ? repoData.stargazers_count : 0;
    const language = typeof repoData.language === 'string' ? repoData.language : null;
    let commitDate = repoData.pushed_at || repoData.updated_at || null;

    // 2. Fetch specific latest commit to get precise commit timestamp if possible
    try {
      const commitRes = await fetch(
        `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/commits?per_page=1`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json'
          }
        }
      );
      if (commitRes.ok) {
        const commitData = await commitRes.json();
        if (Array.isArray(commitData) && commitData.length > 0 && commitData[0].commit?.committer?.date) {
          commitDate = commitData[0].commit.committer.date;
        }
      }
    } catch {
      // Fallback to repo pushed_at
    }

    const formattedCommitDate = commitDate ? formatRelativeDate(commitDate) : 'Recently';

    const result: GitHubRepoStats = {
      stars,
      latestCommitDate: commitDate,
      formattedCommitDate,
      formattedStars: formatStarCount(stars),
      language,
      isLoading: false,
      isError: false,
      repoUrl: githubUrl
    };

    statsCache.set(cacheKey, result);
    return result;
  } catch (error) {
    const errorStats: GitHubRepoStats = {
      stars: 0,
      latestCommitDate: null,
      formattedCommitDate: 'Offline',
      formattedStars: '—',
      isLoading: false,
      isError: true,
      repoUrl: githubUrl
    };
    return errorStats;
  }
}
