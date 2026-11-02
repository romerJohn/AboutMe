import { useState, useEffect } from 'react';
import { checkPrefersReducedMotion } from '../utils/motionVariants';

/**
 * Custom React hook to observe user preference for reduced motion.
 * Updates dynamically if user changes system accessibility settings.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState<boolean>(() => checkPrefersReducedMotion());

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } else if ((mediaQuery as any).addListener) {
      (mediaQuery as any).addListener(listener);
      return () => (mediaQuery as any).removeListener(listener);
    }
  }, []);

  return prefersReduced;
}
