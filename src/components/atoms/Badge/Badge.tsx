import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

export type BadgeVariant = 'solid' | 'outline' | 'subtle';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeColorScheme = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'neutral';
export type BadgeShape = 'rounded' | 'pill';

export interface BadgeProps {
  // Core content
  children: React.ReactNode;
  
  // Appearance
  variant?: BadgeVariant;
  size?: BadgeSize;
  colorScheme?: BadgeColorScheme;
  shape?: BadgeShape;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  
  // Animation
  animate?: boolean;
  animationStyle?: 'pulse' | 'bounce' | 'none';
  
  // Interaction
  onClick?: () => void;
  
  // HTML props
  className?: string;
  id?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  // Core content
  children,
  
  // Appearance
  variant = 'solid',
  size = 'md',
  colorScheme = 'primary',
  shape = 'rounded',
  icon,
  iconPosition = 'left',
  
  // Animation
  animate = false,
  animationStyle = 'none',
  
  // Interaction
  onClick,
  
  // HTML props
  className = '',
  id,
}) => {
  // Determine if the badge is interactive (has onClick)
  const isInteractive = Boolean(onClick);
  
  // Variant styles
  const variantStyles = {
    solid: {
      primary: 'bg-primary text-white',
      secondary: 'bg-secondary text-white',
      success: 'bg-success text-white',
      error: 'bg-error text-white',
      warning: 'bg-warning text-white',
      info: 'bg-primary/80 text-white',
      neutral: 'bg-bg-surface-hover text-text-base',
    },
    outline: {
      primary: 'border border-primary text-primary',
      secondary: 'border border-secondary text-secondary',
      success: 'border border-success text-success',
      error: 'border border-error text-error',
      warning: 'border border-warning text-warning',
      info: 'border border-primary/80 text-primary/80',
      neutral: 'border border-border text-text-base',
    },
    subtle: {
      primary: 'bg-primary/10 text-primary',
      secondary: 'bg-secondary/10 text-secondary',
      success: 'bg-success/10 text-success',
      error: 'bg-error/10 text-error',
      warning: 'bg-warning/10 text-warning',
      info: 'bg-primary/10 text-primary/80',
      neutral: 'bg-bg-surface text-text-base',
    },
  };
  
  // Size styles
  const sizeStyles = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-0.5',
    lg: 'text-base px-2.5 py-1',
  };
  
  // Shape styles
  const shapeStyles = {
    rounded: 'rounded',
    pill: 'rounded-full',
  };
  
  // Animation variants
  const pulseAnimation: Variants = {
    initial: { scale: 1 },
    animate: animate ? {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop",
      }
    } : { scale: 1 },
  };
  
  const bounceAnimation: Variants = {
    initial: { y: 0 },
    animate: animate ? {
      y: [0, -3, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatType: "loop",
      }
    } : { y: 0 },
  };
  
  const noAnimation: Variants = {
    initial: {},
    animate: {},
  };
  
  // Select the appropriate animation variant
  const selectedAnimation = 
    animationStyle === 'pulse' ? pulseAnimation :
    animationStyle === 'bounce' ? bounceAnimation :
    noAnimation;
  
  // Combined classes
  const badgeClasses = [
    'inline-flex items-center justify-center',
    variantStyles[variant][colorScheme],
    sizeStyles[size],
    shapeStyles[shape],
    isInteractive ? 'cursor-pointer hover:brightness-95 active:brightness-90' : '',
    'transition-all duration-200',
    className,
  ].filter(Boolean).join(' ');
  
  return (
    <motion.span
      id={id}
      className={badgeClasses}
      onClick={onClick}
      variants={selectedAnimation}
      initial="initial"
      animate="animate"
      whileHover={isInteractive ? { scale: 1.05 } : {}}
      whileTap={isInteractive ? { scale: 0.95 } : {}}
    >
      {icon && iconPosition === 'left' && (
        <span className="mr-1">{icon}</span>
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && (
        <span className="ml-1">{icon}</span>
      )}
    </motion.span>
  );
};

export default Badge; 