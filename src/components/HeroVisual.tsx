import React, { useEffect, useRef, useState } from 'react';
import { Cpu, Activity, Sparkles, RefreshCw } from 'lucide-react';

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  layer: number;
  pulsePhase: number;
}

interface SignalPulse {
  startNode: number;
  endNode: number;
  progress: number;
  speed: number;
  color: string;
}

export const HeroVisual: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeMode, setActiveMode] = useState<'synapse' | 'matrix' | 'pipeline'>('synapse');
  const [cycleCount, setCycleCount] = useState(1);
  const mousePos = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const isHovered = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 460);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      initNodes();
    };

    window.addEventListener('resize', handleResize);

    // Create layered nodes representing neural architecture
    let nodes: NodePoint[] = [];
    let pulses: SignalPulse[] = [];

    const initNodes = () => {
      nodes = [];
      pulses = [];

      const layerCount = 4;
      const nodesPerLayer = [4, 6, 5, 3];
      const layerSpacing = width / (layerCount + 1);

      for (let l = 0; l < layerCount; l++) {
        const count = nodesPerLayer[l];
        const layerX = layerSpacing * (l + 1);
        const ySpacing = height / (count + 1);

        for (let i = 0; i < count; i++) {
          const y = ySpacing * (i + 1) + (Math.random() * 20 - 10);
          const isCyan = Math.random() > 0.45;
          nodes.push({
            x: layerX + (Math.random() * 16 - 8),
            y,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            radius: l === 0 || l === layerCount - 1 ? 3.5 : 4.5,
            color: isCyan ? '#00E5FF' : '#8B5CF6',
            layer: l,
            pulsePhase: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    initNodes();

    let lastPulseTime = 0;

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // Spawn signal pulses across layers periodically
      if (time - lastPulseTime > 380 && nodes.length > 5) {
        lastPulseTime = time;
        const sourceIndex = Math.floor(Math.random() * (nodes.length - 4));
        const targetCandidates = nodes
          .map((n, idx) => ({ idx, layer: n.layer }))
          .filter((item) => item.layer === nodes[sourceIndex].layer + 1);

        if (targetCandidates.length > 0) {
          const target = targetCandidates[Math.floor(Math.random() * targetCandidates.length)];
          pulses.push({
            startNode: sourceIndex,
            endNode: target.idx,
            progress: 0,
            speed: 0.025 + Math.random() * 0.02,
            color: Math.random() > 0.4 ? '#00E5FF' : '#A78BFA',
          });
        }
      }

      // Draw connection lines between adjacent layers
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeA = nodes[i];
          const nodeB = nodes[j];

          // Only connect nodes in adjacent layers or within close distance
          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (nodeB.layer === nodeA.layer + 1 && dist < 170) {
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;
            ctx.stroke();
          } else if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Update and draw signal pulses
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) {
          pulses.splice(p, 1);
          continue;
        }

        const nA = nodes[pulse.startNode];
        const nB = nodes[pulse.endNode];
        if (!nA || !nB) continue;

        const px = nA.x + (nB.x - nA.x) * pulse.progress;
        const py = nA.y + (nB.y - nA.y) * pulse.progress;

        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = pulse.color;
        ctx.shadowColor = pulse.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Slight drift
        node.x += node.vx;
        node.y += node.vy;

        // Bounce from boundaries
        if (node.x < 20 || node.x > width - 20) node.vx *= -1;
        if (node.y < 20 || node.y > height - 20) node.vy *= -1;

        // Gentle mouse interaction
        if (isHovered.current) {
          const mdx = node.x - mousePos.current.x;
          const mdy = node.y - mousePos.current.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 90) {
            const force = (90 - mdist) / 90;
            node.x += (mdx / mdist) * force * 1.5;
            node.y += (mdy / mdist) * force * 1.5;
          }
        }

        // Draw node glow & point
        node.pulsePhase += 0.03;
        const pulseRadius = node.radius + Math.sin(node.pulsePhase) * 1.2;

        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Inner core
        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeMode, cycleCount]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    isHovered.current = true;
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
  };

  const handleCycleSimulation = () => {
    setCycleCount((c) => c + 1);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[460px] sm:h-[480px] rounded-2xl bg-gradient-to-br from-[#0D111B]/90 via-[#0A0D15]/80 to-[#08090D] border border-cyan-500/20 shadow-[0_0_50px_-15px_rgba(0,229,255,0.15)] overflow-hidden flex flex-col justify-between p-5"
    >
      {/* Top HUD Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/[0.08] pb-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
          <span className="font-mono text-slate-300 font-semibold tracking-wider text-[11px]">
            AI DIGITAL WORKSPACE
          </span>
          <span className="text-slate-600">·</span>
          <span className="font-mono text-slate-400 text-[11px]">NEURAL SYNAPSE GRAPH</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCycleSimulation}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10 text-[11px] font-mono"
            aria-label="Re-seed neural network nodes"
            title="Randomize nodes"
          >
            <RefreshCw className="w-3 h-3 text-[#00E5FF]" />
            <span>Re-seed</span>
          </button>
        </div>
      </div>

      {/* Main interactive Canvas */}
      <div className="relative flex-1 w-full my-2">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair"
          title="Interactive neural network graph - move cursor to influence nodes"
        />

        {/* Floating Holographic Info Card 1 (Top Left) */}
        <div className="absolute top-4 left-4 z-10 bg-[#08090D]/80 backdrop-blur-md border border-cyan-500/20 rounded-xl p-3 shadow-lg pointer-events-none max-w-[210px]">
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-300 font-semibold">
              Inference Engine
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Topology: 4-Layer Feedforward with Sparse Attention Heads
          </p>
          <div className="mt-2 pt-2 border-t border-white/[0.06] flex items-center justify-between font-mono text-[10px]">
            <span className="text-slate-400">Latent Dims</span>
            <span className="text-[#00E5FF] font-medium">1024-D Vector</span>
          </div>
        </div>

        {/* Floating Holographic Info Card 2 (Bottom Right) */}
        <div className="absolute bottom-4 right-4 z-10 bg-[#08090D]/80 backdrop-blur-md border border-violet-500/20 rounded-xl p-3 shadow-lg pointer-events-none max-w-[220px]">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-300 font-semibold">
              Live Architecture
            </span>
          </div>
          <div className="space-y-1 font-mono text-[10px]">
            <div className="flex justify-between text-slate-400">
              <span>Token Throughput:</span>
              <span className="text-white">Active Stream</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Guardrail Rules:</span>
              <span className="text-emerald-400 font-medium">Deterministic</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom status and interactive mode switcher */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.08] text-[11px]">
        <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-lg border border-white/10">
          <button
            type="button"
            onClick={() => setActiveMode('synapse')}
            className={`px-2.5 py-1 rounded font-mono transition-colors ${
              activeMode === 'synapse'
                ? 'bg-[#00E5FF]/20 text-[#00E5FF] font-semibold border border-[#00E5FF]/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Synapse View
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('matrix')}
            className={`px-2.5 py-1 rounded font-mono transition-colors ${
              activeMode === 'matrix'
                ? 'bg-[#8B5CF6]/20 text-[#A78BFA] font-semibold border border-[#8B5CF6]/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Weight Matrix
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('pipeline')}
            className={`px-2.5 py-1 rounded font-mono transition-colors ${
              activeMode === 'pipeline'
                ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Data Pipeline
          </button>
        </div>

        <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span>Interactive Canvas · Move Cursor</span>
        </div>
      </div>
    </div>
  );
};
