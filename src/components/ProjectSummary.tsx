import React from 'react';
import { FolderGit2, Star, Code2, GitCommit, Sparkles } from 'lucide-react';
import { ProjectSummaryMetrics } from '../utils/projectMetrics';

interface ProjectSummaryProps {
  metrics: ProjectSummaryMetrics;
  isLoading?: boolean;
}

export const ProjectSummary: React.FC<ProjectSummaryProps> = ({ metrics, isLoading }) => {
  const cards = [
    {
      id: 'projects',
      label: 'Total Projects',
      value: String(metrics.totalProjects),
      subtext: 'Engineered systems & sandboxes',
      icon: FolderGit2,
      accentColor: '#00E5FF',
      glowClass: 'group-hover:shadow-[0_0_25px_-5px_rgba(0,229,255,0.3)]',
      iconColor: 'text-[#00E5FF]',
      borderHover: 'hover:border-cyan-500/40'
    },
    {
      id: 'stars',
      label: 'Total Stars',
      value: metrics.formattedTotalStars,
      subtext: 'Live GitHub community telemetry',
      icon: Star,
      accentColor: '#F59E0B',
      glowClass: 'group-hover:shadow-[0_0_25px_-5px_rgba(245,158,11,0.3)]',
      iconColor: 'text-amber-400 fill-amber-400/30',
      borderHover: 'hover:border-amber-500/40'
    },
    {
      id: 'languages',
      label: 'Languages Used',
      value: `${metrics.languagesCount}`,
      subtext: metrics.languagesUsed.slice(0, 4).join(' · '),
      icon: Code2,
      accentColor: '#8B5CF6',
      glowClass: 'group-hover:shadow-[0_0_25px_-5px_rgba(139,92,246,0.3)]',
      iconColor: 'text-violet-400',
      borderHover: 'hover:border-violet-500/40'
    },
    {
      id: 'activity',
      label: 'Latest Git Commit',
      value: metrics.latestActivity,
      subtext: 'Fresh codebase deployments',
      icon: GitCommit,
      accentColor: '#10B981',
      glowClass: 'group-hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.3)]',
      iconColor: 'text-emerald-400',
      borderHover: 'hover:border-emerald-500/40'
    }
  ];

  return (
    <div
      className="mb-12"
      aria-label="Repository Telemetry & Codebase Overview"
    >
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-slate-400 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
        <span>Repository Telemetry & Codebase Overview</span>
        {isLoading && (
          <span className="text-[10px] text-cyan-400 animate-pulse ml-2 font-mono">
            [Syncing GitHub Data...]
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className={`group relative rounded-2xl bg-[#0D111B]/90 border border-white/[0.08] ${card.borderHover} p-5 sm:p-6 transition-all duration-300 shadow-md ${card.glowClass} flex flex-col justify-between overflow-hidden`}
            >
              {/* Subtle accent line on top */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] opacity-20 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(90deg, transparent, ${card.accentColor}, transparent)`
                }}
                aria-hidden="true"
              />

              <div className="flex items-start justify-between gap-3 mb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  {card.label}
                </span>
                <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] group-hover:scale-105 transition-transform shrink-0">
                  <Icon className={`w-4 h-4 ${card.iconColor}`} />
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold font-mono tracking-tight text-white mb-1.5 tabular-nums">
                  {card.value}
                </div>
                <p className="text-xs text-slate-400 font-mono truncate" title={card.subtext}>
                  {card.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
