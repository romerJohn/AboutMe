import React, { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { validateNewsletterEmail } from '../utils/validation';

const STORAGE_KEY = 'kai_ross_newsletter_subscribed_email';

export const NewsletterSubscribe: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState<string>('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSubscribedEmail(saved);
        setIsSuccess(true);
      }
    } catch {
      // Ignore localStorage availability issues
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateNewsletterEmail(email);

    if (!validation.isValid) {
      setError(validation.error || 'Please enter a valid email address.');
      return;
    }

    setError(null);
    const trimmed = email.trim();
    setSubscribedEmail(trimmed);
    setIsSuccess(true);

    try {
      localStorage.setItem(STORAGE_KEY, trimmed);
    } catch {
      // Graceful fallback
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setEmail('');
    setError(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Graceful fallback
    }
  };

  return (
    <div
      className="rounded-2xl bg-[#0D111B]/80 border border-white/10 hover:border-cyan-500/40 p-6 sm:p-7 backdrop-blur-xl relative overflow-hidden transition-all duration-300 shadow-xl group my-8"
      aria-label="Newsletter Subscription"
    >
      {/* Subtle top cyan ambient glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-300"
        aria-hidden="true"
      />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        {/* Informational Column */}
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00E5FF] tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>Engineering Dispatches & Lab Notes</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Stay in the Loop on AI & Systems Architecture
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            Periodic technical post-mortems, applied machine learning experiments, and open-source project releases. Zero marketing spam.
          </p>
        </div>

        {/* Form or Success State Column */}
        <div className="w-full lg:w-auto lg:min-w-[380px]">
          {isSuccess ? (
            <div
              className="flex items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
              role="status"
              aria-live="polite"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-xs font-mono">
                  <div className="font-semibold text-emerald-200">Subscription Confirmed!</div>
                  <div className="text-emerald-400/90 text-[11px] truncate max-w-[220px]">
                    {subscribedEmail || 'Welcome aboard.'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] font-mono text-emerald-400 hover:text-emerald-200 underline shrink-0 cursor-pointer"
                aria-label="Change subscribed email"
              >
                Change
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="developer@domain.com"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500 transition-colors"
                    aria-label="Email address for engineering newsletter"
                    aria-invalid={!!error}
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-slate-950 font-semibold text-xs font-mono uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] cursor-pointer shrink-0"
                >
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5 text-slate-950" />
                </button>
              </div>

              {error && (
                <div
                  className="flex items-center gap-1.5 text-xs text-rose-400 font-mono pt-1"
                  role="alert"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
