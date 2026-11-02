import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { projects } from '../data/projects';
import { Project, ProjectCategory } from '../types/portfolio';
import { filterProjects, getCategoryCounts } from '../utils/projectFilter';
import { useGitHubStats } from '../hooks/useGitHubStats';
import { calculateProjectMetrics } from '../utils/projectMetrics';
import {
  loadSavedBookmarks,
  persistBookmarks,
  toggleProjectBookmark
} from '../utils/bookmarks';
import { ProjectCard } from './ProjectCard';
import { ProjectDetails } from './ProjectDetails';
import { ProjectSummary } from './ProjectSummary';
import { ScrollReveal } from './ScrollReveal';
import { buttonInteractionVariants } from '../utils/motionVariants';


interface ProjectsProps {
  externalCategory?: ProjectCategory | null;
  externalSearch?: string | null;
}

export const Projects: React.FC<ProjectsProps> = ({ externalCategory, externalSearch }) => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>(() => loadSavedBookmarks());

  useEffect(() => {
    if (externalCategory) {
      setSelectedCategory(externalCategory);
    }
  }, [externalCategory]);

  useEffect(() => {
    if (externalSearch !== undefined && externalSearch !== null) {
      setSearchQuery(externalSearch);
    }
  }, [externalSearch]);

  const { stats: githubStats, isLoading } = useGitHubStats(projects);

  const metrics = useMemo(() => {
    return calculateProjectMetrics(projects, githubStats);
  }, [githubStats]);

  const handleToggleBookmark = (projectId: string) => {
    setBookmarks((prev) => {
      const next = toggleProjectBookmark(projectId, prev);
      persistBookmarks(next);
      return next;
    });
  };

  const categoryCounts = useMemo(() => getCategoryCounts(projects, bookmarks), [bookmarks]);

  const filteredList = useMemo(() => {
    return filterProjects(projects, selectedCategory, searchQuery, bookmarks);
  }, [selectedCategory, searchQuery, bookmarks]);

  const categories: { id: ProjectCategory; label: string }[] = useMemo(() => {
    const list: { id: ProjectCategory; label: string }[] = [
      { id: 'all', label: 'All Projects' },
      { id: 'ai', label: 'AI' },
      { id: 'web', label: 'Web' },
      { id: 'systems', label: 'Systems' },
    ];
    if (bookmarks.length > 0) {
      list.push({ id: 'saved', label: 'Saved' });
    }
    return list;
  }, [bookmarks.length]);

  const handleSelectTech = (tech: string) => {
    setSearchQuery(tech);
    setSelectedCategory('all');
  };

  return (
    <section id="projects" className="py-24 relative" aria-label="Featured Projects">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Scroll Reveal */}
        <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#00E5FF] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Engineering Portfolio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
              Featured Projects
            </h2>
            <p className="text-base sm:text-lg text-slate-300">
              Practical software systems and applied AI experiments. Each project represents
              concrete problem solving, clean architecture, and technical growth.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tech or keyword..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D111B] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500 font-mono transition-colors"
              aria-label="Filter projects by technology or title"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </ScrollReveal>

        {/* Visual Aggregate Summary Metrics Section */}
        <ScrollReveal delay={0.1}>
          <ProjectSummary metrics={metrics} isLoading={isLoading} />
        </ScrollReveal>

        {/* Interactive Segmented Filter Controls (Allowed per Section 1.A) */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-white/[0.08]">
          <span className="text-xs font-mono text-slate-500 mr-2 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter:</span>
          </span>

          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] ?? 0;
            return (
              <motion.button
                key={cat.id}
                type="button"
                variants={buttonInteractionVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors duration-200 cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-[#00E5FF] border border-cyan-500/40 font-semibold shadow-[0_0_15px_-4px_rgba(0,229,255,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-sans tabular-nums ${
                    isActive ? 'bg-cyan-500/20 text-cyan-200' : 'bg-white/5 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </motion.button>

            );
          })}
        </div>

        {/* Projects Grid with Subtle Framer Motion Entrance Animations */}
        {filteredList.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {filteredList.map((project, idx) => (
              <ProjectCard
                key={project.id}
                index={idx}
                project={project}
                repoStats={githubStats[project.id]}
                isBookmarked={bookmarks.includes(project.id)}
                onToggleBookmark={handleToggleBookmark}
                onOpenDetails={(p) => setActiveModalProject(p)}
                onSelectTech={handleSelectTech}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center rounded-2xl bg-[#0D111B]/60 border border-white/[0.06] p-8">
            <p className="text-slate-400 text-sm mb-3">
              No projects matched your search criteria: "{searchQuery}"
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 text-xs font-mono text-[#00E5FF] hover:underline"
            >
              Reset Filters & Show All
            </button>
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      <ProjectDetails
        project={activeModalProject}
        repoStats={activeModalProject ? githubStats[activeModalProject.id] : undefined}
        isBookmarked={activeModalProject ? bookmarks.includes(activeModalProject.id) : false}
        onToggleBookmark={handleToggleBookmark}
        onClose={() => setActiveModalProject(null)}
        onSelectTech={handleSelectTech}
      />
    </section>
  );
};
