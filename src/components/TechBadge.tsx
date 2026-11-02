import React from 'react';
import {
  Atom,
  Cpu,
  Sparkles,
  Server,
  Database,
  Zap,
  Terminal,
  Code2,
  Layers
} from 'lucide-react';

interface TechBadgeProps {
  tech: string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  interactive?: boolean;
  onClick?: (tech: string) => void;
}

interface TechConfig {
  label: string;
  icon: React.ReactNode;
  idleClasses: string;
  hoverClasses: string;
}

export const TechBadge: React.FC<TechBadgeProps> = ({
  tech,
  size = 'sm',
  showIcon = true,
  interactive = true,
  onClick
}) => {
  const normalized = tech.trim().toLowerCase();

  const getBadgeConfig = (): TechConfig => {
    const iconSizeClass = size === 'md' ? 'w-3.5 h-3.5' : 'w-3 h-3';

    if (normalized.includes('react')) {
      return {
        label: tech,
        icon: (
          <Atom
            className={`${iconSizeClass} text-[#00E5FF] transition-transform duration-200 group-hover/badge:scale-110 group-hover/badge:rotate-12`}
          />
        ),
        idleClasses:
          'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/35 shadow-[0_0_8px_-2px_rgba(0,229,255,0.25)]',
        hoverClasses:
          'hover:border-[#00E5FF] hover:bg-[#00E5FF]/20 hover:text-white hover:shadow-[0_0_16px_2px_rgba(0,229,255,0.45)]'
      };
    }

    if (
      normalized === 'ai' ||
      normalized.includes('gemini') ||
      normalized.includes('gpt') ||
      normalized.includes('ml') ||
      normalized.includes('ai/')
    ) {
      return {
        label: tech === 'Google Gemini' ? 'AI · Gemini' : tech,
        icon: (
          <Sparkles
            className={`${iconSizeClass} text-[#C084FC] transition-transform duration-200 group-hover/badge:scale-110 group-hover/badge:-rotate-12`}
          />
        ),
        idleClasses:
          'bg-[#8B5CF6]/15 text-[#C084FC] border-[#8B5CF6]/40 shadow-[0_0_8px_-2px_rgba(139,92,246,0.25)]',
        hoverClasses:
          'hover:border-[#C084FC] hover:bg-[#8B5CF6]/25 hover:text-white hover:shadow-[0_0_16px_2px_rgba(168,85,247,0.5)]'
      };
    }

    if (normalized.includes('python')) {
      return {
        label: tech,
        icon: (
          <Terminal
            className={`${iconSizeClass} text-amber-300 transition-transform duration-200 group-hover/badge:scale-110 group-hover/badge:translate-x-0.5`}
          />
        ),
        idleClasses:
          'bg-amber-500/10 text-amber-300 border-amber-500/35 shadow-[0_0_8px_-2px_rgba(245,158,11,0.25)]',
        hoverClasses:
          'hover:border-amber-400 hover:bg-amber-500/20 hover:text-amber-100 hover:shadow-[0_0_16px_2px_rgba(245,158,11,0.45)]'
      };
    }

    if (normalized.includes('node') || normalized.includes('express')) {
      return {
        label: tech,
        icon: (
          <Server
            className={`${iconSizeClass} text-emerald-300 transition-transform duration-200 group-hover/badge:scale-110`}
          />
        ),
        idleClasses:
          'bg-emerald-500/10 text-emerald-300 border-emerald-500/35 shadow-[0_0_8px_-2px_rgba(16,185,129,0.25)]',
        hoverClasses:
          'hover:border-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-100 hover:shadow-[0_0_16px_2px_rgba(16,185,129,0.45)]'
      };
    }

    if (normalized.includes('fastapi')) {
      return {
        label: tech,
        icon: (
          <Zap
            className={`${iconSizeClass} text-teal-300 transition-transform duration-200 group-hover/badge:scale-110 group-hover/badge:scale-y-125`}
          />
        ),
        idleClasses:
          'bg-teal-500/10 text-teal-300 border-teal-500/35 shadow-[0_0_8px_-2px_rgba(20,184,166,0.25)]',
        hoverClasses:
          'hover:border-teal-400 hover:bg-teal-500/20 hover:text-teal-100 hover:shadow-[0_0_16px_2px_rgba(20,184,166,0.45)]'
      };
    }

    if (normalized.includes('typescript')) {
      return {
        label: tech,
        icon: (
          <Code2
            className={`${iconSizeClass} text-sky-300 transition-transform duration-200 group-hover/badge:scale-110`}
          />
        ),
        idleClasses:
          'bg-sky-500/10 text-sky-300 border-sky-500/35 shadow-[0_0_8px_-2px_rgba(56,189,248,0.25)]',
        hoverClasses:
          'hover:border-sky-400 hover:bg-sky-500/20 hover:text-sky-100 hover:shadow-[0_0_16px_2px_rgba(56,189,248,0.45)]'
      };
    }

    if (
      normalized.includes('postgres') ||
      normalized.includes('sql') ||
      normalized.includes('supabase')
    ) {
      return {
        label: tech,
        icon: (
          <Database
            className={`${iconSizeClass} text-indigo-300 transition-transform duration-200 group-hover/badge:scale-110`}
          />
        ),
        idleClasses:
          'bg-indigo-500/10 text-indigo-300 border-indigo-500/35 shadow-[0_0_8px_-2px_rgba(99,102,241,0.25)]',
        hoverClasses:
          'hover:border-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-100 hover:shadow-[0_0_16px_2px_rgba(99,102,241,0.45)]'
      };
    }

    return {
      label: tech,
      icon: (
        <Layers
          className={`${iconSizeClass} text-slate-300 transition-transform duration-200 group-hover/badge:scale-110`}
        />
      ),
      idleClasses: 'bg-white/[0.05] text-slate-200 border-white/10',
      hoverClasses:
        'hover:border-cyan-400/50 hover:bg-white/[0.1] hover:text-white hover:shadow-[0_0_14px_1px_rgba(0,229,255,0.25)]'
    };
  };

  const config = getBadgeConfig();

  const sizeClasses =
    size === 'md'
      ? 'px-2.5 py-1 text-xs gap-1.5'
      : 'px-2 py-0.5 text-[11px] gap-1.5';

  const interactiveClasses = interactive
    ? `group/badge cursor-pointer transform transition-all duration-200 ease-out hover:scale-105 active:scale-95 ${config.hoverClasses}`
    : '';

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.stopPropagation();
      onClick(tech);
    }
  };

  return (
    <span
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          e.stopPropagation();
          onClick(tech);
        }
      }}
      title={onClick ? `Filter projects by ${config.label}` : config.label}
      className={`inline-flex items-center rounded-md font-mono border select-none ${sizeClasses} ${config.idleClasses} ${interactiveClasses}`}
    >
      {showIcon && config.icon}
      <span className="font-medium whitespace-nowrap transition-colors duration-200">
        {config.label}
      </span>
    </span>
  );
};
