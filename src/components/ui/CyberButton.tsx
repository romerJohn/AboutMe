import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { buttonInteractionVariants } from '../../utils/motionVariants';

export type CyberButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type CyberButtonSize = 'sm' | 'md' | 'lg';

export interface CyberButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: CyberButtonVariant;
  size?: CyberButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const CyberButton = forwardRef<HTMLButtonElement, CyberButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'relative inline-flex items-center justify-center font-mono font-medium rounded-xl select-none transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090D] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none';

    const sizeStyles: Record<CyberButtonSize, string> = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2 text-xs sm:text-sm gap-2',
      lg: 'px-6 py-3 text-sm sm:text-base gap-2.5'
    };

    const variantStyles: Record<CyberButtonVariant, string> = {
      primary:
        'bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-slate-950 font-semibold tracking-wide hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] border border-cyan-300/40',
      secondary:
        'bg-[#0D111B] text-slate-200 border border-white/15 hover:border-cyan-500/40 hover:text-white hover:bg-[#141B2D]',
      outline:
        'bg-transparent text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-950/30 hover:text-[#00E5FF]',
      ghost:
        'bg-transparent text-slate-400 hover:text-white hover:bg-white/10 border border-transparent',
      danger:
        'bg-rose-500/15 text-rose-300 border border-rose-500/40 hover:bg-rose-500/25 hover:border-rose-400 hover:text-rose-100 hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]'
    };

    return (
      <motion.button
        ref={ref}
        variants={buttonInteractionVariants}
        initial="idle"
        whileHover={disabled || isLoading ? undefined : 'hover'}
        whileTap={disabled || isLoading ? undefined : 'tap'}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" aria-hidden="true" />
            <span>{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

CyberButton.displayName = 'CyberButton';
