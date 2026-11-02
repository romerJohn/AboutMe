import React from 'react';
import { Bot, Layers, Database, ArrowRight, Check } from 'lucide-react';
import { capabilities } from '../data/capabilities';
import { ScrollReveal } from './ScrollReveal';

export const Capabilities: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bot':
        return <Bot className="w-6 h-6 text-[#00E5FF]" />;
      case 'Layers':
        return <Layers className="w-6 h-6 text-[#8B5CF6]" />;
      case 'Database':
        return <Database className="w-6 h-6 text-[#38BDF8]" />;
      default:
        return <Bot className="w-6 h-6 text-[#00E5FF]" />;
    }
  };

  return (
    <section id="capabilities" className="py-20 relative" aria-label="Development Capabilities">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Scroll Reveal */}
        <ScrollReveal className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#00E5FF] mb-3">
            <span>Engineering Capabilities & Scope</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            What I Build
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            A breakdown of my technical interests, architectural focus, and practical engineering
            capabilities across the software lifecycle.
          </p>
        </ScrollReveal>

        {/* 3 Interactive Capability Cards with Staggered Scroll Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {capabilities.map((cap, idx) => (
            <ScrollReveal
              key={cap.id}
              delay={idx * 0.12}
              className="h-full flex flex-col"
            >
              <div className="relative rounded-2xl bg-[#0D111B]/90 border border-white/[0.08] p-7 transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-1.5 flex flex-col justify-between group shadow-lg h-full">
                {/* Subtle top accent line */}
                <div
                  className="absolute top-0 left-8 right-8 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${cap.accent}, transparent)`
                  }}
                  aria-hidden="true"
                />

                <div>
                  {/* Header Lockup */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {getIcon(cap.icon)}
                    </div>
                    <span className="font-mono text-xs text-slate-400 font-semibold">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                    {cap.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {cap.summary}
                  </p>

                  {/* Key Deliverables */}
                  <div className="space-y-2.5 pt-4 border-t border-white/[0.06]">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
                      Key Workflows
                    </span>
                    {cap.deliverables.map((item, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom focus note */}
                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center text-xs font-mono text-slate-400 group-hover:text-cyan-300 transition-colors">
                  <span>Core Competency</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
