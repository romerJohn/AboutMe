import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();

  // Smooth spring physics for fluid progress bar expansion and retraction
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-500 via-[#00E5FF] to-blue-500 z-[60] origin-left shadow-[0_0_12px_rgba(0,229,255,0.8)] pointer-events-none"
      style={{ scaleX }}
      role="progressbar"
      aria-label="Portfolio scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
};
