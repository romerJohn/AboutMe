import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Milestone, ChevronRight } from 'lucide-react';
import { journeyMilestones } from '../data/journey';
import { ScrollReveal } from './ScrollReveal';
import { cardHoverVariants, checkPrefersReducedMotion } from '../utils/motionVariants';

export const Journey: React.FC = () => {
  const journeyRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const isReduced = checkPrefersReducedMotion();
    if (isReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.journey-beam',
        { y: '-100%', opacity: 0 },
        {
          y: '800%',
          opacity: 0.9,
          duration: 7,
          repeat: -1,
          ease: 'power1.inOut'
        }
      );
    }, journeyRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={journeyRef} id="journey" className="py-24 relative" aria-label="Development Journey">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Scroll Reveal */}
        <ScrollReveal className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#00E5FF] mb-3">
            <Milestone className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>Evolution & Technical Progression</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            Development Journey
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            A milestone-based roadmap highlighting my path from mastering foundational web
            mechanics to designing full-stack systems and integrating intelligent AI models.
          </p>
        </ScrollReveal>

        {/* Timeline Container with Staggered Scroll Reveal */}
        <div className="relative pl-6 sm:pl-10 border-l border-cyan-500/20 space-y-12">
          {/* Subtle GSAP Timeline Light Beam Runner */}
          <div className="pointer-events-none absolute -left-[1.5px] top-0 bottom-0 w-[3px] overflow-hidden" aria-hidden="true">
            <div className="journey-beam w-full h-36 bg-gradient-to-b from-transparent via-[#00E5FF] to-transparent shadow-[0_0_12px_#00E5FF] opacity-0" />
          </div>

          {journeyMilestones.map((milestone, idx) => (
            <ScrollReveal
              key={milestone.period}
              delay={idx * 0.15}
              className="relative group"
            >
              {/* Timeline Indicator Node */}
              <div
                className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-[#08090D] border-2 border-[#00E5FF] shadow-[0_0_12px_#00E5FF] group-hover:scale-125 transition-transform"
                aria-hidden="true"
              />

              {/* Milestone Card */}
              <motion.div
                variants={cardHoverVariants}
                initial="idle"
                whileHover="hover"
                className="rounded-2xl bg-[#0D111B]/80 border border-white/[0.07] hover:border-cyan-500/30 p-6 sm:p-7 transition-colors duration-200 shadow-md"
              >

                {/* Milestone Period / Title */}
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="font-mono text-xs font-semibold text-[#00E5FF] uppercase tracking-wider">
                    {milestone.period}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="font-mono text-xs text-slate-400">Progression Milestone</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                  {milestone.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-5">
                  {milestone.summary}
                </p>

                {/* Key Conceptual Learnings */}
                <div className="space-y-2 mb-6 pt-4 border-t border-white/[0.06]">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
                    Key Competencies Acquired
                  </span>
                  {milestone.learnings.map((learning, lIdx) => (
                    <div key={lIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <ChevronRight className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                      <span>{learning}</span>
                    </div>
                  ))}
                </div>

                {/* Applied Technologies */}
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/[0.06]">
                  <span className="text-xs font-mono text-slate-400 mr-2">Tools:</span>
                  {milestone.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 text-xs font-mono rounded bg-white/[0.04] text-cyan-200 border border-white/[0.06]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            </ScrollReveal>

          ))}
        </div>
      </div>
    </section>
  );
};
