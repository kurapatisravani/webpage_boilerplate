import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Typography } from '../../atoms/Typography/Typography';
import { Button } from '../../atoms/Button/Button';
import type { IconType } from 'react-icons';

// Card sizes
type CardSize = 'sm' | 'md' | 'lg' | 'xl';

// Card variants
type CardVariant = 'elevated' | 'outlined' | 'filled' | 'custom';

// Card animation styles
type AnimationStyle = 'lift' | 'glow' | 'tilt' | 'bounce' | 'expand' | 'highlight' | 'none';

// Card interactions
type InteractionMode = 'hover' | 'click' | 'both' | 'none';

// Typography color schemes from Typography component
type TypographyColorScheme = 
  | 'primary' 
  | 'secondary' 
  | 'tertiary'
  | 'default'
  | 'muted'
  | 'inverted'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

// Card appearance
interface CardAppearance {
  background?: string;
  foreground?: string;
  borderColor?: string;
  borderRadius?: string;
  shadowColor?: string;
}

export interface CardProps {
  // Core content
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  media?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  
  // Actions
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: IconType;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    icon?: IconType;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  };
  
  // Layout options
  mediaPosition?: 'top' | 'bottom' | 'left' | 'right' | 'background';
  aspectRatio?: '1:1' | '16:9' | '4:3' | '3:2' | 'auto';
  
  // Style and interactions
  variant?: CardVariant;
  size?: CardSize;
  animationStyle?: AnimationStyle;
  interactionMode?: InteractionMode;
  appearance?: CardAppearance;
  clickable?: boolean;
  enableHoverEffects?: boolean;
  enableClickEffects?: boolean;
  
  // Animation timing
  animationDuration?: number;
  
  // HTML props
  className?: string;
  id?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

// Define animation variants by state and style
type AnimationVariants = {
  initial: any;
  animate: any;
  hover: {
    [key in AnimationStyle]: any;
  };
  click: {
    [key in AnimationStyle]: any;
  };
};

export const Card: React.FC<CardProps> = ({
  // Core content
  title,
  subtitle,
  description,
  media,
  footer,
  children,
  
  // Actions
  primaryAction,
  secondaryAction,
  
  // Layout options
  mediaPosition = 'top',
  aspectRatio = 'auto',
  
  // Style and interactions
  variant = 'elevated',
  size = 'md',
  animationStyle = 'lift',
  interactionMode = 'hover',
  appearance = {},
  clickable = false,
  enableHoverEffects = true,
  enableClickEffects = true,
  
  // Animation timing
  animationDuration = 0.2,
  
  // HTML props
  className = '',
  id,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  // State hooks
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Refs
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Animation values for special effects
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Gradient animation for glow effect
  const backgroundGlow = useMotionTemplate`
    radial-gradient(
      circle at ${mouseX}px ${mouseY}px,
      rgba(var(--color-primary-rgb), 0.15) 0%,
      rgba(var(--color-primary-rgb), 0) 50%
    )
  `;
  
  // Effects
  useEffect(() => {
    // Entrance animation
    const timer = setTimeout(() => {
      setHasAnimatedIn(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle mouse enter
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (interactionMode === 'hover' || interactionMode === 'both') {
      setIsHovered(true);
    }
    
    if (onMouseEnter) {
      onMouseEnter();
    }
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    if (interactionMode === 'hover' || interactionMode === 'both') {
      setIsHovered(false);
    }
    setIsPressed(false);
    
    // Reset tilt animations
    if (animationStyle === 'tilt') {
      rotateX.set(0);
      rotateY.set(0);
    }
    
    if (onMouseLeave) {
      onMouseLeave();
    }
  };
  
  // Handle mouse move for interactive effects
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !enableHoverEffects) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to card
    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;
    
    // Update position for glow effect
    mouseX.set(relativeX);
    mouseY.set(relativeY);
    
    // For tilt effect
    if (animationStyle === 'tilt') {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate tilt amounts
      const tiltX = (relativeY - centerY) / 10;
      const tiltY = (centerX - relativeX) / 10;
      
      rotateX.set(tiltX);
      rotateY.set(tiltY);
    }
    
    setMousePosition({ x: relativeX, y: relativeY });
  };
  
  // Handle click
  const handleClick = () => {
    if (interactionMode === 'click' || interactionMode === 'both') {
      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 300);
    }
    
    if (onClick) {
      onClick();
    }
  };
  
  // Base style classes
  const sizeClasses = {
    sm: 'p-3 text-sm',
    md: 'p-4 text-base',
    lg: 'p-5 text-base',
    xl: 'p-6 text-lg',
  };
  
  const variantClasses = {
    elevated: 'bg-bg-surface shadow-md',
    outlined: 'bg-bg-surface border border-border',
    filled: 'bg-bg-surface/80',
    custom: '',
  };
  
  const aspectRatioClasses = {
    '1:1': 'aspect-square',
    '16:9': 'aspect-video',
    '4:3': 'aspect-4/3',
    '3:2': 'aspect-3/2',
    'auto': '',
  };
  
  const mediaPositionClasses = {
    top: 'flex-col',
    bottom: 'flex-col-reverse',
    left: 'flex-row',
    right: 'flex-row-reverse',
    background: 'flex-col',
  };
  
  // Animation variants
  const cardAnimationVariants: AnimationVariants = {
    // Initial state for all animations
    initial: { 
      opacity: 0, 
      y: 10,
      scale: 0.98,
    },
    
    // Animation in
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.4,
        ease: "easeOut" 
      }
    },
    
    // Hover animations
    hover: {
      lift: enableHoverEffects ? { 
        y: -8,
        scale: 1.02,
        boxShadow: '0 16px 30px -10px rgba(0, 0, 0, 0.1), 0 8px 10px -5px rgba(0, 0, 0, 0.04)',
        transition: { duration: animationDuration }
      } : {},
      
      glow: enableHoverEffects ? { 
        boxShadow: '0 8px 20px -4px rgba(var(--color-primary-rgb), 0.3), 0 4px 10px -4px rgba(var(--color-primary-rgb), 0.2)',
        transition: { duration: animationDuration }
      } : {},
      
      tilt: enableHoverEffects ? { 
        boxShadow: '0 12px 24px -8px rgba(0, 0, 0, 0.1), 0 6px 12px -6px rgba(0, 0, 0, 0.08)',
        transition: { duration: animationDuration }
      } : {},
      
      bounce: enableHoverEffects ? { 
        y: [0, -10, -5, -8],
        transition: { duration: 0.5, times: [0, 0.4, 0.7, 1] }
      } : {},
      
      expand: enableHoverEffects ? { 
        scale: 1.03,
        transition: { duration: animationDuration }
      } : {},
      
      highlight: enableHoverEffects ? { 
        boxShadow: '0 0 0 2px rgba(var(--color-primary-rgb), 0.5)',
        transition: { duration: animationDuration }
      } : {},
      
      none: {},
    },
    
    // Click animations
    click: {
      lift: enableClickEffects ? { 
        y: -2,
        scale: 0.98,
        transition: { duration: 0.1 }
      } : {},
      
      glow: enableClickEffects ? { 
        boxShadow: '0 0 12px 4px rgba(var(--color-primary-rgb), 0.4)',
        transition: { duration: 0.1 }
      } : {},
      
      tilt: enableClickEffects ? { 
        scale: 0.98,
        transition: { duration: 0.1 }
      } : {},
      
      bounce: enableClickEffects ? { 
        y: [0, 4, 0],
        transition: { duration: 0.3, times: [0, 0.5, 1] }
      } : {},
      
      expand: enableClickEffects ? { 
        scale: 0.98,
        transition: { duration: 0.1 }
      } : {},
      
      highlight: enableClickEffects ? { 
        boxShadow: '0 0 0 3px rgba(var(--color-primary-rgb), 0.7)',
        transition: { duration: 0.1 }
      } : {},
      
      none: {},
    }
  };
  
  // Determine active animation state
  const determineAnimationState = () => {
    if (isPressed) return "click";
    if (isHovered) return "hover";
    return "";
  };
  
  // Combine classes
  const combinedClasses = [
    'card-container rounded-lg overflow-hidden transition-colors duration-300',
    sizeClasses[size],
    variantClasses[variant],
    mediaPosition !== 'background' ? mediaPositionClasses[mediaPosition] : 'relative',
    clickable ? 'cursor-pointer' : '',
    className,
  ].filter(Boolean).join(' ');
  
  // Custom styles
  const customStyles = {
    backgroundColor: appearance.background,
    color: appearance.foreground,
    borderColor: appearance.borderColor,
    borderRadius: appearance.borderRadius,
    // We handle shadows via motion animations
  };
  
  // Combine hover, press and animation style
  const activeAnimationState = determineAnimationState();
  const animationVariant = activeAnimationState ? 
    cardAnimationVariants[activeAnimationState as keyof typeof cardAnimationVariants][animationStyle] : 
    {};
  
  // Media container classes based on position and ratio
  const mediaContainerClasses = [
    'overflow-hidden',
    mediaPosition === 'background' ? 'absolute inset-0 -z-10' : '',
    mediaPosition === 'left' || mediaPosition === 'right' ? 'w-1/3' : 'w-full',
    aspectRatio !== 'auto' && mediaPosition !== 'background' ? aspectRatioClasses[aspectRatio] : '',
  ].filter(Boolean).join(' ');
  
  // Content container classes
  const contentContainerClasses = [
    'flex-1',
    mediaPosition === 'background' ? 'relative z-10' : '',
    mediaPosition === 'left' || mediaPosition === 'right' ? 'p-4' : '',
  ].filter(Boolean).join(' ');
  
  // Special styles for background media
  const backgroundMediaStyles = {
    ...(mediaPosition === 'background' && {
      '&::after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: -5,
      }
    })
  };
  
  // Helper to handle colorScheme for text on background media
  const getTextColorScheme = (defaultScheme: TypographyColorScheme = 'default'): TypographyColorScheme => {
    return mediaPosition === 'background' ? 'primary' : defaultScheme;
  };
  
  return (
    <motion.div
      ref={cardRef}
      id={id}
      className={combinedClasses}
      style={{
        ...customStyles,
        ...(animationStyle === 'tilt' ? {
          rotateX: rotateX,
          rotateY: rotateY,
          transformStyle: 'preserve-3d',
          perspective: 800,
        } : {}),
        ...(animationStyle === 'glow' && isHovered ? {
          backgroundImage: backgroundGlow
        } : {})
      }}
      initial="initial"
      animate={{
        ...cardAnimationVariants.animate,
        ...animationVariant
      }}
      whileHover={
        interactionMode === 'hover' || interactionMode === 'both' 
          ? cardAnimationVariants.hover[animationStyle] 
          : {}
      }
      whileTap={
        (interactionMode === 'click' || interactionMode === 'both') && clickable
          ? cardAnimationVariants.click[animationStyle]
          : {}
      }
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Media section */}
      {media && (
        <div className={mediaContainerClasses}>
          {media}
          {mediaPosition === 'background' && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10 z-[-5]" />
          )}
        </div>
      )}
      
      {/* Content section */}
      <div className={contentContainerClasses}>
        {/* Title and subtitle */}
        {(title || subtitle) && (
          <div className={`${mediaPosition !== 'background' ? 'mb-3' : 'mb-2'}`}>
            {title && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                {typeof title === 'string' ? (
                  <Typography 
                    variant="h5" 
                    weight="semibold"
                    colorScheme={getTextColorScheme()}
                  >
                    {title}
                  </Typography>
                ) : (
                  title
                )}
              </motion.div>
            )}
            
            {subtitle && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                {typeof subtitle === 'string' ? (
                  <Typography 
                    variant="subtitle2" 
                    colorScheme={getTextColorScheme('muted')}
                    className="mt-1"
                  >
                    {subtitle}
                  </Typography>
                ) : (
                  subtitle
                )}
              </motion.div>
            )}
          </div>
        )}
        
        {/* Description */}
        {description && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="mb-4"
          >
            {typeof description === 'string' ? (
              <Typography 
                variant="body2" 
                colorScheme={getTextColorScheme()}
              >
                {description}
              </Typography>
            ) : (
              description
            )}
          </motion.div>
        )}
        
        {/* Custom children content */}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="mb-4"
          >
            {children}
          </motion.div>
        )}
        
        {/* Action buttons */}
        {(primaryAction || secondaryAction) && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className={`flex gap-3 ${!footer ? 'mt-auto' : ''}`}
          >
            {primaryAction && (
              <Button
                variant={primaryAction.variant || 'primary'}
                leftIcon={primaryAction.icon}
                onClick={primaryAction.onClick}
                size="sm"
                animationStyle="grow"
              >
                {primaryAction.label}
              </Button>
            )}
            
            {secondaryAction && (
              <Button
                variant={secondaryAction.variant || 'outline'}
                leftIcon={secondaryAction.icon}
                onClick={secondaryAction.onClick}
                size="sm"
                animationStyle="slide"
              >
                {secondaryAction.label}
              </Button>
            )}
          </motion.div>
        )}
      </div>
      
      {/* Footer */}
      {footer && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          className={`mt-auto pt-3 ${mediaPosition !== 'background' ? 'border-t border-border' : ''}`}
        >
          {footer}
        </motion.div>
      )}
      
      {/* Pulse animation on first render */}
      <AnimatePresence>
        {!hasAnimatedIn && (
          <motion.div
            className="absolute inset-0 bg-primary/10 rounded-lg z-10"
            initial={{ opacity: 0.7, scale: 0.85 }}
            animate={{ 
              opacity: 0,
              scale: 1.1,
              transition: { duration: 1, ease: "easeOut" }
            }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Card; 