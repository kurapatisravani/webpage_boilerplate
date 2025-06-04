import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerColorScheme = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'muted' | 'inherit';
export type SpinnerVariant = 'border' | 'dots' | 'grid' | 'pulse' | 'ring';

export interface SpinnerProps {
  // Appearance
  size?: SpinnerSize;
  colorScheme?: SpinnerColorScheme;
  variant?: SpinnerVariant;
  thickness?: 'thin' | 'regular' | 'thick';
  
  // Behavior
  speed?: 'slow' | 'medium' | 'fast';
  
  // Label for accessibility
  label?: string;
  
  // HTML props
  className?: string;
  id?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  // Appearance
  size = 'md',
  colorScheme = 'primary',
  variant = 'border',
  thickness = 'regular',
  
  // Behavior
  speed = 'medium',
  
  // Label for accessibility
  label = 'Loading',
  
  // HTML props
  className = '',
  id,
}) => {
  // Size styles
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
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
  
  // Thickness styles
  const thicknessClasses = {
    thin: 'border-[1px]',
    regular: 'border-2',
    thick: 'border-[3px]',
  };
  
  // Speed durations
  const speedDurations = {
    slow: 1.5,
    medium: 1,
    fast: 0.6,
  };
  
  // Animation variants
  const spinAnimation: Variants = {
    animate: {
      rotate: 360,
      transition: {
        duration: speedDurations[speed],
        repeat: Infinity,
        ease: "linear",
      }
    }
  };
  
  const pulseAnimation: Variants = {
    animate: {
      scale: [0.5, 1, 0.5],
      opacity: [0.3, 1, 0.3],
      transition: {
        duration: speedDurations[speed] * 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }
    }
  };
  
  // Determine which variant to render
  const renderVariant = () => {
    switch (variant) {
      case 'border':
        return (
          <motion.div
            className={`
              rounded-full 
              border-current 
              ${thicknessClasses[thickness]} 
              border-t-transparent 
              ${sizeClasses[size]} 
              ${colorSchemeClasses[colorScheme]}
            `}
            variants={spinAnimation}
            animate="animate"
            aria-label={label}
          />
        );
        
      case 'dots':
        return (
          <div className={`flex space-x-1 ${colorSchemeClasses[colorScheme]}`} aria-label={label}>
            {[0, 1, 2].map(index => (
              <motion.div
                key={index}
                className={`rounded-full bg-current ${size === 'xs' ? 'w-1 h-1' : size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : size === 'lg' ? 'w-2.5 h-2.5' : 'w-3 h-3'}`}
                animate={{
                  y: [0, -6, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: speedDurations[speed],
                  repeat: Infinity,
                  delay: index * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        );
        
      case 'grid':
        return (
          <div className={`grid grid-cols-3 gap-1 ${sizeClasses[size]} ${colorSchemeClasses[colorScheme]}`} aria-label={label}>
            {[...Array(9)].map((_, index) => (
              <motion.div
                key={index}
                className="rounded-full bg-current"
                animate={{
                  scale: [0.5, 1, 0.5],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: speedDurations[speed],
                  repeat: Infinity,
                  delay: index * 0.05,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        );
        
      case 'pulse':
        return (
          <motion.div
            className={`
              rounded-full 
              bg-current
              ${sizeClasses[size]} 
              ${colorSchemeClasses[colorScheme]}
            `}
            variants={pulseAnimation}
            animate="animate"
            aria-label={label}
          />
        );
        
      case 'ring':
        return (
          <motion.div
            className={`
              rounded-full 
              border-current 
              ${thicknessClasses[thickness]} 
              ${sizeClasses[size]} 
              ${colorSchemeClasses[colorScheme]}
            `}
            variants={spinAnimation}
            animate="animate"
            aria-label={label}
          />
        );
        
      default:
        return null;
    }
  };
  
  // Combined classes
  const containerClasses = [
    'inline-flex items-center justify-center',
    className,
  ].filter(Boolean).join(' ');
  
  return (
    <div id={id} className={containerClasses} role="status">
      {renderVariant()}
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
};

export default Spinner; 