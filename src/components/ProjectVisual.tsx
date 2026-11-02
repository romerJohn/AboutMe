import React from 'react';
import { Trophy, ShieldAlert, Sparkles, Activity, Cpu } from 'lucide-react';

interface ProjectVisualProps {
  type: 'intravision' | 'tradepilot' | 'laboratory';
  title: string;
}

export const ProjectVisual: React.FC<ProjectVisualProps> = ({ type, title }) => {
  if (type === 'intravision') {
    return (
      <div className="relative w-full h-48 bg-[#090D16] rounded-xl overflow-hidden border border-cyan-500/20 p-3.5 flex flex-col justify-between font-mono text-[11px] select-none">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-[10px]">
          <div className="flex items-center gap-1.5 text-cyan-300">
            <Trophy className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="font-semibold">INTRAMURAL SCORING ENGINE</span>
          </div>
          <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
            COURT 2 LIVE
          </span>
        </div>

        {/* Live Match Bracket / Score Preview */}
        <div className="grid grid-cols-2 gap-2 my-auto">
          <div className="bg-[#0D1424] p-2.5 rounded-lg border border-cyan-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block">ALPHA SQUAD</span>
              <span className="text-white font-bold text-xs">Vortex Blue</span>
            </div>
            <span className="text-base font-bold text-[#00E5FF] font-mono tabular-nums">74</span>
          </div>
          <div className="bg-[#0D1424] p-2.5 rounded-lg border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block">BETA SQUAD</span>
              <span className="text-white font-bold text-xs">Apex Red</span>
            </div>
            <span className="text-base font-bold text-slate-300 font-mono tabular-nums">68</span>
          </div>
        </div>

        {/* Gemini Rule Verification Callout */}
        <div className="bg-[#06080E]/90 p-2 rounded border border-cyan-500/20 flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
          <div className="truncate text-[10px] text-slate-300">
            <span className="text-[#00E5FF] font-semibold">Gemini Rule Assistant:</span> Roster
            eligibility confirmed for Finals
          </div>
        </div>
      </div>
    );
  }

  if (type === 'tradepilot') {
    return (
      <div className="relative w-full h-48 bg-[#0C0B18] rounded-xl overflow-hidden border border-violet-500/20 p-3.5 flex flex-col justify-between font-mono text-[11px] select-none">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-[10px]">
          <div className="flex items-center gap-1.5 text-violet-300">
            <Activity className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span className="font-semibold">RISK CO-PILOT ANALYSIS</span>
          </div>
          <span className="text-violet-300 bg-violet-950/60 px-2 py-0.5 rounded border border-violet-500/30">
            1H / 4H SYNCED
          </span>
        </div>

        {/* Dynamic Metric Gauges */}
        <div className="grid grid-cols-3 gap-2 my-auto">
          <div className="bg-[#131126] p-2 rounded-lg border border-white/10 text-center">
            <span className="text-[9px] text-slate-400 block">MAX DRAWDOWN</span>
            <span className="text-xs font-bold text-emerald-400 font-mono tabular-nums">&lt; 1.5%</span>
          </div>
          <div className="bg-[#131126] p-2 rounded-lg border border-violet-500/30 text-center">
            <span className="text-[9px] text-slate-400 block">RISK RATIO</span>
            <span className="text-xs font-bold text-[#A78BFA] font-mono tabular-nums">1 : 2.8</span>
          </div>
          <div className="bg-[#131126] p-2 rounded-lg border border-white/10 text-center">
            <span className="text-[9px] text-slate-400 block">DISCIPLINE</span>
            <span className="text-xs font-bold text-white font-mono tabular-nums">98% CHECK</span>
          </div>
        </div>

        {/* Protection Sentinel Callout */}
        <div className="bg-[#07060F]/90 p-2 rounded border border-violet-500/20 flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0" />
          <div className="truncate text-[10px] text-slate-300">
            <span className="text-[#A78BFA] font-semibold">Guardrail Active:</span> Position size capped by equity rule
          </div>
        </div>
      </div>
    );
  }

  // Developer Laboratory
  return (
    <div className="relative w-full h-48 bg-[#070D14] rounded-xl overflow-hidden border border-sky-500/20 p-3.5 flex flex-col justify-between font-mono text-[11px] select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-[10px]">
        <div className="flex items-center gap-1.5 text-sky-300">
          <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span className="font-semibold">PROTOTYPE EXPERIMENTS</span>
        </div>
        <span className="text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-500/30">
          SANDBOX ACTIVE
        </span>
      </div>

      {/* Interactive Micro Simulation Graphics */}
      <div className="grid grid-cols-2 gap-2 my-auto">
        <div className="bg-[#0B1724] p-2.5 rounded-lg border border-sky-500/20 space-y-1">
          <span className="text-[10px] text-slate-400 block">CANVAS PARTICLES</span>
          <div className="h-4 flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <div className="w-3 h-1 bg-cyan-500/40 rounded-full" />
            <div className="w-2 h-2 rounded-full bg-sky-400" />
            <div className="w-4 h-1 bg-sky-500/30 rounded-full" />
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          </div>
        </div>
        <div className="bg-[#0B1724] p-2.5 rounded-lg border border-white/10 space-y-1">
          <span className="text-[10px] text-slate-400 block">STATE MACHINE</span>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Deterministic Valid</span>
          </div>
        </div>
      </div>

      {/* Laboratory Pipeline Note */}
      <div className="bg-[#04080D]/90 p-2 rounded border border-sky-500/20 flex items-center gap-2">
        <span className="text-[10px] text-sky-400 font-semibold">Test Suite:</span>
        <span className="truncate text-[10px] text-slate-300">
          7/7 Unit Tests Passing (0ms latency)
        </span>
      </div>
    </div>
  );
};
