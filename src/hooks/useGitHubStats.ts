import { useState, useEffect } from 'react';
import { Project } from '../types/portfolio';
import { fetchRepoStats, GitHubRepoStats } from '../utils/github';

export function useGitHubStats(projects: Project[]) {
  const [stats, setStats] = useState<Record<string, GitHubRepoStats>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      setIsLoading(true);
      const newStats: Record<string, GitHubRepoStats> = {};

      const promises = projects.map(async (project) => {
        if (!project.githubUrl) return;
        try {
          const repoStats = await fetchRepoStats(project.githubUrl);
          if (isMounted) {
            newStats[project.id] = repoStats;
          }
        } catch {
          if (isMounted) {
            newStats[project.id] = {
              stars: 0,
              latestCommitDate: null,
              formattedCommitDate: 'Unavailable',
              formattedStars: '—',
              isLoading: false,
              isError: true,
              repoUrl: project.githubUrl
            };
          }
        }
      });

      await Promise.allSettled(promises);

      if (isMounted) {
        setStats(newStats);
        setIsLoading(false);
      }
    }

    loadStats();

    return () => {
      isMounted = false;
    };
  }, [projects]);

  return { stats, isLoading };
}
