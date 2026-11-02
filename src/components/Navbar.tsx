import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Terminal, ArrowUpRight, Sun, Moon, Download } from 'lucide-react';
import { developerProfile } from '../data/profile';
import { Theme } from '../utils/theme';
import {
  buttonInteractionVariants,
  navIndicatorSpring
} from '../utils/motionVariants';
import { CyberTooltip } from './ui';


interface NavbarProps {
  onNavigate?: (sectionId: string) => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, theme, onToggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = [
        'hero',
        'about',
        'projects',
        'skills',
        'journey',
        'vlog',
        'certificates',
        'contact'
      ];
      const scrollPosition = window.scrollY + 160;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Exact navigation order requested:
  // Home, About, Projects, Skills, Journey, Vlog, Certificates, Contact
  const navItems = [
    { label: 'Home', href: '#hero', id: 'hero' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Journey', href: '#journey', id: 'journey' },
    { label: 'Vlog', href: '#vlog', id: 'vlog' },
    { label: 'Certificates', href: '#certificates', id: 'certificates' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
    }
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#08090D]/85 backdrop-blur-md border-b border-white/[0.08] shadow-lg shadow-black/40 py-3.5'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          {/* Zone 1: Brand title, one line */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero', 'hero')}
            className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-white whitespace-nowrap shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] rounded-md px-1"
            aria-label="Kai Ross - Home"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0D111B] border border-cyan-500/30 flex items-center justify-center text-[#00E5FF] group-hover:border-[#00E5FF] transition-colors shadow-[0_0_15px_-3px_rgba(0,229,255,0.2)]">
              <Terminal className="w-4 h-4 text-[#00E5FF]" />
            </div>
            <div className="flex items-center gap-1.5 font-mono text-sm">
              <span className="text-white font-semibold">{developerProfile.name}</span>
              <span className="text-slate-500">/</span>
              <span className="text-[#00E5FF] text-xs">AI LAB</span>
            </div>
          </a>

          {/* Zone 2: 8 clean, single-line text navigation links in exact order */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs xl:text-sm font-medium text-slate-400"
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.id)}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 hover:text-white focus:outline-none focus-visible:text-[#00E5FF] ${
                    isActive ? 'text-[#00E5FF] font-semibold' : 'text-slate-300'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="navbar-active-indicator"
                      transition={navIndicatorSpring}
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00E5FF] via-[#38BDF8] to-[#8B5CF6] rounded-full shadow-[0_0_8px_rgba(0,229,255,0.7)]"
                      aria-hidden="true"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Theme Toggle & Primary Action */}
          <div className="hidden lg:flex items-center gap-2.5 xl:gap-3 shrink-0">
            {/* High-Contrast Theme Toggle */}
            <CyberTooltip content={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'} position="bottom">
              <motion.button
                type="button"
                variants={buttonInteractionVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                onClick={onToggleTheme}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] cursor-pointer"
                aria-label={theme === 'dark' ? 'Switch to high-contrast light mode' : 'Switch to dark cyber mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-4 h-4 text-cyan-600 hover:-rotate-12 transition-transform" />
                )}
              </motion.button>
            </CyberTooltip>

            {/* Glassmorphic Resume Download Action */}
            <CyberTooltip content="Download Verified Curriculum Vitae (PDF)" position="bottom">
              <motion.a
                variants={buttonInteractionVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                href="/resume.pdf"
                download="Kai_Ross_Resume.pdf"
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 hover:border-cyan-500/40 text-xs font-mono transition-all backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] shadow-sm cursor-pointer"
                aria-label="Download Kai Ross Resume PDF"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Resume</span>
              </motion.a>
            </CyberTooltip>


            <motion.a
              variants={buttonInteractionVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact', 'contact')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold tracking-wider uppercase text-slate-900 bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] rounded-lg hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] whitespace-nowrap shrink-0"
            >
              Let's Talk
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-950" />
            </motion.a>
          </div>

          {/* Mobile/Tablet controls (Theme Toggle + Hamburger) */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-2 text-slate-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] rounded-lg border border-white/10"
              aria-label={theme === 'dark' ? 'Switch to high-contrast light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-600" />}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] rounded-lg border border-white/10"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="lg:hidden overflow-hidden border-b border-white/10 bg-[#08090D]/95 backdrop-blur-xl px-4 pt-4 pb-6 space-y-3"
          >
            <nav aria-label="Mobile Navigation" className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.id)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'bg-cyan-500/10 text-[#00E5FF] border border-cyan-500/20 font-semibold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href="/resume.pdf"
                download="Kai_Ross_Resume.pdf"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-mono text-cyan-300 bg-white/[0.04] hover:bg-white/[0.08] border border-cyan-500/30 rounded-lg backdrop-blur-md"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Download Resume (PDF)</span>
              </a>
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact', 'contact')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wider uppercase text-slate-950 bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] rounded-lg shadow-md"
              >
                Let's Talk
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

