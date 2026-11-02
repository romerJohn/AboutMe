import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Server, Database, Sparkles, Terminal, Code2 } from 'lucide-react';
import { skillCategories } from '../data/skills';
import { ScrollReveal } from './ScrollReveal';
import { cardHoverVariants } from '../utils/motionVariants';


export const Skills: React.FC = () => {
  const categoryIcons = [
    <Layout className="w-4 h-4 text-[#00E5FF]" />,
    <Server className="w-4 h-4 text-[#8B5CF6]" />,
    <Database className="w-4 h-4 text-[#38BDF8]" />,
    <Sparkles className="w-4 h-4 text-emerald-400" />
  ];

  return (
    <section id="skills" className="py-24 relative" aria-label="Technical Skills">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Scroll Reveal */}
        <ScrollReveal className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#00E5FF] mb-3">
            <Terminal className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>Technical Capabilities & Stack</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            Technologies & Tools
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Organized across four functional layers. I focus on deep conceptual understanding
            rather than superficial memorization, choosing the right tool for each architectural layer.
          </p>
        </ScrollReveal>

        {/* 4 Category Cards Grid with Staggered Scroll Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((category, idx) => (
            <ScrollReveal
              key={category.title}
              delay={idx * 0.1}
              className="h-full flex flex-col"
            >
              <motion.div
                variants={cardHoverVariants}
                initial="idle"
                whileHover="hover"
                className="rounded-2xl bg-[#0D111B]/90 border border-white/[0.08] hover:border-cyan-500/30 p-6 sm:p-7 flex flex-col justify-between transition-colors duration-200 shadow-lg group h-full"
              >

                <div>
                  {/* Header Lockup */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center">
                      {categoryIcons[idx] || <Code2 className="w-4 h-4 text-[#00E5FF]" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {category.title}
                      </h3>
                      <span className="text-xs font-mono text-slate-400">
                        {category.skills.length} core technologies
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 mb-6">
                    {category.description}
                  </p>

                  {/* Skills Stack List */}
                  <div className="space-y-3">
                    {category.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="p-3 rounded-xl bg-black/30 border border-white/[0.04] hover:border-cyan-500/20 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-sm font-semibold text-white font-mono flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                            {skill.name}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-normal pl-3">
                          {skill.context}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>

          ))}
        </div>
      </div>
    </section>
  );
};
