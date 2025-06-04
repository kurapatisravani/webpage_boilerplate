import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '../../atoms/Typography/Typography';
import { Button } from '../../atoms/Button/Button';
import { IoClose, IoCheckmark, IoWarning, IoInformation, IoAlert } from 'react-icons/io5';

// Notification types/variants
type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'neutral' | 'custom';

// Notification positions
type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

// Notification animation styles
type AnimationStyle = 'slide' | 'fade' | 'scale' | 'bounce' | 'flip';

// Custom notification appearance
interface NotificationAppearance {
  background?: string;
  textColor?: string;
  iconColor?: string;
  borderColor?: string;
  closeButtonColor?: string;
}

export interface NotificationProps {
  // Content
  title?: React.ReactNode;
  message: React.ReactNode;
  icon?: React.ReactNode;
  
  // Behavior
  visible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
  pauseOnHover?: boolean;
  hideCloseButton?: boolean;
  
  // Style and layout
  type?: NotificationType;
  position?: NotificationPosition;
  animationStyle?: AnimationStyle;
  appearance?: NotificationAppearance;
  maxWidth?: string | number;
  
  // Actions
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  }>;
  
  // HTML props
  className?: string;
  id?: string;
}

export const Notification: React.FC<NotificationProps> = ({
  // Content
  title,
  message,
  icon,
  
  // Behavior
  visible,
  onClose,
  autoClose = true,
  autoCloseDelay = 5000,
  pauseOnHover = true,
  hideCloseButton = false,
  
  // Style and layout
  type = 'neutral',
  position = 'top-right',
  animationStyle = 'slide',
  appearance = {},
  maxWidth = 380,
  
  // Actions
  actions = [],
  
  // HTML props
  className = '',
  id,
}) => {
  // State for controlling the visibility
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  
  // Timer references
  const timerRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  
  // Time tracking for progress bar
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);
  
  // Handle notification close
  const handleClose = () => {
    clearTimers();
    onClose();
  };
  
  // Clear all active timers
  const clearTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };
  
  // Pause the auto-close timer
  const pauseTimer = () => {
    if (pauseOnHover && autoClose) {
      setIsPaused(true);
      
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      
      // Store how much time has elapsed
      pausedTimeRef.current = Date.now();
      elapsedRef.current += pausedTimeRef.current - startTimeRef.current;
    }
  };
  
  // Resume the auto-close timer
  const resumeTimer = () => {
    if (pauseOnHover && autoClose) {
      setIsPaused(false);
      
      const remainingTime = autoCloseDelay - elapsedRef.current;
      
      if (remainingTime > 0) {
        startTimeRef.current = Date.now();
        
        // Restart the close timer
        timerRef.current = window.setTimeout(() => {
          handleClose();
        }, remainingTime);
        
        // Update progress
        const progressStep = 10; // Update every 10ms
        progressIntervalRef.current = window.setInterval(() => {
          const now = Date.now();
          const totalElapsed = elapsedRef.current + (now - startTimeRef.current);
          const newProgress = Math.max(0, 100 - (totalElapsed / autoCloseDelay) * 100);
          
          setProgress(newProgress);
          
          if (newProgress <= 0) {
            clearInterval(progressIntervalRef.current!);
          }
        }, progressStep);
      }
    }
  };
  
  // Set up auto-close timer when notification becomes visible
  useEffect(() => {
    if (visible && autoClose) {
      // Reset state
      elapsedRef.current = 0;
      startTimeRef.current = Date.now();
      setProgress(100);
      
      // Set the auto-close timer
      timerRef.current = window.setTimeout(() => {
        handleClose();
      }, autoCloseDelay);
      
      // Set up progress bar
      const progressStep = 10; // Update every 10ms
      progressIntervalRef.current = window.setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTimeRef.current;
        const newProgress = Math.max(0, 100 - (elapsed / autoCloseDelay) * 100);
        
        setProgress(newProgress);
        
        if (newProgress <= 0) {
          clearInterval(progressIntervalRef.current!);
        }
      }, progressStep);
      
      return () => {
        clearTimers();
      };
    }
    
    return () => {
      clearTimers();
    };
  }, [visible, autoClose, autoCloseDelay]);
  
  // Get default icon based on notification type
  const getDefaultIcon = () => {
    switch (type) {
      case 'success':
        return <IoCheckmark size={22} />;
      case 'error':
        return <IoAlert size={22} />;
      case 'warning':
        return <IoWarning size={22} />;
      case 'info':
        return <IoInformation size={22} />;
      default:
        return null;
    }
  };
  
  // Variant styles
  const typeStyles = {
    success: 'bg-success/10 border-l-4 border-success text-success',
    error: 'bg-error/10 border-l-4 border-error text-error',
    warning: 'bg-warning/10 border-l-4 border-warning text-warning',
    info: 'bg-info/10 border-l-4 border-info text-info',
    neutral: 'bg-bg-surface border-l-4 border-primary text-text-base',
    custom: '',
  };
  
  // Icon color styles
  const iconColorStyles = {
    success: 'text-success',
    error: 'text-error',
    warning: 'text-warning',
    info: 'text-info',
    neutral: 'text-primary',
    custom: appearance.iconColor || '',
  };
  
  // Position styles
  const positionStyles = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };
  
  // Animation variants
  const animationVariants = {
    slide: {
      initial: { 
        opacity: 0,
        x: position.includes('left') ? -100 : position.includes('right') ? 100 : 0,
        y: position.includes('top') ? -20 : position.includes('bottom') ? 20 : 0,
      },
      animate: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: { duration: 0.3, ease: "easeOut" }
      },
      exit: { 
        opacity: 0,
        x: position.includes('left') ? -100 : position.includes('right') ? 100 : 0,
        y: position.includes('top') ? -20 : position.includes('bottom') ? 20 : 0,
        transition: { duration: 0.2, ease: "easeIn" }
      }
    },
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.3 } },
      exit: { opacity: 0, transition: { duration: 0.2 } }
    },
    scale: {
      initial: { opacity: 0, scale: 0.85 },
      animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
      exit: { opacity: 0, scale: 0.85, transition: { duration: 0.2 } }
    },
    bounce: {
      initial: { opacity: 0, scale: 0.8, y: position.includes('top') ? -50 : 50 },
      animate: { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: { 
          type: "spring", 
          stiffness: 400, 
          damping: 15 
        } 
      },
      exit: { 
        opacity: 0, 
        scale: 0.8, 
        y: position.includes('top') ? -30 : 30,
        transition: { duration: 0.2 } 
      }
    },
    flip: {
      initial: { 
        opacity: 0, 
        rotateX: position.includes('top') ? 90 : -90 
      },
      animate: { 
        opacity: 1, 
        rotateX: 0,
        transition: { duration: 0.4 } 
      },
      exit: { 
        opacity: 0, 
        rotateX: position.includes('top') ? 90 : -90,
        transition: { duration: 0.3 } 
      }
    }
  };
  
  // Custom styles
  const customStyles = {
    backgroundColor: appearance.background,
    color: appearance.textColor,
    borderColor: appearance.borderColor,
    maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
  };
  
  // Combined classes
  const combinedClasses = [
    'shadow-md rounded-md overflow-hidden relative',
    type !== 'custom' ? typeStyles[type] : '',
    className,
  ].filter(Boolean).join(' ');
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id={id}
          className={`fixed ${positionStyles[position]} z-50 ${combinedClasses}`}
          style={type === 'custom' ? customStyles : {
            maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
          }}
          variants={animationVariants[animationStyle]}
          initial="initial"
          animate="animate"
          exit="exit"
          onMouseEnter={pauseTimer}
          onMouseLeave={resumeTimer}
        >
          {/* Main content container */}
          <div className="flex p-4">
            {/* Icon */}
            {(icon || getDefaultIcon()) && (
              <div className={`mr-3 ${iconColorStyles[type]} flex-shrink-0`}>
                {icon || getDefaultIcon()}
              </div>
            )}
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Title */}
              {title && (
                <div className="font-medium mb-1">
                  {typeof title === 'string' ? (
                    <Typography variant="subtitle2" weight="semibold">
                      {title}
                    </Typography>
                  ) : (
                    title
                  )}
                </div>
              )}
              
              {/* Message */}
              <div className={title ? 'mt-1' : ''}>
                {typeof message === 'string' ? (
                  <Typography variant="body2">
                    {message}
                  </Typography>
                ) : (
                  message
                )}
              </div>
              
              {/* Actions */}
              {actions.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {actions.map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant || 'primary'}
                      size="sm"
                      onClick={() => {
                        action.onClick();
                        // Don't auto-close when an action is clicked unless the action calls onClose
                      }}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Close button */}
            {!hideCloseButton && (
              <button
                className={`ml-3 flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors ${
                  appearance.closeButtonColor ? `text-${appearance.closeButtonColor}` : ''
                }`}
                onClick={handleClose}
              >
                <IoClose size={18} />
              </button>
            )}
          </div>
          
          {/* Progress bar */}
          {autoClose && !isPaused && (
            <motion.div
              className="h-1 bg-current opacity-30"
              initial={{ width: '100%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: 'linear' }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification; 