import type { Variants, Transition } from 'framer-motion';

/**
 * Standard cubic-bezier easing curve for smooth, cybernetic interface transitions.
 */
export const CYBER_EASING = [0.16, 1, 0.3, 1] as const;

/**
 * Helper to check whether system prefers reduced motion.
 */
export function checkPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/**
 * Adapts variants for users who prefer reduced motion.
 * Keeps opacity transitions intact so content fades cleanly without large geometric shifts.
 */
export function adaptForReducedMotion(variants: Variants, isReduced: boolean): Variants {
  if (!isReduced) return variants;

  const accessible: Record<string, any> = {};
  for (const [key, state] of Object.entries(variants)) {
    if (typeof state === 'object' && state !== null) {
      const copy = { ...state };
      // Suppress large translational and scale animations
      if ('y' in copy) copy.y = 0;
      if ('x' in copy) copy.x = 0;
      if ('scale' in copy) copy.scale = 1;
      if ('rotate' in copy) copy.rotate = 0;
      if ('rotateX' in copy) copy.rotateX = 0;
      if ('rotateY' in copy) copy.rotateY = 0;

      // Ensure transitions remain responsive and gentle
      if (copy.transition && typeof copy.transition === 'object') {
        copy.transition = {
          ...copy.transition,
          duration: Math.min(copy.transition.duration || 0.3, 0.25)
        };
      }
      accessible[key] = copy;
    } else {
      accessible[key] = state;
    }
  }
  return accessible as Variants;
}

/**
 * 1. Fade-In Variants
 */
export function createFadeInVariants(duration = 0.45, delay = 0): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration,
        delay,
        ease: 'easeOut'
      }
    }
  };
}

/**
 * 2. Fade-Up Variants
 */
export function createFadeUpVariants(yOffset = 24, duration = 0.55, delay = 0): Variants {
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
        ease: CYBER_EASING
      }
    }
  };
}

/**
 * 3. Fade-Down Variants
 */
export function createFadeDownVariants(yOffset = 24, duration = 0.5, delay = 0): Variants {
  return {
    hidden: {
      opacity: 0,
      y: -yOffset
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        delay,
        ease: CYBER_EASING
      }
    }
  };
}

/**
 * 4. Stagger Container Variants
 */
export function createStaggerContainerVariants(staggerDelay = 0.08, delayChildren = 0.04): Variants {
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

/**
 * 5. Stagger Children Variants
 */
export function createStaggerChildVariants(yOffset = 16, duration = 0.45): Variants {
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
        ease: CYBER_EASING
      }
    }
  };
}

/**
 * 6. Card Hover Variants
 */
export const cardHoverVariants: Variants = {
  idle: {
    y: 0,
    scale: 1,
    transition: {
      duration: 0.28,
      ease: 'easeOut'
    }
  },
  hover: {
    y: -4,
    scale: 1.012,
    transition: {
      duration: 0.28,
      ease: 'easeOut'
    }
  }
};

/**
 * 7. Button Interaction Variants
 */
export const buttonInteractionVariants: Variants = {
  idle: {
    scale: 1,
    y: 0,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  hover: {
    scale: 1.025,
    y: -1,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  tap: {
    scale: 0.975,
    y: 0,
    transition: { duration: 0.1, ease: 'easeIn' }
  }
};

/**
 * 8. Modal Entrance & Exit Variants
 */
export const modalEntranceVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 12
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: CYBER_EASING
    }
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 8,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
};

/**
 * Modal Backdrop Fade Variants
 */
export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.24, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.18, ease: 'easeIn' }
  }
};

/**
 * 9. Image Reveal Variants
 */
export function createImageRevealVariants(duration = 0.6): Variants {
  return {
    hidden: {
      opacity: 0,
      scale: 1.04
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration,
        ease: CYBER_EASING
      }
    }
  };
}

/**
 * 10. Page / Section Entrance Variants
 */
export function createSectionEntranceVariants(delay = 0, yOffset = 30): Variants {
  return {
    hidden: {
      opacity: 0,
      y: yOffset
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        delay,
        ease: CYBER_EASING
      }
    }
  };
}

/**
 * Navigation Active Indicator Spring Transition
 */
export const navIndicatorSpring: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 32
};
