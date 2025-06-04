// src/components/atoms/Button/Button.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { IconType } from 'react-icons';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';
type AnimationStyle = 'grow' | 'glow' | 'slide' | 'pulse' | 'bounce' | 'shine' | 'none';

interface ButtonProps {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: IconType;
  rightIcon?: IconType;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  animationStyle?: AnimationStyle;
  enableHoverAnimation?: boolean;
  enableClickAnimation?: boolean;
  enableIconAnimation?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  id?: string;
  name?: string;
  value?: string;
  tabIndex?: number;
  ariaLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = '',
  isLoading,
  disabled,
  animationStyle = 'grow',
  enableHoverAnimation = true,
  enableClickAnimation = true,
  enableIconAnimation = true,
  onClick,
  onFocus,
  onBlur,
  type = 'button',
  id,
  name,
  value,
  tabIndex,
  ariaLabel,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [animKey, setAnimKey] = useState(0); // Used to restart animations

  // Reset animation key when animation style changes
  useEffect(() => {
    setAnimKey(prev => prev + 1);
  }, [animationStyle]);

  const baseStyles = "font-medium rounded-md focus:outline-none relative overflow-hidden inline-flex items-center justify-center";
  
  const variantStyles = {
    primary: "bg-primary text-white hover:bg-primary-light focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:bg-primary/50",
    secondary: "bg-secondary text-white hover:bg-secondary-light focus:ring-2 focus:ring-secondary/50 focus:ring-offset-2 disabled:bg-secondary/50",
    outline: "border border-primary text-primary hover:bg-primary/10 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:text-primary/50 disabled:border-primary/50",
    ghost: "text-primary hover:bg-primary/10 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:text-primary/50",
    danger: "bg-error text-white hover:bg-error/80 focus:ring-2 focus:ring-error/50 focus:ring-offset-2 disabled:bg-error/50",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const loadingStyles = isLoading ? "opacity-75 cursor-not-allowed" : "";
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";

  // Animation variants
  const buttonVariants: Variants = {
    initial: { scale: 1 },
    hover: enableHoverAnimation ? {
      scale: animationStyle === 'grow' ? 1.05 : animationStyle === 'bounce' ? 1.03 : 1,
      y: animationStyle === 'bounce' ? -3 : 0,
      boxShadow: animationStyle === 'glow' ? '0 0 25px rgba(59, 130, 246, 0.6)' : 'none',
      x: animationStyle === 'slide' ? 3 : 0,
      transition: {
        scale: { type: "spring", stiffness: 400, damping: 10 },
        y: { type: "spring", stiffness: 300, damping: 10 }
      }
    } : {},
    tap: enableClickAnimation ? {
      scale: 0.95,
      transition: { duration: 0.1, type: "spring", stiffness: 400, damping: 17 }
    } : {},
    focus: {
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.4)',
      scale: 1.01,
      transition: { duration: 0.2 }
    }
  };

  const iconVariants: Variants = {
    initial: { x: 0, rotate: 0 },
    hover: enableIconAnimation ? {
      x: 3,
      rotate: 5,
      scale: 1.1,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    } : {},
    tap: enableIconAnimation ? {
      scale: 0.9,
      transition: { duration: 0.1 }
    } : {}
  };

  const rightIconVariants: Variants = {
    initial: { x: 0, rotate: 0 },
    hover: enableIconAnimation ? {
      x: 3,
      rotate: -5,
      scale: 1.1,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    } : {},
    tap: enableIconAnimation ? {
      scale: 0.9,
      transition: { duration: 0.1 }
    } : {}
  };

  const rippleVariants: Variants = {
    initial: { scale: 0, opacity: 0.5 },
    animate: { 
      scale: 10,
      opacity: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const pulseVariants: Variants = {
    initial: { opacity: 0.5, scale: 1 },
    animate: {
      opacity: [0.5, 0.7, 0.5],
      scale: [1, 1.03, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const slideVariants: Variants = {
    initial: { x: "-100%" },
    animate: {
      x: "200%",
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: "easeInOut"
      }
    }
  };

  const shineVariants: Variants = {
    initial: { x: "-100%", opacity: 0 },
    animate: {
      x: "200%",
      opacity: [0, 0.5, 0.8, 0.5, 0],
      transition: {
        duration: 1.8,
        repeat: Infinity,
        repeatDelay: 1,
        ease: "easeInOut"
      }
    }
  };

  const bounceVariants: Variants = {
    initial: { y: 0 },
    animate: {
      y: [-1, -4, -1],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatType: "mirror" as const,
        ease: "easeInOut",
        repeatDelay: 0.3
      }
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !isLoading) {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (rect) {
        setClickPosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        });
      }
      setIsPressed(true);
      if (onClick) onClick(event);
      
      // Reset animation state after a short delay
      setTimeout(() => {
        setIsPressed(false);
      }, 300);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setAnimKey(prev => prev + 1); // Restart animations
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseDown = () => {
    if (!disabled && !isLoading) {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      id={id}
      name={name}
      value={value}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${loadingStyles} ${disabledStyles} ${className}`}
      disabled={disabled || isLoading}
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      whileFocus="focus"
      onClick={handleClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      // Add subtle scale transition for all buttons regardless of animation style
      transition={{ 
        type: 'spring',
        stiffness: 500,
        damping: 30
      }}
    >
      {/* Ripple effect - improved positioning based on click location */}
      <AnimatePresence>
        {isPressed && enableClickAnimation && !disabled && !isLoading && (
          <motion.span
            key={`ripple-${animKey}`}
            className="absolute bg-white/30 rounded-full"
            style={{ 
              width: 20, 
              height: 20, 
              left: clickPosition.x - 10, 
              top: clickPosition.y - 10,
            }}
            variants={rippleVariants}
            initial="initial"
            animate="animate"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          />
        )}
      </AnimatePresence>

      {/* Pulse animation */}
      {animationStyle === 'pulse' && enableHoverAnimation && isHovered && !disabled && !isLoading && (
        <motion.span
          key={`pulse-${animKey}`}
          className="absolute inset-0 bg-white/10 rounded-md"
          variants={pulseVariants}
          initial="initial"
          animate="animate"
        />
      )}

      {/* Slide animation */}
      {animationStyle === 'slide' && enableHoverAnimation && !disabled && !isLoading && (
        <motion.span
          key={`slide-${animKey}`}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          variants={slideVariants}
          initial="initial"
          animate="animate"
        />
      )}

      {/* Shine animation */}
      {animationStyle === 'shine' && enableHoverAnimation && !disabled && !isLoading && (
        <motion.span
          key={`shine-${animKey}`}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
          style={{ width: '30%' }}
          variants={shineVariants}
          initial="initial"
          animate="animate"
        />
      )}

      {/* Bounce subtle animation for text */}
      {animationStyle === 'bounce' && enableHoverAnimation && isHovered && !disabled && !isLoading && (
        <motion.span
          key={`bounce-${animKey}`}
          className="absolute inset-0"
          variants={bounceVariants}
          initial="initial"
          animate="animate"
        />
      )}

      {isLoading && (
        <motion.svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </motion.svg>
      )}
      
      {LeftIcon && !isLoading && (
        <motion.span
          className="mr-2"
          variants={iconVariants}
          animate={isHovered ? "hover" : "initial"}
          whileTap="tap"
        >
          <LeftIcon className="w-5 h-5" />
        </motion.span>
      )}
      
      <span className="relative z-10">{children}</span>
      
      {RightIcon && !isLoading && (
        <motion.span
          className="ml-2"
          variants={rightIconVariants}
          animate={isHovered ? "hover" : "initial"}
          whileTap="tap"
        >
          <RightIcon className="w-5 h-5" />
        </motion.span>
      )}

      {/* Focus ring animation */}
      <AnimatePresence>
        {isHovered && enableHoverAnimation && !disabled && !isLoading && animationStyle !== 'none' && (
          <motion.span
            className="absolute -inset-0.5 rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 0.15, 
              scale: 1.02,
              borderRadius: "8px",
              background: variant === 'primary' ? "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0) 70%)" :
                        variant === 'secondary' ? "radial-gradient(circle, rgba(79, 70, 229, 0.3) 0%, rgba(79, 70, 229, 0) 70%)" :
                        variant === 'danger' ? "radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, rgba(239, 68, 68, 0) 70%)" :
                        "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0) 70%)"
            }}
            exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.2 } }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};