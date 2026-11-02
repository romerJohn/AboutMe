import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Mail, Github, ChevronDown } from 'lucide-react';
import { HeroVisual } from './HeroVisual';
import { HeroParticles } from './HeroParticles';

// Lazy-load Three.js 3D visual so it is code-split from the initial entry bundle
const Hero3DVisual = React.lazy(() => import('./Hero3DVisual'));

import { developerProfile } from '../data/profile';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { checkPrefersReducedMotion } from '../utils/motionVariants';
import { CyberButton } from './ui';

interface HeroProps {
  onExploreProjects: () => void;
  onContactClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreProjects, onContactClick }) => {
  const heroRef = useRef<HTMLElement | null>(null);

  const { displayText } = useTypingEffect({
    words: ['AI Engineer', 'Full-stack Developer', 'Tech Innovator'],
    typingSpeed: 90,
    deletingSpeed: 45,
    pauseDuration: 1800
  });

  useEffect(() => {
    const isReduced = checkPrefersReducedMotion();
    if (isReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });

      // 1. Initial State: set elements hidden cleanly
      gsap.set(
        ['.hero-badge', '.hero-headline', '.hero-role', '.hero-pitch', '.hero-cta', '.hero-socials', '.hero-visual'],
        { autoAlpha: 0 }
      );

      // 2. Cinematic Holographic Ambient Light Sweep
      tl.fromTo(
        '.hero-light-sweep',
        { x: '-100%', opacity: 0 },
        { x: '100%', opacity: 0.85, duration: 1.6, ease: 'power2.inOut' }
      );

      // 3. Status Badge Fades and Rises
      tl.fromTo(
        '.hero-badge',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.5 },
        '-=1.1'
      );

      // 4. Main Headline Reveals
      tl.fromTo(
        '.hero-headline',
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.65 },
        '-=0.25'
      );

      // 5. AI & Code Gradient Text Emphasis Bloom
      tl.fromTo(
        '.hero-gradient-text',
        { filter: 'brightness(1.6) drop-shadow(0 0 16px rgba(0, 229, 255, 0.75))' },
        { filter: 'brightness(1) drop-shadow(0 0 0px rgba(0, 229, 255, 0))', duration: 0.8 },
        '-=0.35'
      );

      // 6. Dynamic Role Typing Sub-headline
      tl.fromTo(
        '.hero-role',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.45 },
        '-=0.45'
      );

      // 7. Pitch Description
      tl.fromTo(
        '.hero-pitch',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.5 },
        '-=0.3'
      );

      // 8. Primary and Secondary CTA Buttons Container
      tl.fromTo(
        '.hero-cta',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.5 },
        '-=0.3'
      );

      // 9. Social Proof Links
      tl.fromTo(
        '.hero-socials',
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.4 },
        '-=0.2'
      );

      // 10. Neural Workspace Visual
      tl.fromTo(
        '.hero-visual',
        { autoAlpha: 0, scale: 0.96 },
        { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power2.out' },
        0.3
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-[92vh] flex items-center pt-28 pb-16 lg:py-24 overflow-hidden"
      aria-label="Introduction & Overview"
    >
      {/* Cinematic Ambient Holographic Light Sweep Line */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] overflow-hidden" aria-hidden="true">
        <div className="hero-light-sweep w-1/2 h-full bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-0" />
      </div>

      {/* Subtle reactive canvas particle background */}
      <HeroParticles />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typographic & Action Core */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            {/* Availability Badge */}
            <div className="hero-badge inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D111B] border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wider max-w-max shadow-[0_0_15px_-4px_rgba(0,229,255,0.3)]">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" aria-hidden="true" />
              <span>{developerProfile.availabilityBadge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-headline text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] text-balance">
              Building the Future with{' '}
              <span className="hero-gradient-text inline-block bg-gradient-to-r from-[#00E5FF] via-[#60A5FA] to-[#8B5CF6] bg-clip-text text-transparent">
                AI & Code
              </span>
              .
            </h1>

            {/* Dynamic Role Typing Sub-headline */}
            <div className="hero-role flex flex-wrap items-center gap-2 font-mono text-base sm:text-lg min-h-[32px]">
              <span className="text-slate-400 font-normal">Building as an</span>
              <span className="font-semibold text-[#00E5FF] tracking-wide inline-flex items-center bg-cyan-950/40 px-2.5 py-0.5 rounded-md border border-cyan-500/30">
                <span>{displayText}</span>
                <span className="inline-block w-2 h-4 bg-[#00E5FF] ml-1.5 animate-pulse" aria-hidden="true" />
              </span>
            </div>

            {/* Supporting Pitch */}
            <p className="hero-pitch text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              I develop intelligent applications, practical software solutions, and modern web
              experiences. Focused on bridging advanced machine learning models with robust,
              disciplined full-stack engineering.
            </p>

            {/* Primary & Secondary Call to Actions Container */}
            <div className="hero-cta flex flex-wrap items-center gap-4 pt-2">
              <CyberButton
                type="button"
                variant="primary"
                size="md"
                onClick={onExploreProjects}
                rightIcon={<ArrowRight className="w-4 h-4 text-slate-950" />}
              >
                Explore My Projects
              </CyberButton>

              <CyberButton
                type="button"
                variant="secondary"
                size="md"
                onClick={onContactClick}
                leftIcon={<Mail className="w-4 h-4 text-[#00E5FF]" />}
              >
                Contact Me
              </CyberButton>
            </div>

            {/* Social Links & Quick Proof */}
            <div className="hero-socials flex items-center gap-6 pt-4 border-t border-white/[0.08] text-xs font-mono text-slate-400">
              <a
                href={developerProfile.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-[#00E5FF] transition-colors focus:outline-none focus-visible:underline"
              >
                <Github className="w-4 h-4 text-slate-300" />
                <span>GitHub Repositories</span>
              </a>
              <span className="text-slate-600">·</span>
              <a
                href={`mailto:${developerProfile.socials.email}`}
                className="flex items-center gap-1.5 hover:text-[#00E5FF] transition-colors focus:outline-none focus-visible:underline"
              >
                <Mail className="w-4 h-4 text-slate-300" />
                <span>{developerProfile.socials.email}</span>
              </a>
            </div>
          </div>

          {/* Right Column: 3D AI Neural Core with Automatic 2D Fallback */}
          <div className="hero-visual lg:col-span-6 flex items-center justify-center">
            <React.Suspense fallback={<HeroVisual />}>
              <Hero3DVisual />
            </React.Suspense>
          </div>

        </div>

        {/* Subtle Scroll Down Indicator */}
        <div className="mt-14 hidden md:flex justify-center">
          <a
            href="#about"
            className="flex flex-col items-center gap-1 text-slate-500 hover:text-cyan-400 transition-colors text-xs font-mono focus:outline-none focus-visible:ring-1 focus-visible:ring-[#00E5FF] rounded p-1"
            aria-label="Scroll down to About section"
          >
            <span>DISCOVER WORK</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-slate-400" />
          </a>
        </div>
      </div>
    </section>
  );
};

