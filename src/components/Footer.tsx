import React from 'react';
import {
  Terminal,
  Github,
  Mail,
  Linkedin,
  Twitter,
  ArrowUp,
  ArrowUpRight,
  FileText,
  Download,
  ExternalLink,
  Share2
} from 'lucide-react';
import { developerProfile } from '../data/profile';
import { NewsletterSubscribe } from './NewsletterSubscribe';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#05060A] py-14 relative" aria-label="Site Footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dedicated Resume Download Section with Cyber Glassmorphic Style */}
        <section
          className="mb-12 rounded-2xl bg-[#0D111B]/80 border border-white/10 hover:border-cyan-500/40 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden transition-all duration-300 shadow-xl group"
          aria-labelledby="footer-resume-heading"
        >
          {/* Subtle accent glow line on top */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-300"
            aria-hidden="true"
          />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00E5FF] tracking-wider uppercase">
                <FileText className="w-3.5 h-3.5" />
                <span>Curriculum Vitae & Verified Credentials</span>
              </div>
              <h3 id="footer-resume-heading" className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Review Full Engineering Background
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Detailed experience covering machine learning workflows, full-stack architecture, technical problem-solving, and verified project milestones.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <a
                href="/resume.pdf"
                download="Kai_Ross_Resume.pdf"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-slate-950 font-semibold text-xs tracking-wider uppercase hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] cursor-pointer"
                aria-label="Download Resume in PDF format"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>Download Resume (PDF)</span>
              </a>

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 hover:border-cyan-500/30 font-mono text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
                aria-label="View Resume PDF in a new browser tab"
              >
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                <span>View Online</span>
              </a>
            </div>
          </div>
        </section>

        {/* Dedicated Social Media Section with Cyan & Electric-Blue Aesthetic */}
        <section
          className="mb-12 rounded-2xl bg-[#0D111B]/80 border border-white/10 hover:border-cyan-500/40 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden transition-all duration-300 shadow-xl group"
          aria-labelledby="footer-socials-heading"
        >
          {/* Subtle accent glow line on top */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-300"
            aria-hidden="true"
          />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10 mb-6">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00E5FF] tracking-wider uppercase">
                <Share2 className="w-3.5 h-3.5" />
                <span>Connect & Collaborate // Social Matrix</span>
              </div>
              <h3 id="footer-socials-heading" className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Connect Across the Web
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Follow recent open-source repositories, engineering dispatches, and career milestones across LinkedIn, GitHub, and Twitter.
              </p>
            </div>

            <div className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1.5 rounded-xl hidden sm:inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
              <span>Network Status: Online & Active</span>
            </div>
          </div>

          {/* Social Cards Grid: LinkedIn, GitHub, and Twitter */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
            {/* LinkedIn */}
            <a
              href={developerProfile.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group/card relative rounded-xl p-4 bg-[#08090D]/80 border border-white/10 hover:border-cyan-500/50 hover:bg-[#0D1525] transition-all duration-300 flex items-center justify-between shadow-md hover:shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
              aria-label="Connect with Kai Ross on LinkedIn"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00E5FF] group-hover/card:bg-gradient-to-r group-hover/card:from-[#00E5FF] group-hover/card:to-[#38BDF8] group-hover/card:text-slate-950 transition-all shadow-sm">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white group-hover/card:text-[#00E5FF] transition-colors">
                    LinkedIn
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Professional Network
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover/card:text-[#00E5FF] group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 transition-all" />
            </a>

            {/* GitHub */}
            <a
              href={developerProfile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group/card relative rounded-xl p-4 bg-[#08090D]/80 border border-white/10 hover:border-cyan-500/50 hover:bg-[#0D1525] transition-all duration-300 flex items-center justify-between shadow-md hover:shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
              aria-label="View Kai Ross on GitHub"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00E5FF] group-hover/card:bg-gradient-to-r group-hover/card:from-[#00E5FF] group-hover/card:to-[#38BDF8] group-hover/card:text-slate-950 transition-all shadow-sm">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white group-hover/card:text-[#00E5FF] transition-colors">
                    GitHub
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Open Source & Code
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover/card:text-[#00E5FF] group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 transition-all" />
            </a>

            {/* Twitter */}
            <a
              href={developerProfile.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="group/card relative rounded-xl p-4 bg-[#08090D]/80 border border-white/10 hover:border-cyan-500/50 hover:bg-[#0D1525] transition-all duration-300 flex items-center justify-between shadow-md hover:shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
              aria-label="Follow Kai Ross on Twitter / X"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00E5FF] group-hover/card:bg-gradient-to-r group-hover/card:from-[#00E5FF] group-hover/card:to-[#38BDF8] group-hover/card:text-slate-950 transition-all shadow-sm">
                  <Twitter className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white group-hover/card:text-[#00E5FF] transition-colors">
                    Twitter / X
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Dispatches & Thoughts
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover/card:text-[#00E5FF] group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 transition-all" />
            </a>
          </div>
        </section>

        {/* Newsletter Subscription Component */}
        <NewsletterSubscribe />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-white/[0.06]">
          {/* Brand & Closing statement */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-sm">
              <div className="w-6 h-6 rounded bg-[#0D111B] border border-cyan-500/30 flex items-center justify-center text-[#00E5FF]">
                <Terminal className="w-3.5 h-3.5" />
              </div>
              <span className="text-white font-bold">{developerProfile.name}</span>
              <span className="text-slate-600">/</span>
              <span className="text-cyan-400 text-xs">AI LAB</span>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Building intelligent applications, practical software architectures, and modern web experiences.
            </p>
          </div>

          {/* Fast Navigation Links */}
          <nav aria-label="Footer Navigation" className="flex flex-wrap items-center gap-5 sm:gap-6 text-xs font-mono text-slate-400">
            <a href="#hero" className="hover:text-cyan-300 transition-colors">Home</a>
            <a href="#about" className="hover:text-cyan-300 transition-colors">About</a>
            <a href="#projects" className="hover:text-cyan-300 transition-colors">Projects</a>
            <a href="#skills" className="hover:text-cyan-300 transition-colors">Skills</a>
            <a href="#journey" className="hover:text-cyan-300 transition-colors">Journey</a>
            <a href="#vlog" className="hover:text-cyan-300 transition-colors">Vlog</a>
            <a href="#certificates" className="hover:text-cyan-300 transition-colors">Certificates</a>
            <a href="#contact" className="hover:text-cyan-300 transition-colors">Contact</a>
          </nav>

          {/* Quick Socials & Back to Top */}
          <div className="flex items-center gap-2.5">
            <a
              href={developerProfile.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-400 hover:text-[#00E5FF] border border-white/10 hover:border-cyan-500/40 transition-all shadow-sm"
              aria-label="LinkedIn Profile"
              title="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={developerProfile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-400 hover:text-[#00E5FF] border border-white/10 hover:border-cyan-500/40 transition-all shadow-sm"
              aria-label="GitHub Profile"
              title="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={developerProfile.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-400 hover:text-[#00E5FF] border border-white/10 hover:border-cyan-500/40 transition-all shadow-sm"
              aria-label="Twitter / X Profile"
              title="Twitter / X"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${developerProfile.socials.email}`}
              className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-400 hover:text-[#00E5FF] border border-white/10 hover:border-cyan-500/40 transition-all shadow-sm"
              aria-label="Send direct email"
              title="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-cyan-500/10 hover:bg-gradient-to-r hover:from-[#00E5FF] hover:to-[#38BDF8] text-cyan-400 hover:text-slate-950 border border-cyan-500/30 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(0,229,255,0.4)]"
              aria-label="Back to top of page"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Copyright and Zero-Telemetry Note */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div>
            © {currentYear} {developerProfile.name}. Built with React, TypeScript & Tailwind CSS.
          </div>
          <div className="text-[11px] text-slate-400">
            Truthful presentation · Modular architecture · Deployable on Vercel
          </div>
        </div>
      </div>
    </footer>
  );
};
