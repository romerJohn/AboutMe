import { Project, ProjectCategory } from '../types/portfolio';

export function filterProjects(
  projects: Project[],
  category: ProjectCategory,
  searchQuery: string = '',
  bookmarks: string[] = []
): Project[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return projects.filter((project) => {
    let matchesCategory = false;
    if (category === 'all') {
      matchesCategory = true;
    } else if (category === 'saved') {
      matchesCategory = bookmarks.includes(project.id);
    } else {
      matchesCategory =
        project.category === category ||
        (project.categories !== undefined && project.categories.includes(category as any));
    }
    if (!matchesCategory) return false;

    if (!normalizedQuery) return true;

    const matchesTitle = project.title.toLowerCase().includes(normalizedQuery);
    const matchesSubtitle = project.subtitle.toLowerCase().includes(normalizedQuery);
    const matchesDesc = project.description.toLowerCase().includes(normalizedQuery);
    const matchesTech = project.technologies.some((tech) =>
      tech.toLowerCase().includes(normalizedQuery)
    );
    const matchesCoreTech = project.coreTechnologies?.some((tech) =>
      tech.toLowerCase().includes(normalizedQuery)
    );

    return matchesTitle || matchesSubtitle || matchesDesc || matchesTech || !!matchesCoreTech;
  });
}

export function getCategoryCounts(
  projects: Project[],
  bookmarks: string[] = []
): Record<ProjectCategory, number> {
  const counts: Record<ProjectCategory, number> = {
    all: projects.length,
    ai: 0,
    web: 0,
    systems: 0,
    saved: bookmarks.length
  };

  for (const project of projects) {
    if (project.categories && project.categories.length > 0) {
      for (const cat of project.categories) {
        if (cat in counts) {
          counts[cat]++;
        }
      }
    } else if (project.category in counts) {
      counts[project.category as ProjectCategory]++;
    }
  }

  return counts;
}
