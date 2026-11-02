import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, Sparkles, X, ChevronRight, HelpCircle } from 'lucide-react';
import {
  modalBackdropVariants,
  modalEntranceVariants,
  buttonInteractionVariants
} from '../utils/motionVariants';

interface VoiceControlProps {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  feedback: string | null;
  onToggleListening: () => void;
  onSimulateCommand: (command: string) => void;
}

export const VoiceControl: React.FC<VoiceControlProps> = ({
  isListening,
  isSupported,
  transcript,
  feedback,
  onToggleListening,
  onSimulateCommand
}) => {
  const [showHelp, setShowHelp] = useState(false);

  const sampleCommands = [
    { label: 'Show AI projects', description: 'Filters to intelligent AI systems' },
    { label: 'Show Web projects', description: 'Filters to frontend and web applications' },
    { label: 'Show Systems projects', description: 'Filters to backend & low-level prototypes' },
    { label: 'Show Saved projects', description: 'Displays your bookmarked projects' },
    { label: 'Show all projects', description: 'Resets project filters' },
    { label: 'Scroll to contact', description: 'Smoothly scrolls to the contact section' },
    { label: 'Download resume', description: 'Opens and downloads Curriculum Vitae PDF' },
    { label: 'Scroll to skills', description: 'Navigates to technical architecture skills' },
    { label: 'Scroll to about', description: 'Navigates to bio and background' },
    { label: 'Scroll to top', description: 'Returns to the hero header' }
  ];

  return (
    <>
      {/* Floating Cyber Voice Controller (Positioned safely at Bottom-Right to avoid overlapping editorial content) */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2">
        {/* Dynamic Voice Feedback Toast / Transcript HUD */}
        {(isListening || feedback) && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0D111B]/95 border border-cyan-500/40 backdrop-blur-md shadow-[0_0_20px_rgba(0,229,255,0.25)] text-xs font-mono text-cyan-200 animate-in fade-in slide-in-from-bottom-2 duration-200 max-w-xs sm:max-w-md">
            {isListening ? (
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            )}
            <div className="truncate">
              {feedback || (
                <span>
                  Listening... <span className="text-slate-400">{transcript ? `"${transcript}"` : 'Speak a command'}</span>
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Main Microphone Button */}
          <motion.button
            type="button"
            variants={buttonInteractionVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            onClick={onToggleListening}
            className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-mono text-xs transition-colors duration-200 backdrop-blur-md shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] cursor-pointer ${
              isListening
                ? 'bg-cyan-500/20 text-[#00E5FF] border-2 border-cyan-400 shadow-[0_0_25px_rgba(0,229,255,0.4)] animate-pulse'
                : 'bg-[#0D111B]/90 hover:bg-[#141B2D] text-slate-200 border border-white/15 hover:border-cyan-500/40'
            }`}
            aria-label={isListening ? 'Stop voice listening' : 'Start voice navigation (Press V)'}
            aria-pressed={isListening}
            title="Toggle Voice Navigation (Press 'V')"
          >
            <div className="relative">
              {isListening ? (
                <>
                  <span className="absolute -inset-1 rounded-full bg-cyan-400/30 animate-ping" />
                  <Mic className="w-4 h-4 text-[#00E5FF] relative z-10" />
                </>
              ) : (
                <Mic className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              )}
            </div>
            <span className="font-semibold tracking-wide">
              {isListening ? 'Listening...' : 'Voice Nav'}
            </span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-slate-400 border border-white/10">
              V
            </kbd>
          </motion.button>

          {/* Help / Commands Info Button */}
          <motion.button
            type="button"
            variants={buttonInteractionVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            onClick={() => setShowHelp(!showHelp)}
            className="p-2.5 rounded-xl bg-[#0D111B]/90 hover:bg-[#141B2D] text-slate-400 hover:text-white border border-white/15 hover:border-cyan-500/40 transition-colors backdrop-blur-md shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] cursor-pointer"
            aria-label="View voice navigation commands"
            title="Voice Commands Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Voice Commands Cheat Sheet Modal / Popover */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              variants={modalEntranceVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-lg rounded-2xl bg-[#0D111B] border border-cyan-500/30 p-6 shadow-2xl text-slate-100 font-sans"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="voice-help-title"
            >

            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-[#00E5FF]" />
                <h3 id="voice-help-title" className="text-base font-bold text-white">
                  Voice Navigation Commands
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close voice commands modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 font-mono mb-4 leading-relaxed">
              Powered by the Web Speech API. Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-300">V</kbd> or click the mic button to speak, or click any command below to test:
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {sampleCommands.map((cmd) => (
                <button
                  key={cmd.label}
                  type="button"
                  onClick={() => {
                    onSimulateCommand(cmd.label);
                    setShowHelp(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-cyan-500/40 transition-all text-left group cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-mono font-semibold text-cyan-300 group-hover:text-[#00E5FF] flex items-center gap-1.5">
                      <span>"{cmd.label}"</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {cmd.description}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0" />
                </button>
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Status: {isSupported ? 'Web Speech API Active' : 'API Fallback Mode'}</span>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="text-cyan-400 hover:underline"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    </>
  );
};



