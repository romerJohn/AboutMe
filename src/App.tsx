/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BackgroundGrid } from './components/BackgroundGrid';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VoiceControl } from './components/VoiceControl';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { ParticleBackground } from './components/ParticleBackground';
import { ToastProvider } from './components/ui';
import { useVoiceNavigation } from './hooks/useVoiceNavigation';
import { ProjectCategory } from './types/portfolio';

// Lazy-load all major sections below the Hero to minimize initial bundle size and optimize TTI
const About = lazy(() => import('./components/About').then((m) => ({ default: m.About })));
const Capabilities = lazy(() => import('./components/Capabilities').then((m) => ({ default: m.Capabilities })));
const Projects = lazy(() => import('./components/Projects').then((m) => ({ default: m.Projects })));
const Skills = lazy(() => import('./components/Skills').then((m) => ({ default: m.Skills })));
const Journey = lazy(() => import('./components/Journey').then((m) => ({ default: m.Journey })));
const Vlog = lazy(() => import('./components/Vlog').then((m) => ({ default: m.Vlog })));
const Certificates = lazy(() => import('./components/Certificates').then((m) => ({ default: m.Certificates })));
const Contact = lazy(() => import('./components/Contact').then((m) => ({ default: m.Contact })));
const Footer = lazy(() => import('./components/Footer').then((m) => ({ default: m.Footer })));

interface SectionSkeletonProps {
  id?: string;
  title?: string;
  heightClass?: string;
}

const SectionSkeleton: React.FC<SectionSkeletonProps> = ({
  id,
  title,
  heightClass = 'min-h-[380px]'
}) => (
  <section
    id={id}
    className={`w-full ${heightClass} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center`}
    aria-busy="true"
    aria-label={title ? `Loading ${title}` : 'Loading section'}
  >
    <div className="w-full h-full rounded-2xl bg-white/[0.02] border border-white/[0.06] p-8 flex flex-col justify-between">
      <div className="flex items-center gap-3">
        <div className="w-2.5 h-2.5 rounded-full bg-[#00E5FF]/60 animate-ping" />
        <span className="font-mono text-[11px] text-cyan-400/80 tracking-wider">
          LOADING {title?.toUpperCase() || 'SECTION'}...
        </span>
      </div>
      <div className="my-6 space-y-3">
        <div className="h-6 w-2/3 max-w-sm bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-1/2 max-w-xs bg-white/5 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/[0.04]">
        <div className="h-16 bg-white/[0.02] border border-white/[0.04] rounded-xl animate-pulse" />
        <div className="h-16 bg-white/[0.02] border border-white/[0.04] rounded-xl animate-pulse hidden md:block" />
        <div className="h-16 bg-white/[0.02] border border-white/[0.04] rounded-xl animate-pulse hidden md:block" />
      </div>
    </div>
  </section>
);

const FooterSkeleton: React.FC = () => (
  <footer className="w-full h-40 bg-[#06080C] border-t border-white/[0.08] flex items-center justify-center text-slate-500 font-mono text-xs">
    <div className="flex items-center gap-2 animate-pulse">
      <div className="w-2 h-2 rounded-full bg-[#00E5FF]/40" />
      <span>Loading footer telemetry...</span>
    </div>
  </footer>
);
import {

  Theme,
  loadSavedTheme,
  applyTheme,
  persistTheme,
  getOppositeTheme
} from './utils/theme';

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const initial = loadSavedTheme();
    applyTheme(initial);
    return initial;
  });

  const [voiceCategory, setVoiceCategory] = useState<ProjectCategory | null>(null);
  const [voiceSearch, setVoiceSearch] = useState<string | null>(null);

  const handleToggleTheme = (targetTheme?: Theme) => {
    setTheme((prev) => {
      const next = targetTheme || getOppositeTheme(prev);
      applyTheme(next);
      persistTheme(next);
      return next;
    });
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const voiceNav = useVoiceNavigation({
    onNavigate: (sectionId) => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    onFilterCategory: (category) => {
      setVoiceCategory(category);
      setVoiceSearch('');
    },
    onSearch: (query) => {
      setVoiceSearch(query);
      setVoiceCategory('all');
    },
    onToggleTheme: (targetTheme) => {
      handleToggleTheme(targetTheme);
    }
  });

  const scrollToProjects = () => {
    const el = document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ToastProvider>
      <div className="relative min-h-screen bg-[#08090D] text-slate-100 flex flex-col font-sans selection:bg-[#00E5FF]/20 selection:text-[#00E5FF] transition-colors duration-300">
        {/* Scroll-Linked Progress Bar (Framer-Motion) */}
        <ScrollProgressBar />

        {/* Ambient background grid & lighting */}
        <BackgroundGrid />

        {/* Top Navigation Bar with High-Contrast Theme Toggle */}
        <Navbar
          theme={theme}
          onToggleTheme={() => handleToggleTheme()}
          onNavigate={(id) => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Main Page Sections */}
        <main className="relative z-10 flex-1">
          {/* Interactive Neural-Network Particle Effect behind Hero */}
          <div className="relative">
            <ParticleBackground />
            <Hero
              onExploreProjects={scrollToProjects}
              onContactClick={scrollToContact}
            />
          </div>
          <Suspense fallback={<SectionSkeleton id="about" title="About" />}>
            <About />
          </Suspense>

          <Suspense fallback={<SectionSkeleton id="capabilities" title="Capabilities" />}>
            <Capabilities />
          </Suspense>

          <Suspense fallback={<SectionSkeleton id="projects" title="Projects" heightClass="min-h-[600px]" />}>
            <Projects
              externalCategory={voiceCategory}
              externalSearch={voiceSearch}
            />
          </Suspense>

          <Suspense fallback={<SectionSkeleton id="skills" title="Skills" />}>
            <Skills />
          </Suspense>

          <Suspense fallback={<SectionSkeleton id="journey" title="Journey" />}>
            <Journey />
          </Suspense>

          <Suspense fallback={<SectionSkeleton id="vlog" title="Personal Vlog" />}>
            <Vlog />
          </Suspense>

          <Suspense fallback={<SectionSkeleton id="certificates" title="Certificates" />}>
            <Certificates />
          </Suspense>

          <Suspense fallback={<SectionSkeleton id="contact" title="Contact" heightClass="min-h-[500px]" />}>
            <Contact />
          </Suspense>
        </main>

        {/* Web Speech API Voice Controller */}
        <VoiceControl
          isListening={voiceNav.isListening}
          isSupported={voiceNav.isSupported}
          transcript={voiceNav.transcript}
          feedback={voiceNav.feedback}
          onToggleListening={voiceNav.toggleListening}
          onSimulateCommand={voiceNav.simulateVoiceCommand}
        />

        {/* Footer */}
        <Suspense fallback={<FooterSkeleton />}>
          <Footer />
        </Suspense>
      </div>
    </ToastProvider>
  );

}
