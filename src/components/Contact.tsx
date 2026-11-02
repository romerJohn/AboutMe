import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Send, CheckCircle2, AlertCircle, Copy, ExternalLink, Sparkles } from 'lucide-react';
import { developerProfile } from '../data/profile';
import { ContactFormData, validateContactForm, generateMailtoUrl } from '../utils/validation';
import { ScrollReveal } from './ScrollReveal';
import { buttonInteractionVariants } from '../utils/motionVariants';
import { useToast, CyberButton } from './ui';

export const Contact: React.FC = () => {
  const toast = useToast();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateContactForm(formData);

    if (!result.isValid) {
      setErrors(result.errors);
      toast.error('Validation Alert', 'Please complete all required fields.');
      return;
    }

    setErrors({});
    setIsSubmitted(true);
    toast.success('Inquiry Prepared', 'Ready to launch your email client.');
  };

  const handleLaunchMailto = () => {
    const mailto = generateMailtoUrl(developerProfile.socials.email, formData);
    window.location.href = mailto;
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(developerProfile.socials.email);
    setCopiedEmail(true);
    toast.info('Email Copied', 'contact@kaiross.dev copied to clipboard');
    setTimeout(() => setCopiedEmail(false), 2500);
  };


  return (
    <section id="contact" className="py-24 relative" aria-label="Contact Information & Inquiry">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Inquiries & Contact Channels with Scroll Reveal */}
          <ScrollReveal className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#00E5FF] mb-3">
                <Mail className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>Start a Conversation</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
                Have an Idea? Let's Build Something Intelligent.
              </h2>
              <p className="text-base text-slate-300 leading-relaxed">
                Whether you want to discuss AI integration workflows, full-stack architecture,
                collaborative experiments, or technical ideas, I'd welcome hearing from you.
              </p>
            </div>

            {/* Direct Contact Links */}
            <div className="space-y-4 pt-2">
              {/* Email Card with Copy button */}
              <div className="p-4 rounded-xl bg-[#0D111B] border border-white/10 flex items-center justify-between gap-3 group hover:border-cyan-500/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-[#00E5FF]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 block uppercase">
                      Direct Email
                    </span>
                    <a
                      href={`mailto:${developerProfile.socials.email}`}
                      className="text-sm font-semibold text-white hover:text-[#00E5FF] transition-colors"
                    >
                      {developerProfile.socials.email}
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 border border-white/5"
                  aria-label="Copy email address to clipboard"
                >
                  {copiedEmail ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* GitHub Card */}
              <a
                href={developerProfile.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-[#0D111B] border border-white/10 flex items-center justify-between group hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-200">
                    <Github className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 block uppercase">
                      Code Repositories
                    </span>
                    <span className="text-sm font-semibold text-white group-hover:text-[#00E5FF] transition-colors">
                      github.com/developer
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              </a>

              {/* LinkedIn Card */}
              {developerProfile.socials.linkedin && (
                <a
                  href={developerProfile.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-[#0D111B] border border-white/10 flex items-center justify-between group hover:border-cyan-500/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <Linkedin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono text-slate-400 block uppercase">
                        Professional Network
                      </span>
                      <span className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                        linkedin.com/in/developer
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </a>
              )}
            </div>

            {/* Note on configuration */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] text-xs text-slate-300 space-y-1 font-mono">
              <span className="text-cyan-400 font-semibold block">Configurable Contact Info:</span>
              <p>
                All profiles and email targets can be personalized directly in{' '}
                <code className="text-slate-200">src/data/profile.ts</code>.
              </p>
            </div>
          </ScrollReveal>

          {/* Right Column: Interactive Contact Form with Scroll Reveal */}
          <ScrollReveal delay={0.15} className="lg:col-span-7 bg-[#0D111B] rounded-2xl border border-white/[0.08] p-6 sm:p-8 shadow-xl">
            {isSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white">Inquiry Draft Prepared!</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{formData.name}</strong>. Because
                  external email gateways require your personalized credentials (e.g. Formspree /
                  Resend API key), click below to instantly send this message via your default
                  email client.
                </p>

                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleLaunchMailto}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-slate-950 font-semibold text-xs tracking-wider uppercase shadow-lg hover:shadow-cyan-500/30 transition-all cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Launch Email Client Now</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', subject: '', message: '' });
                    }}
                    className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="border-b border-white/[0.08] pb-4 mb-2">
                  <h3 className="text-lg font-bold text-white mb-1">Send a Direct Message</h3>
                  <p className="text-xs text-slate-400">
                    Fill out the fields below. Client validation ensures clean data formatting.
                  </p>
                </div>

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2"
                    >
                      Your Name <span className="text-[#00E5FF]">*</span>
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Maya Lin"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      className={`w-full px-4 py-3 rounded-xl bg-[#08090D] border text-white text-sm focus:outline-none transition-colors ${
                        errors.name
                          ? 'border-rose-500 focus:border-rose-500'
                          : 'border-white/10 focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500'
                      }`}
                    />
                    {errors.name && (
                      <p id="name-error" className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2"
                    >
                      Your Email <span className="text-[#00E5FF]">*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@organization.com"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      className={`w-full px-4 py-3 rounded-xl bg-[#08090D] border text-white text-sm focus:outline-none transition-colors ${
                        errors.email
                          ? 'border-rose-500 focus:border-rose-500'
                          : 'border-white/10 focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500'
                      }`}
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2"
                  >
                    Subject / Topic <span className="text-[#00E5FF]">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. IntraVision AI Collaboration or Technical Question"
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? 'subject-error' : undefined}
                    className={`w-full px-4 py-3 rounded-xl bg-[#08090D] border text-white text-sm focus:outline-none transition-colors ${
                      errors.subject
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-white/10 focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500'
                    }`}
                  />
                  {errors.subject && (
                    <p id="subject-error" className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.subject}</span>
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2"
                  >
                    Message Details <span className="text-[#00E5FF]">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Share background, questions, or ideas you'd like to explore..."
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    className={`w-full px-4 py-3 rounded-xl bg-[#08090D] border text-white text-sm focus:outline-none transition-colors resize-y ${
                      errors.message
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-white/10 focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500'
                    }`}
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                {/* Submit Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <CyberButton
                    type="submit"
                    variant="primary"
                    rightIcon={<Send className="w-3.5 h-3.5" />}
                  >
                    Submit Inquiry
                  </CyberButton>

                  <button
                    type="button"
                    onClick={handleLaunchMailto}
                    className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Quick Send via Email App (Mailto)</span>
                  </button>
                </div>


              </form>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
