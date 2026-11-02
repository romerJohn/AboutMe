import React from 'react';
import { motion } from 'framer-motion';
import { Code, Cpu, Database, Compass, Terminal, CheckCircle2 } from 'lucide-react';
import { developerProfile } from '../data/profile';
import { ScrollReveal } from './ScrollReveal';
import { cardHoverVariants } from '../utils/motionVariants';


export const About: React.FC = () => {
  const iconMap: Record<string, React.ReactNode> = {
    'Full-Stack Craftsmanship': <Code className="w-5 h-5 text-[#00E5FF]" />,
    'Pragmatic AI Integration': <Cpu className="w-5 h-5 text-[#8B5CF6]" />,
    'System Design & Modularity': <Database className="w-5 h-5 text-[#38BDF8]" />,
    'Continuous Experimentation': <Compass className="w-5 h-5 text-emerald-400" />,
  };

  return (
    <section id="about" className="py-24 relative" aria-label="About Kai Ross">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Scroll Reveal */}
        <ScrollReveal className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#00E5FF] mb-3">
            <Terminal className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>Developer Philosophy & Background</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
            Curious Mind. Builder's Mentality.
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            {developerProfile.bioIntro}
          </p>
        </ScrollReveal>

        {/* Narrative & Principles Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Narrative Story Column with Scroll Reveal */}
          <ScrollReveal delay={0.1} className="lg:col-span-6 space-y-5 text-slate-300 leading-relaxed">
            {developerProfile.aboutStory.map((paragraph, index) => (
              <p key={index} className="text-base text-slate-300">
                {paragraph}
              </p>
            ))}

            {/* Practical Focus Areas List */}
            <div className="pt-4 border-t border-white/[0.08] space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white font-mono">
                Core Development Focus Areas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                  <span>Full-Stack Web Development</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                  <span>AI-Powered Interactive Apps</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                  <span>Backend & Database Systems</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                  <span>System Design & Prototyping</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Core Values Cards Column with Scroll Reveal */}
          <ScrollReveal delay={0.2} className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {developerProfile.coreValues.map((val) => (
              <motion.div
                key={val.title}
                variants={cardHoverVariants}
                initial="idle"
                whileHover="hover"
                className="p-5 rounded-xl bg-[#0D111B]/80 border border-white/[0.07] hover:border-cyan-500/30 transition-colors duration-200 group"
              >
                <div className="w-10 h-10 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  {iconMap[val.title] || <Terminal className="w-5 h-5 text-[#00E5FF]" />}
                </div>
                <h4 className="text-base font-semibold text-white mb-2">
                  {val.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
};
