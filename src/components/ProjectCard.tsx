import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import {
  Github,
  ExternalLink,
  ArrowRight,
  Layers,
  Check,
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
import { calculateTilt } from '../utils/tilt';
import { calculateRadialGlow } from '../utils/radialGlow';
import { createProjectCardEntranceVariants } from '../utils/animations';

interface ProjectCardProps {
  project: Project;
  onOpenDetails: (project: Project) => void;
  onSelectTech?: (tech: string) => void;
  repoStats?: GitHubRepoStats;
  isBookmarked?: boolean;
  onToggleBookmark?: (projectId: string) => void;
  index?: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpenDetails,
  onSelectTech,
  repoStats,
  isBookmarked = false,
  onToggleBookmark,
  index = 0
}) => {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for 3D perspective rotation
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Smooth spring physics for natural, fluid tilt glide and return
  const springConfig = { damping: 20, stiffness: 220, mass: 0.6 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  // Dynamic specular glare reflection coordinates
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  // Mouse-tracking soft cyan radial glow coordinates and gradient
  const [radialGlow, setRadialGlow] = useState({
    x: 0,
    y: 0,
    background: 'radial-gradient(380px circle at 50% 50%, rgba(0, 229, 255, 0.16), transparent 65%)'
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const rect = cardRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const tilt = calculateTilt(clientX, clientY, rect.width, rect.height, 10);
    rotateX.set(tilt.rotateX);
    rotateY.set(tilt.rotateY);
    setGlarePos({ x: tilt.glareX, y: tilt.glareY });

    const glow = calculateRadialGlow(clientX, clientY, rect.width, rect.height, {
      color: 'rgba(0, 229, 255, 0.16)',
      radius: 380,
      falloffPercent: 65
    });
    setRadialGlow(glow);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
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
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const entranceVariants = createProjectCardEntranceVariants({ index });

  return (
    <motion.div
      ref={cardRef}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={entranceVariants}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="h-full [perspective:1000px] flex flex-col"
    >
      <motion.article
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: 'preserve-3d',
        }}
        onClick={() => onOpenDetails(project)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenDetails(project);
          }
        }}
        className="group relative rounded-2xl bg-[#0D111B]/90 border border-white/[0.08] hover:border-cyan-500/40 transition-colors duration-300 flex flex-col justify-between overflow-hidden shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] h-full"
        aria-labelledby={`project-title-${project.id}`}
        aria-haspopup="dialog"
      >
        {/* Mouse-Tracking Radial Soft Cyan Light Effect */}
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 rounded-2xl overflow-hidden"
          style={{
            opacity: isHovered ? 1 : 0,
            background: radialGlow.background,
          }}
          aria-hidden="true"
        />

        {/* Specular 3D Holographic Glare Overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 rounded-2xl"
          style={{
            opacity: isHovered ? 0.35 : 0,
            background: `radial-gradient(circle 350px at ${glarePos.x}% ${glarePos.y}%, ${project.accentColor}33, transparent 70%)`,
          }}
          aria-hidden="true"
        />

        {/* Top subtle glow accent line on hover */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
          style={{
            background: `linear-gradient(90deg, transparent, ${project.accentColor}, transparent)`,
          }}
          aria-hidden="true"
        />

      {/* Visual illustration top section */}
      <div className="p-4 sm:p-5 pb-0">
        <ProjectVisual type={project.previewType} title={project.title} />
      </div>

      {/* Card Content Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-5">
        <div>
          {/* Metadata Bar & Top Quick Actions */}
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
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
              <span aria-hidden="true">·</span>
              <span className="uppercase">
                {project.categories ? project.categories.join(' / ') : project.category}
              </span>
              {repoStats && (
                <>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span
                    className="inline-flex items-center gap-1 text-amber-300 font-mono text-[11px]"
                    title={`${repoStats.stars} GitHub stars`}
                  >
                    <Star className="w-3 h-3 fill-amber-300/40 text-amber-300" />
                    <span>{repoStats.formattedStars}</span>
                  </span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span
                    className="inline-flex items-center gap-1 text-cyan-300/90 font-mono text-[11px]"
                    title={`Latest commit: ${repoStats.latestCommitDate || 'Sync pending'}`}
                  >
                    <GitCommit className="w-3 h-3 text-cyan-400" />
                    <span>{repoStats.formattedCommitDate}</span>
                  </span>
                </>
              )}
            </div>

            {/* Quick Action Icons: Copy Link & Bookmark */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#00E5FF] cursor-pointer"
                aria-label={`Copy direct link for ${project.title}`}
                title={copied ? 'Link Copied!' : 'Copy Project Link'}
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Link2 className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark?.(project.id);
                }}
                className={`p-1.5 rounded-lg transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-[#00E5FF] cursor-pointer ${
                  isBookmarked
                    ? 'text-[#00E5FF] bg-cyan-500/15 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/10 border border-transparent'
                }`}
                aria-label={isBookmarked ? `Remove ${project.title} from bookmarks` : `Save ${project.title} for later`}
                aria-pressed={isBookmarked}
                title={isBookmarked ? 'Saved for Later' : 'Save for Later'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#00E5FF]' : ''}`} />
              </button>
            </div>
          </div>

          {/* Visual Badges for Core Technologies */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {(project.coreTechnologies || ['React', 'AI']).map((tech) => (
              <TechBadge
                key={tech}
                tech={tech}
                size="sm"
                onClick={onSelectTech}
              />
            ))}
          </div>

          <h3
            id={`project-title-${project.id}`}
            className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2"
          >
            {project.title}
          </h3>

          <p className="text-xs sm:text-sm text-cyan-400 font-mono mb-3">
            {project.subtitle}
          </p>

          <p className="text-sm text-slate-300 leading-relaxed line-clamp-3 mb-4">
            {project.description}
          </p>

          {/* Key Features Preview (3 points) */}
          <div className="space-y-1.5 mb-5 border-t border-white/[0.06] pt-3">
            {project.keyFeatures.slice(0, 3).map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <Check className="w-3 h-3 text-[#00E5FF] shrink-0 mt-0.5" />
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>

          {/* All Technologies Badges */}
          <div className="pt-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1.5">
              Full Stack
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {project.technologies.map((tech) => (
                <TechBadge
                  key={tech}
                  tech={tech}
                  size="sm"
                  showIcon={false}
                  onClick={onSelectTech}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action Controls Footer */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3 text-xs">
          <div className="inline-flex items-center gap-1.5 text-cyan-300 group-hover:text-white font-medium transition-colors">
            <Layers className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>View Details & Tech Stack</span>
            <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
          </div>

          <div className="flex items-center gap-1.5">
            {/* Copy Project Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#00E5FF] cursor-pointer"
              aria-label={`Copy link for ${project.title}`}
              title={copied ? 'Link Copied!' : 'Copy Project Link'}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Link2 className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Save for Later Bookmark */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark?.(project.id);
              }}
              className={`p-1.5 rounded-lg transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#00E5FF] cursor-pointer ${
                isBookmarked
                  ? 'text-[#00E5FF] bg-cyan-500/15'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
              aria-label={isBookmarked ? `Remove ${project.title} from bookmarks` : `Save ${project.title} for later`}
              aria-pressed={isBookmarked}
              title={isBookmarked ? 'Saved for Later' : 'Save for Later'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#00E5FF]' : ''}`} />
            </button>

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 px-2 py-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#00E5FF] font-mono text-xs"
                aria-label={`View Source on GitHub for ${project.title} (${repoStats?.stars ?? 0} stars)`}
                title="View Source on GitHub"
              >
                <Github className="w-3.5 h-3.5" />
                {repoStats && (
                  <span className="flex items-center gap-0.5 text-amber-300 font-sans text-[11px] font-medium">
                    <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                    <span>{repoStats.formattedStars}</span>
                  </span>
                )}
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-white/10 rounded transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#00E5FF]"
                aria-label={`Live Demo for ${project.title}`}
                title="Live Demo Preview"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
      </motion.article>
    </motion.div>
  );
};
