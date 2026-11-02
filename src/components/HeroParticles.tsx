import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  color: string;
  alpha: number;
  baseAlpha: number;
}

export const HeroParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number | null; y: number | null; active: boolean }>({
    x: null,
    y: null,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Particle color palette matching our futuristic theme
    const colors = [
      'rgba(0, 229, 255, ',   // Electric cyan
      'rgba(139, 92, 246, ',  // Neon violet
      'rgba(56, 189, 248, ',  // Sky blue
      'rgba(192, 132, 252, ', // Lavender
    ];

    let particles: Particle[] = [];

    const initParticles = () => {
      // Density based on viewport area
      const count = Math.min(Math.floor((width * height) / 14000), 75);
      particles = [];

      for (let i = 0; i < count; i++) {
        const colorPrefix = colors[Math.floor(Math.random() * colors.length)];
        const baseAlpha = 0.2 + Math.random() * 0.45;
        const radius = 1.2 + Math.random() * 1.8;

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (prefersReducedMotion ? 0.1 : 0.45),
          vy: (Math.random() - 0.5) * (prefersReducedMotion ? 0.1 : 0.45),
          baseRadius: radius,
          radius: radius,
          color: colorPrefix,
          alpha: baseAlpha,
          baseAlpha: baseAlpha,
        });
      }
    };

    const handleResize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = rect ? rect.width : window.innerWidth;
      height = rect ? rect.height : window.innerHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      initParticles();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    const mouseInfluenceRadius = 140;
    const maxConnectionDistance = 110;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;

      // Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move particle
        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          // Boundary wrap with padding
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;
        }

        // Mouse interaction: subtle repulsion and glow excitation
        if (mouse.active && mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseInfluenceRadius && dist > 0) {
            const force = (1 - dist / mouseInfluenceRadius);
            // Gentle radial deflection
            const angle = Math.atan2(dy, dx);
            p.x -= Math.cos(angle) * force * 1.8;
            p.y -= Math.sin(angle) * force * 1.8;

            // Enlarge and brighten
            p.radius = p.baseRadius * (1 + force * 1.2);
            p.alpha = Math.min(1, p.baseAlpha + force * 0.5);

            // Connect mouse cursor to nearby particles
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(0, 229, 255, ${force * 0.22})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          } else {
            // Smooth restore to base values
            p.radius += (p.baseRadius - p.radius) * 0.08;
            p.alpha += (p.baseAlpha - p.alpha) * 0.08;
          }
        } else {
          p.radius += (p.baseRadius - p.radius) * 0.08;
          p.alpha += (p.baseAlpha - p.alpha) * 0.08;
        }

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowColor = '#00E5FF';
        ctx.shadowBlur = p.alpha > 0.5 ? 8 : 0;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw inter-particle connections (cyber mesh)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distx = p.x - p2.x;
          const disty = p.y - p2.y;
          const dist = Math.sqrt(distx * distx + disty * disty);

          if (dist < maxConnectionDistance) {
            const linkAlpha = (1 - dist / maxConnectionDistance) * 0.12 * Math.min(p.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 229, 255, ${linkAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 w-full h-full"
      aria-hidden="true"
    />
  );
};
