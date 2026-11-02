import React, { useMemo } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { createScrollRevealVariants, adaptForReducedMotion } from '../utils/animations';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface ScrollRevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
  yOffset?: number;
  duration?: number;
  className?: string;
  amount?: number | 'some' | 'all';
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  yOffset = 28,
  duration = 0.65,
  className = '',
  amount = 0.12,
  ...props
}) => {
  const isReduced = usePrefersReducedMotion();
  const variants = useMemo(() => {
    const raw = createScrollRevealVariants({ delay, yOffset, duration });
    return adaptForReducedMotion(raw, isReduced);
  }, [delay, yOffset, duration, isReduced]);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

