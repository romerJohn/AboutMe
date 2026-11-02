import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Cpu, Activity, Sparkles, RefreshCw, Box } from 'lucide-react';
import { HeroVisual } from './HeroVisual';
import { isWebGLAvailable } from '../utils/webglSupport';
import { checkPrefersReducedMotion } from '../utils/motionVariants';

export const Hero3DVisual: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Fallback state if WebGL is unsupported or initialization throws
  const [useFallback, setUseFallback] = useState<boolean>(() => !isWebGLAvailable());
  const [activeMode, setActiveMode] = useState<'core' | 'synapse' | 'gimbal'>('core');
  const activeModeRef = useRef(activeMode);
  activeModeRef.current = activeMode;
  const resetOrientationRef = useRef<(() => void) | null>(null);

  // Mouse coordinates relative to container (-1 to 1)
  const targetRotation = useRef({ x: 0, y: 0 });
  const isHovered = useRef(false);

  useEffect(() => {
    if (useFallback) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let animationFrameId: number = 0;
    let isVisible = true;
    const isReducedMotion = checkPrefersReducedMotion();

    try {
      // 1. Scene, Camera & Renderer Setup
      scene = new THREE.Scene();
      const width = container.clientWidth || 500;
      const height = container.clientHeight || 460;

      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.z = 7.5;

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setClearColor(0x000000, 0);

      // WebGL Context Loss Protection
      const handleContextLost = (event: Event) => {
        event.preventDefault();
        setUseFallback(true);
      };
      canvas.addEventListener('webglcontextlost', handleContextLost, false);

      // 2. Core Hierarchy Construction (THREE.Group)
      const neuralCoreGroup = new THREE.Group();
      scene.add(neuralCoreGroup);

      resetOrientationRef.current = () => {
        neuralCoreGroup.rotation.set(0, 0, 0);
        targetRotation.current = { x: 0, y: 0 };
      };

      // A. Central Faceted Icosahedron (Outer Wireframe Shell)
      const icosahedronGeo = new THREE.IcosahedronGeometry(1.65, 1);
      const icosahedronMat = new THREE.MeshBasicMaterial({
        color: 0x00E5FF,
        wireframe: true,
        transparent: true,
        opacity: 0.85
      });
      const icosahedronMesh = new THREE.Mesh(icosahedronGeo, icosahedronMat);
      neuralCoreGroup.add(icosahedronMesh);

      // B. Inner Glowing Nucleus (Sphere with dual shell)
      const innerNucleusGeo = new THREE.SphereGeometry(0.85, 24, 24);
      const innerNucleusMat = new THREE.MeshBasicMaterial({
        color: 0x8B5CF6,
        transparent: true,
        opacity: 0.65,
        wireframe: true
      });
      const innerNucleusMesh = new THREE.Mesh(innerNucleusGeo, innerNucleusMat);
      neuralCoreGroup.add(innerNucleusMesh);

      // C. Dense Core Point
      const denseCenterGeo = new THREE.SphereGeometry(0.3, 16, 16);
      const denseCenterMat = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF
      });
      const denseCenterMesh = new THREE.Mesh(denseCenterGeo, denseCenterMat);
      neuralCoreGroup.add(denseCenterMesh);

      // D. Counter-Rotating Orbital Gimbal Rings
      const ring1Geo = new THREE.TorusGeometry(2.65, 0.02, 16, 90);
      const ring1Mat = new THREE.MeshBasicMaterial({
        color: 0x00E5FF,
        transparent: true,
        opacity: 0.75
      });
      const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
      ring1Mesh.rotation.x = Math.PI / 4;
      neuralCoreGroup.add(ring1Mesh);

      const ring2Geo = new THREE.TorusGeometry(2.2, 0.02, 16, 90);
      const ring2Mat = new THREE.MeshBasicMaterial({
        color: 0x8B5CF6,
        transparent: true,
        opacity: 0.75
      });
      const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2Mesh.rotation.y = Math.PI / 3;
      neuralCoreGroup.add(ring2Mesh);

      // E. Floating Synaptic Particle Cloud
      const isMobile = window.innerWidth < 768;
      const particleCount = isMobile ? 80 : 200;
      const particlePositions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        // Distribute points in spherical radius shell [2.0, 3.8]
        const r = 2.0 + Math.random() * 1.8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        particlePositions[i * 3 + 2] = r * Math.cos(phi);
      }

      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

      const particleMat = new THREE.PointsMaterial({
        color: 0x00E5FF,
        size: 0.065,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });
      const particleCloud = new THREE.Points(particleGeo, particleMat);
      neuralCoreGroup.add(particleCloud);

      // 3. Resize Listener
      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      };
      window.addEventListener('resize', handleResize);

      // 4. Viewport Visibility Listener (IntersectionObserver)
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
            if (isVisible && !isReducedMotion && !animationFrameId) {
              animationFrameId = requestAnimationFrame(render);
            }
          });
        },
        { threshold: 0.05 }
      );
      observer.observe(container);

      // 5. Render Loop with Dynamic Inertia
      const startTime = performance.now();

      const render = () => {
        if (!isVisible) {
          animationFrameId = 0;
          return;
        }

        const elapsedTime = (performance.now() - startTime) / 1000;

        // Mode-Specific Modulations
        const currentMode = activeModeRef.current;
        const speedMultiplier = currentMode === 'synapse' ? 1.5 : currentMode === 'gimbal' ? 0.7 : 1.0;

        // Subtle organic breathing pulse on nucleus
        const pulse = 1 + Math.sin(elapsedTime * 2.2) * 0.06;
        innerNucleusMesh.scale.set(pulse, pulse, pulse);

        // Core continuous gentle rotation
        icosahedronMesh.rotation.y += 0.004 * speedMultiplier;
        icosahedronMesh.rotation.x += 0.002 * speedMultiplier;

        // Counter-rotating gimbal rings
        ring1Mesh.rotation.x += 0.006 * speedMultiplier;
        ring1Mesh.rotation.y += 0.008 * speedMultiplier;

        ring2Mesh.rotation.y -= 0.007 * speedMultiplier;
        ring2Mesh.rotation.z += 0.005 * speedMultiplier;

        // Particle field rotation
        particleCloud.rotation.y += 0.0015 * speedMultiplier;

        // Interactive mouse inertial tilt smoothing (lerp dampening)
        const targetX = isHovered.current ? targetRotation.current.x * 0.45 : 0;
        const targetY = isHovered.current ? targetRotation.current.y * 0.45 : 0;

        neuralCoreGroup.rotation.y += (targetY - neuralCoreGroup.rotation.y) * 0.06;
        neuralCoreGroup.rotation.x += (targetX - neuralCoreGroup.rotation.x) * 0.06;

        renderer?.render(scene!, camera!);

        if (!isReducedMotion) {
          animationFrameId = requestAnimationFrame(render);
        }
      };

      // Static frame render if reduced motion is requested
      if (isReducedMotion) {
        neuralCoreGroup.rotation.set(0.2, 0.4, 0);
        renderer.render(scene, camera);
      } else {
        animationFrameId = requestAnimationFrame(render);
      }

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        observer.disconnect();
        canvas.removeEventListener('webglcontextlost', handleContextLost);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        resetOrientationRef.current = null;

        // Dispose geometries
        icosahedronGeo.dispose();
        innerNucleusGeo.dispose();
        denseCenterGeo.dispose();
        ring1Geo.dispose();
        ring2Geo.dispose();
        particleGeo.dispose();

        // Dispose materials
        icosahedronMat.dispose();
        innerNucleusMat.dispose();
        denseCenterMat.dispose();
        ring1Mat.dispose();
        ring2Mat.dispose();
        particleMat.dispose();

        // Dispose renderer cleanly without forcing artificial context loss
        if (renderer) {
          renderer.dispose();
        }
      };
    } catch (err) {
      console.warn('Three.js 3D initialization failed, utilizing canvas fallback:', err);
      setUseFallback(true);
    }
  }, [useFallback]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    targetRotation.current = { x: y * 1.5, y: x * 1.5 };
    isHovered.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHovered.current = false;
  }, []);

  const handleResetCore = useCallback(() => {
    if (resetOrientationRef.current) {
      resetOrientationRef.current();
    }
  }, []);

  // Automatic Fallback to 2D Canvas if WebGL is unavailable or failed
  if (useFallback) {
    return <HeroVisual />;
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[460px] sm:h-[480px] rounded-2xl bg-gradient-to-br from-[#0D111B]/95 via-[#0A0D15]/85 to-[#08090D] border border-cyan-500/25 shadow-[0_0_50px_-15px_rgba(0,229,255,0.2)] overflow-hidden flex flex-col justify-between p-5"
    >
      {/* Top HUD Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/[0.08] pb-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] animate-pulse" />
          <span className="font-mono text-slate-300 font-semibold tracking-wider text-[11px]">
            AI DIGITAL WORKSPACE
          </span>
          <span className="text-slate-600">·</span>
          <span className="font-mono text-cyan-300 text-[11px] flex items-center gap-1">
            <Box className="w-3 h-3 text-[#00E5FF]" />
            <span>3D NEURAL CORE</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetCore}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10 text-[11px] font-mono cursor-pointer"
            aria-label="Re-align 3D neural core"
            title="Re-align 3D Core"
          >
            <RefreshCw className="w-3 h-3 text-[#00E5FF]" />
            <span>Re-align</span>
          </button>
        </div>
      </div>

      {/* Main 3D WebGL Canvas Layer */}
      <div className="relative flex-1 w-full my-2">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
          title="Interactive 3D AI Neural Core — Move cursor to orbit"
        />

        {/* Floating Holographic Info Card 1 (Top Left) */}
        <div className="absolute top-4 left-4 z-10 bg-[#08090D]/80 backdrop-blur-md border border-cyan-500/20 rounded-xl p-3 shadow-lg pointer-events-none max-w-[210px] hidden sm:block">
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-300 font-semibold">
              Neural Geometry
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Topology: Dual Geodesic Icosahedron with Quantum Gimbal Array
          </p>
          <div className="mt-2 pt-2 border-t border-white/[0.06] flex items-center justify-between font-mono text-[10px]">
            <span className="text-slate-400">Renderer</span>
            <span className="text-[#00E5FF] font-medium">WebGL 3D Core</span>
          </div>
        </div>

        {/* Floating Holographic Info Card 2 (Bottom Right) */}
        <div className="absolute bottom-4 right-4 z-10 bg-[#08090D]/80 backdrop-blur-md border border-violet-500/20 rounded-xl p-3 shadow-lg pointer-events-none max-w-[220px] hidden md:block">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-300 font-semibold">
              Telemetry Vector
            </span>
          </div>
          <div className="space-y-1 font-mono text-[10px]">
            <div className="flex justify-between text-slate-400">
              <span>Orbital Motion:</span>
              <span className="text-white">Continuous Gyro</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Inertial Tilt:</span>
              <span className="text-emerald-400 font-medium">Active Pointer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom status and interactive mode switcher */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.08] text-[11px]">
        <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-lg border border-white/10" role="group" aria-label="Neural core display modes">
          <button
            type="button"
            onClick={() => setActiveMode('core')}
            aria-pressed={activeMode === 'core'}
            className={`px-2.5 py-1 rounded font-mono transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#00E5FF] ${
              activeMode === 'core'
                ? 'bg-[#00E5FF]/20 text-[#00E5FF] font-semibold border border-[#00E5FF]/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Core Orbit
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('synapse')}
            aria-pressed={activeMode === 'synapse'}
            className={`px-2.5 py-1 rounded font-mono transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#8B5CF6] ${
              activeMode === 'synapse'
                ? 'bg-[#8B5CF6]/20 text-[#A78BFA] font-semibold border border-[#8B5CF6]/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Synaptic Flux
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('gimbal')}
            aria-pressed={activeMode === 'gimbal'}
            className={`px-2.5 py-1 rounded font-mono transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-sky-400 ${
              activeMode === 'gimbal'
                ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Quantum Gimbal
          </button>
        </div>

        <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span>Interactive 3D · Move Cursor</span>
        </div>
      </div>
    </div>
  );
};

export default Hero3DVisual;
