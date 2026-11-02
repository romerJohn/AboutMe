import React, { useEffect, useState } from 'react';
import {
  X,
  Github,
  ExternalLink,
  Cpu,
  Check,
  Layers,
  ArrowRight,
  Star,
  GitCommit,
  Bookmark,
  Link2
} from 'lucide-react';
import { Project } from '../types/portfolio';
import { ProjectVisual } from './ProjectVisual';
import { TechBadge } from './TechBadge';
import { GitHubRepoStats } from '../utils/github';
import { generateProjectLink } from '../utils/bookmarks';
import { useToast } from './ui';

interface ProjectDetailsProps {
  project: Project | null;
  onClose: () => void;
  onSelectTech?: (tech: string) => void;
  repoStats?: GitHubRepoStats;
  isBookmarked?: boolean;
  onToggleBookmark?: (projectId: string) => void;
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  project,
  onClose,
  onSelectTech,
  repoStats,
  isBookmarked = false,
  onToggleBookmark
}) => {
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    if (!project) return;
    const link = generateProjectLink(project.id, window.location.origin);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(link);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = link;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      toast.info('Link Copied', `Direct link to ${project.title} copied`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      toast.info('Link Copied', `Direct link to ${project.title} copied`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0D111B] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl text-slate-100 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Action Buttons (Copy Link, Bookmark, Close) */}
        <div className="absolute top-5 right-5 flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] cursor-pointer"
            aria-label={`Copy link for ${project.title}`}
            title={copied ? 'Link Copied!' : 'Copy Project Link'}
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Link2 className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              if (onToggleBookmark && project) {
                onToggleBookmark(project.id);
                toast.success(isBookmarked ? 'Bookmark Removed' : 'Project Bookmarked', project.title);
              }
            }}
            className={`p-2 rounded-lg transition-colors border focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] cursor-pointer ${
              isBookmarked
                ? 'bg-cyan-500/20 text-[#00E5FF] border-cyan-500/50 shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
            }`}
            aria-label={isBookmarked ? `Remove ${project.title} from bookmarks` : `Save ${project.title} for later`}
            aria-pressed={isBookmarked}
            title={isBookmarked ? 'Saved for Later' : 'Save for Later'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#00E5FF]' : ''}`} />
          </button>


          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] cursor-pointer"
            aria-label="Close project details modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Header */}
        <div className="pr-32 mb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 mb-2">
            <span
              className={`font-semibold ${
                project.status === 'Deployed'
                  ? 'text-emerald-400'
                  : project.status === 'In Development'
                  ? 'text-cyan-400'
                  : 'text-violet-400'
              }`}
            >
              [{project.status}]
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="uppercase text-slate-400">
              {project.categories ? project.categories.join(' · ') : project.category} Architecture
            </span>
            {repoStats && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span
                  className="inline-flex items-center gap-1 text-amber-300 font-mono"
                  title={`${repoStats.stars} GitHub stars`}
                >
                  <Star className="w-3 h-3 fill-amber-300/40 text-amber-300" />
                  <span>{repoStats.formattedStars} Stars</span>
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span
                  className="inline-flex items-center gap-1 text-cyan-300/90 font-mono"
                  title={`Latest commit: ${repoStats.latestCommitDate || 'Sync pending'}`}
                >
                  <GitCommit className="w-3 h-3 text-cyan-400" />
                  <span>Commit: {repoStats.formattedCommitDate}</span>
                </span>
              </>
            )}
          </div>

          <h2 id="modal-project-title" className="text-2xl sm:text-3xl font-bold text-white mb-1">
            {project.title}
          </h2>
          <p className="text-sm sm:text-base text-cyan-300 font-mono">
            {project.subtitle}
          </p>
        </div>

        {/* Visual Preview */}
        <div className="mb-6">
          <ProjectVisual type={project.previewType} title={project.title} />
        </div>

        {/* Long Narrative Description */}
        <div className="space-y-4 mb-8">
          <h3 className="text-base font-semibold text-white flex items-center gap-2 border-b border-white/[0.08] pb-2">
            <Layers className="w-4 h-4 text-[#00E5FF]" />
            <span>Problem & Solution Overview</span>
          </h3>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {project.longDescription}
          </p>
        </div>

        {/* Key Features List */}
        <div className="space-y-4 mb-8">
          <h3 className="text-base font-semibold text-white flex items-center gap-2 border-b border-white/[0.08] pb-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Key Features & Architecture Capabilities</span>
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {project.keyFeatures.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                <span className="text-[#00E5FF] font-bold">›</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Architecture & Engineering Learnings */}
        <div className="space-y-4 mb-8 bg-black/40 p-4 rounded-xl border border-white/[0.06]">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#00E5FF]" />
            <span>Architecture & Data Flow</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {project.architectureOverview}
          </p>
          <div className="pt-2 border-t border-white/[0.06]">
            <span className="text-xs font-mono text-cyan-400 block mb-1">
              Engineering Takeaway:
            </span>
            <p className="text-xs sm:text-sm text-slate-400">
              {project.challengesAndLearnings}
            </p>
          </div>
        </div>

        {/* Technology Stack Badges */}
        <div className="mb-8 space-y-4">
          {project.coreTechnologies && project.coreTechnologies.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2.5">
                Core Technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.coreTechnologies.map((tech) => (
                  <TechBadge
                    key={tech}
                    tech={tech}
                    size="md"
                    onClick={(t) => {
                      if (onSelectTech) {
                        onSelectTech(t);
                        onClose();
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5">
              Full Technology Stack & Libraries
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <TechBadge
                  key={tech}
                  tech={tech}
                  size="sm"
                  showIcon={false}
                  onClick={(t) => {
                    if (onSelectTech) {
                      onSelectTech(t);
                      onClose();
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-5 border-t border-white/[0.08]">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-all border border-white/15 hover:border-cyan-500/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] shadow-sm hover:shadow-[0_0_15px_-3px_rgba(0,229,255,0.3)]"
            >
              <Github className="w-4 h-4 text-[#00E5FF]" />
              <span>View Source</span>
              {repoStats && (
                <span className="inline-flex items-center gap-1 text-amber-300 font-mono text-[11px] normal-case bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded">
                  <Star className="w-2.5 h-2.5 fill-amber-300" />
                  <span>{repoStats.formattedStars}</span>
                </span>
              )}
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          )}

          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-slate-950 text-xs font-semibold uppercase tracking-wider hover:opacity-95 transition-all shadow-[0_0_15px_-3px_rgba(0,229,255,0.3)] hover:shadow-[0_0_20px_rgba(0,229,255,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
            >
              <span>Explore Live Preview</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
            </a>
          )}

          <button
            type="button"
            onClick={onClose}
            className="ml-auto px-4 py-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            Close Details (ESC)
          </button>
        </div>
      </div>
    </div>
  );
};
