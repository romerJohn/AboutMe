import type { Variants } from 'framer-motion';

export interface ScrollRevealConfig {
  delay?: number;
  yOffset?: number;
  duration?: number;
}

/**
 * Generates framer-motion variants for scroll reveal animations.
 */
export function createScrollRevealVariants(config: ScrollRevealConfig = {}): Variants {
  const { delay = 0, yOffset = 32, duration = 0.65 } = config;

  return {
    hidden: {
      opacity: 0,
      y: yOffset
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1] as const // smooth cubic ease-out
      }
    }
  };
}

/**
 * Generates stagger container variants for child elements.
 */
export function createStaggerContainerVariants(staggerDelay = 0.12, delayChildren = 0.05): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren
      }
    }
  };
}

export interface ProjectCardEntranceConfig {
  index?: number;
  baseDelay?: number;
  staggerIncrement?: number;
  yOffset?: number;
  duration?: number;
}

/**
 * Generates framer-motion subtle entrance animation variants for project cards
 * with gentle upward drift, slight scaling, and staggered delay based on index.
 */
export function createProjectCardEntranceVariants(config: ProjectCardEntranceConfig = {}): Variants {
  const {
    index = 0,
    baseDelay = 0.05,
    staggerIncrement = 0.12,
    yOffset = 36,
    duration = 0.6
  } = config;

  const computedDelay = baseDelay + index * staggerIncrement;

  return {
    hidden: {
      opacity: 0,
      y: yOffset,
      scale: 0.96
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration,
        delay: computedDelay,
        ease: [0.21, 0.47, 0.32, 0.98] as const
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.25,
        ease: 'easeIn' as const
      }
    }
  };
}

export interface GlowFrameVariantsConfig {
  accentColor?: string;
}

/**
 * Generates Framer Motion variants for subtle glow-on-hover frame animations.
 */
export function createGlowFrameVariants(config: GlowFrameVariantsConfig = {}): {
  frameVariants: Variants;
  auraVariants: Variants;
  cornerVariants: Variants;
} {
  const { accentColor = '#00E5FF' } = config;

  return {
    frameVariants: {
      idle: {
        borderColor: 'rgba(255, 255, 255, 0.08)',
        boxShadow: '0 0 0px rgba(0, 229, 255, 0)',
        scale: 1
      },
      hovered: {
        borderColor: accentColor,
        boxShadow: `0 0 24px -2px ${accentColor}66, inset 0 0 16px -2px ${accentColor}26`,
        scale: 1.015,
        transition: { duration: 0.35, ease: 'easeOut' as const }
      }
    },
    auraVariants: {
      idle: { opacity: 0, scale: 0.95 },
      hovered: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.35, ease: 'easeOut' as const }
      }
    },
    cornerVariants: {
      idle: {
        borderColor: 'rgba(255, 255, 255, 0.25)',
        scale: 0.95
      },
      hovered: {
        borderColor: accentColor,
        scale: 1.15,
        transition: { duration: 0.25, ease: 'easeOut' as const }
      }
    }
  };
}
// Re-export all centralized motion variants for unified, backward-compatible access
export * from './motionVariants';
