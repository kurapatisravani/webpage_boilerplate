import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type IconColorScheme = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'muted' | 'inherit';
export type IconAnimation = 'spin' | 'pulse' | 'bounce' | 'shake' | 'none';

export interface IconProps {
  // Core content
  icon: React.ReactNode;
  
  // Appearance
  size?: IconSize;
  colorScheme?: IconColorScheme;
  
  // Animation
  animation?: IconAnimation;
  
  // Interaction
  onClick?: () => void;
  
  // HTML props
  className?: string;
  id?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
  title?: string;
}

export const Icon: React.FC<IconProps> = ({
  // Core content
  icon,
  
  // Appearance
  size = 'md',
  colorScheme = 'inherit',
  
  // Animation
  animation = 'none',
  
  // Interaction
  onClick,
  
  // HTML props
  className = '',
  id,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden = true,
  title,
}) => {
  // Size styles
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-10 h-10',
  };
  
  // Color scheme styles
  const colorSchemeClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    error: 'text-error',
    warning: 'text-warning',
    info: 'text-primary/80',
    muted: 'text-text-muted',
    inherit: 'text-inherit',
  };
  
  // Animation variants
  const animationVariants: Record<IconAnimation, Variants> = {
    spin: {
      animate: {
        rotate: 360,
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }
      }
    },
    pulse: {
      animate: {
        scale: [1, 1.1, 1],
        transition: {
          duration: 1.5,
          repeat: Infinity,
        }
      }
    },
    bounce: {
      animate: {
        y: [0, -5, 0],
        transition: {
          duration: 0.6,
          repeat: Infinity,
        }
      }
    },
    shake: {
      animate: {
        x: [0, -3, 3, -3, 0],
        transition: {
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: 1,
        }
      }
    },
    none: {
      animate: {}
    },
  };
  
  // Combined classes
  const iconClasses = [
    'inline-flex items-center justify-center',
    sizeClasses[size],
    colorSchemeClasses[colorScheme],
    onClick ? 'cursor-pointer hover:opacity-80' : '',
    className,
  ].filter(Boolean).join(' ');
  
  return (
    <motion.span
      id={id}
      className={iconClasses}
      onClick={onClick}
      variants={animationVariants[animation]}
      animate={animation !== 'none' ? 'animate' : undefined}
      whileHover={onClick ? { scale: 1.1 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      title={title}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {icon}
    </motion.span>
  );
};

export default Icon; 