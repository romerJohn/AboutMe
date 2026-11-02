import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  ExternalLink,
  SlidersHorizontal,
  Info,
  Calendar,
  X,
  ShieldCheck,
  FileBadge,
  Sparkles,
  QrCode
} from 'lucide-react';
import { certificates, certificateCategories, Certificate } from '../data/certificates';
import { ScrollReveal } from './ScrollReveal';
import { createGlowFrameVariants } from '../utils/animations';
import {
  buttonInteractionVariants,
  cardHoverVariants,
  modalEntranceVariants,
  modalBackdropVariants
} from '../utils/motionVariants';


interface CertificateImageFrameProps {
  certificate: Certificate;
}

/**
 * Interactive Certificate Image Component with Framer Motion subtle glow-on-hover frame animation.
 */
export const CertificateImageFrame: React.FC<CertificateImageFrameProps> = ({ certificate }) => {
  const { frameVariants, auraVariants, cornerVariants } = useMemo(
    () => createGlowFrameVariants({ accentColor: certificate.accentColor }),
    [certificate.accentColor]
  );

  return (
    <motion.div
      className="relative rounded-xl overflow-hidden mb-5 bg-gradient-to-br from-[#06080E] via-[#0D1322] to-[#070910] p-4 border cursor-pointer select-none"
      initial="idle"
      whileHover="hovered"
      variants={frameVariants}
      aria-hidden="true"
    >
      {/* Framer Motion Ambient Radial Glow Aura Layer */}
      <motion.div
        className="pointer-events-none absolute -inset-2 rounded-xl"
        variants={auraVariants}
        style={{
          background: `radial-gradient(circle at 50% 50%, ${certificate.accentColor}38, transparent 75%)`,
          filter: 'blur(12px)'
        }}
      />

      {/* Cyber Corner Anchor Accents with spring expansion */}
      <motion.div
        className="pointer-events-none absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2"
        variants={cornerVariants}
      />
      <motion.div
        className="pointer-events-none absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2"
        variants={cornerVariants}
      />
      <motion.div
        className="pointer-events-none absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2"
        variants={cornerVariants}
      />
      <motion.div
        className="pointer-events-none absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2"
        variants={cornerVariants}
      />

      {/* Micro Guilloche / Cyber Grid Backdrop */}
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />

      {/* Visual Content of the Certificate Image */}
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-lg bg-black/70 border border-white/10 flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-inner"
            style={{ color: certificate.accentColor }}
          >
            {certificate.issuerBadge}
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Official Verification</span>
            </div>
            <div className="font-mono text-xs font-semibold text-white tracking-tight truncate max-w-[190px]">
              {certificate.credentialId}
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span
            className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono border"
            style={{
              borderColor: `${certificate.accentColor}44`,
              color: certificate.accentColor,
              backgroundColor: `${certificate.accentColor}15`
            }}
          >
            {certificate.grade || 'Certified'}
          </span>
          <div className="text-[10px] font-mono text-slate-400 mt-1">
            {certificate.hours || certificate.issueDate}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Certificates: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);

  const filteredCertificates = useMemo(() => {
    if (selectedCategory === 'All') return certificates;
    return certificates.filter((c) => c.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <section id="certificates" className="py-24 relative" aria-label="Verified Certificates and Accreditations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#00E5FF] mb-3">
            <Award className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>Accreditation & Professional Credentials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            Certifications & Verified Credentials
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Formal specializations, cloud architecture validations, and machine learning
            certifications earned through rigorous assessments and hands-on projects.
          </p>
        </ScrollReveal>

        {/* Clear Placeholder/Sample Status Disclosure Banner */}
        <ScrollReveal delay={0.05} className="mb-8">
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-start sm:items-center gap-3 text-xs text-cyan-200 font-mono">
            <Info className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5 sm:mt-0" />
            <div className="flex-1 leading-relaxed">
              <strong className="text-white">Sample Verification Portfolio:</strong> The entries below
              showcase sample credential IDs and verification pathways. Actual personal certificate links
              and records can be modified in{' '}
              <code className="text-[#00E5FF] bg-black/40 px-1.5 py-0.5 rounded">src/data/certificates.ts</code>.
            </div>
          </div>
        </ScrollReveal>

        {/* Category Controls */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-white/[0.08]">
          <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Category:</span>
          </span>
          {certificateCategories.map((cat) => {
            const isActive = selectedCategory === cat;
            const count =
              cat === 'All'
                ? certificates.length
                : certificates.filter((c) => c.category === cat).length;
            return (
              <motion.button
                key={cat}
                type="button"
                variants={buttonInteractionVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors duration-200 cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-[#00E5FF] border border-cyan-500/40 font-semibold shadow-[0_0_15px_-4px_rgba(0,229,255,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-sans tabular-nums ${
                    isActive ? 'bg-cyan-500/20 text-cyan-200' : 'bg-white/5 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((cert, idx) => (
            <ScrollReveal
              key={cert.id}
              delay={idx * 0.08}
              className="h-full flex flex-col"
            >
              <motion.div
                variants={cardHoverVariants}
                initial="idle"
                whileHover="hover"
                onClick={() => setActiveCertificate(cert)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveCertificate(cert);
                  }
                }}
                className="group relative rounded-2xl bg-[#0D111B]/90 border border-white/[0.08] hover:border-cyan-500/40 p-6 flex flex-col justify-between transition-colors duration-200 shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] h-full"
                aria-label={`View Certificate: ${cert.title}`}
              >

                {/* Subtle top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${cert.accentColor}, transparent)`
                  }}
                  aria-hidden="true"
                />

                <div>
                  {/* Subtle 'Glow-on-Hover' Certificate Image Frame (Framer Motion) */}
                  <CertificateImageFrame certificate={cert} />

                  {/* Issuer badge & Date Lockup */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white block">
                        {cert.issuer}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {cert.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                      <Calendar className="w-3 h-3 text-cyan-400" />
                      <span>{cert.issueDate}</span>
                    </div>
                  </div>

                  {/* Certificate Title */}
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {cert.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {cert.summary}
                  </p>

                  {/* Skills Tagged */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {cert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 text-[10px] font-mono rounded bg-white/[0.04] text-cyan-200 border border-white/[0.06]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Credential Details & Verification link */}
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Verified Credential</span>
                  </div>
                  <div className="inline-flex items-center gap-1 text-[#00E5FF] group-hover:underline text-[11px]">
                    <span>Inspect Plaque</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Certificate Modal Dialog */}
      <AnimatePresence>
        {activeCertificate && (
          <motion.div
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby="certificate-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
            onClick={() => setActiveCertificate(null)}
          >
            <motion.div
              variants={modalEntranceVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-[#0D111B] rounded-2xl border border-cyan-500/40 shadow-2xl p-6 sm:p-8 flex flex-col max-h-[90vh] overflow-y-auto"
            >

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileBadge className="w-5 h-5 text-[#00E5FF]" />
                <span className="font-mono text-xs text-[#00E5FF] uppercase tracking-wider">
                  Verified Engineering Credential
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveCertificate(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
                aria-label="Close certificate preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High-Resolution Certificate Simulation Plaque with Glow-on-Hover Frame */}
            <motion.div
              className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-[#08090D] via-[#0E1524] to-[#08090D] border-2 border-cyan-500/30 relative overflow-hidden shadow-inner mb-6 transition-all duration-300 hover:shadow-[0_0_35px_rgba(0,229,255,0.25)] hover:border-cyan-400/60"
              whileHover={{ scale: 1.01 }}
            >
              {/* Corner Cyber Accents */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#00E5FF]" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#00E5FF]" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#00E5FF]" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#00E5FF]" />

              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
                  <span>Official Certificate of Competency</span>
                </div>

                <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                  This document certifies that
                </div>

                <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Kai Ross
                </div>

                <div className="text-xs text-slate-400">
                  has successfully completed all requirements and rigorous evaluations for
                </div>

                <h3 id="certificate-modal-title" className="text-xl sm:text-2xl font-bold text-[#00E5FF]">
                  {activeCertificate.title}
                </h3>

                <div className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                  Issued by <strong className="text-white">{activeCertificate.issuer}</strong> in recognition of technical proficiency in {activeCertificate.skills.join(', ')}.
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-3">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase">Issue Date</span>
                    <span className="text-white">{activeCertificate.issueDate}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase">Credential ID</span>
                    <span className="text-cyan-300">{activeCertificate.credentialId}</span>
                  </div>
                  {activeCertificate.grade && (
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase">Evaluation</span>
                      <span className="text-emerald-400">{activeCertificate.grade}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Verification Link Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs font-mono text-slate-400">
                <span>Verification Authority: </span>
                <span className="text-white">{activeCertificate.issuer}</span>
              </div>
              <a
                href={activeCertificate.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-slate-950 font-semibold text-xs font-mono uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all cursor-pointer"
              >
                <span>Verify Credential Online</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    </section>
  );
};
