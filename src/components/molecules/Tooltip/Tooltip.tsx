import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '../../atoms/Typography/Typography';

// Tooltip positions
type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

// Tooltip variants
type TooltipVariant = 'light' | 'dark' | 'primary' | 'custom';

// Tooltip animation styles
type AnimationStyle = 'fade' | 'scale' | 'slide' | 'zoom' | 'bounce';

// Tooltip appearance
interface TooltipAppearance {
  background?: string;
  textColor?: string;
  borderColor?: string;
  borderRadius?: string;
  arrowSize?: number;
}

export interface TooltipProps {
  // Core content
  content: React.ReactNode;
  children: React.ReactNode;
  
  // Style and layout
  position?: TooltipPosition;
  offset?: number;
  variant?: TooltipVariant;
  maxWidth?: string | number;
  animationStyle?: AnimationStyle;
  appearance?: TooltipAppearance;
  delay?: number;
  duration?: number;
  
  // Behavior
  trigger?: 'hover' | 'click' | 'focus';
  isOpen?: boolean;
  defaultOpen?: boolean;
  autoClose?: boolean;
  autoCloseDelay?: number;
  interactive?: boolean;
  portal?: boolean;
  
  // HTML props
  className?: string;
  id?: string;
  onOpen?: () => void;
  onClose?: () => void;
}

export const Tooltip: React.FC<TooltipProps> = ({
  // Core content
  content,
  children,
  
  // Style and layout
  position = 'top',
  offset = 8,
  variant = 'dark',
  maxWidth = 250,
  animationStyle = 'fade',
  appearance = {},
  delay = 200,
  duration = 200,
  
  // Behavior
  trigger = 'hover',
  isOpen: controlledIsOpen,
  defaultOpen = false,
  autoClose = true,
  autoCloseDelay = 3000,
  interactive = false,
  portal = false,
  
  // HTML props
  className = '',
  id,
  onOpen,
  onClose,
}) => {
  // For controlled/uncontrolled usage
  const isControlled = controlledIsOpen !== undefined;
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(defaultOpen);
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;
  
  // Refs
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const autoCloseTimeoutRef = useRef<number | null>(null);
  
  // State for positioning
  const [tooltipCoords, setTooltipCoords] = useState({ x: 0, y: 0 });
  const [arrowCoords, setArrowCoords] = useState({ x: 0, y: 0 });
  
  // Handle showing the tooltip
  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (delay > 0) {
      timeoutRef.current = window.setTimeout(() => {
        if (!isControlled) {
          setUncontrolledIsOpen(true);
        }
        if (onOpen) onOpen();
        
        // Set auto-close timer if enabled
        if (autoClose && autoCloseDelay > 0) {
          if (autoCloseTimeoutRef.current) {
            clearTimeout(autoCloseTimeoutRef.current);
          }
          autoCloseTimeoutRef.current = window.setTimeout(() => {
            hideTooltip();
          }, autoCloseDelay);
        }
      }, delay);
    } else {
      if (!isControlled) {
        setUncontrolledIsOpen(true);
      }
      if (onOpen) onOpen();
      
      // Set auto-close timer if enabled
      if (autoClose && autoCloseDelay > 0) {
        if (autoCloseTimeoutRef.current) {
          clearTimeout(autoCloseTimeoutRef.current);
        }
        autoCloseTimeoutRef.current = window.setTimeout(() => {
          hideTooltip();
        }, autoCloseDelay);
      }
    }
  };
  
  // Handle hiding the tooltip
  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (!isControlled) {
      setUncontrolledIsOpen(false);
    }
    if (onClose) onClose();
    
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current);
      autoCloseTimeoutRef.current = null;
    }
  };
  
  // Update tooltip position based on trigger element position
  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    let x = 0;
    let y = 0;
    let arrowX = 0;
    let arrowY = 0;
    
    // Calculate position based on direction
    switch (position) {
      case 'top':
        x = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
        y = triggerRect.top - tooltipRect.height - offset;
        arrowX = tooltipRect.width / 2;
        arrowY = tooltipRect.height;
        break;
        
      case 'bottom':
        x = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
        y = triggerRect.bottom + offset;
        arrowX = tooltipRect.width / 2;
        arrowY = 0;
        break;
        
      case 'left':
        x = triggerRect.left - tooltipRect.width - offset;
        y = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
        arrowX = tooltipRect.width;
        arrowY = tooltipRect.height / 2;
        break;
        
      case 'right':
        x = triggerRect.right + offset;
        y = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
        arrowX = 0;
        arrowY = tooltipRect.height / 2;
        break;
    }
    
    // Prevent tooltip from going off-screen
    if (x < 10) {
      const diff = 10 - x;
      x = 10;
      // Adjust arrow position when correcting for off-screen
      if (position === 'top' || position === 'bottom') {
        arrowX -= diff;
      }
    } else if (x + tooltipRect.width > windowWidth - 10) {
      const diff = (x + tooltipRect.width) - (windowWidth - 10);
      x = windowWidth - 10 - tooltipRect.width;
      // Adjust arrow position when correcting for off-screen
      if (position === 'top' || position === 'bottom') {
        arrowX += diff;
      }
    }
    
    if (y < 10) {
      const diff = 10 - y;
      y = 10;
      // Adjust arrow position when correcting for off-screen
      if (position === 'left' || position === 'right') {
        arrowY -= diff;
      }
    } else if (y + tooltipRect.height > windowHeight - 10) {
      const diff = (y + tooltipRect.height) - (windowHeight - 10);
      y = windowHeight - 10 - tooltipRect.height;
      // Adjust arrow position when correcting for off-screen
      if (position === 'left' || position === 'right') {
        arrowY += diff;
      }
    }
    
    setTooltipCoords({ x, y });
    setArrowCoords({ x: arrowX, y: arrowY });
  };
  
  // Handle click events
  const handleClick = (e: React.MouseEvent) => {
    if (trigger === 'click') {
      if (isOpen) {
        hideTooltip();
      } else {
        showTooltip();
      }
    }
  };
  
  // Handle mouse events
  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      showTooltip();
    }
  };
  
  const handleMouseLeave = () => {
    if (trigger === 'hover' && !interactive) {
      hideTooltip();
    }
  };
  
  // Handle focus events
  const handleFocus = () => {
    if (trigger === 'focus') {
      showTooltip();
    }
  };
  
  const handleBlur = () => {
    if (trigger === 'focus') {
      hideTooltip();
    }
  };
  
  // Interactive tooltip mouse events
  const handleTooltipMouseEnter = () => {
    if (trigger === 'hover' && interactive) {
      // Clear any pending hide timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      // Also clear auto-close timer
      if (autoCloseTimeoutRef.current) {
        clearTimeout(autoCloseTimeoutRef.current);
        autoCloseTimeoutRef.current = null;
      }
    }
  };
  
  const handleTooltipMouseLeave = () => {
    if (trigger === 'hover' && interactive) {
      hideTooltip();
    }
  };
  
  // Update position when tooltip is open or window is resized
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure the tooltip is rendered before measuring
      const positionTimer = setTimeout(() => {
        updatePosition();
      }, 10);
      
      return () => clearTimeout(positionTimer);
    }
  }, [isOpen, content, position]);
  
  // Add window resize listener
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        updatePosition();
      }
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [isOpen]);
  
  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (autoCloseTimeoutRef.current) {
        clearTimeout(autoCloseTimeoutRef.current);
      }
    };
  }, []);
  
  // Handle document click to close tooltip when clicking outside
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (
        isOpen &&
        trigger === 'click' &&
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        hideTooltip();
      }
    };
    
    document.addEventListener('mousedown', handleDocumentClick);
    
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [isOpen, trigger]);
  
  // Variant styles
  const variantStyles = {
    dark: 'bg-bg-dark text-white',
    light: 'bg-white text-text-base border border-border',
    primary: 'bg-primary text-white',
    custom: '',
  };
  
  // Animation variants
  const tooltipAnimationVariants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: duration / 1000 } },
      exit: { opacity: 0, transition: { duration: duration / 1000 } },
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1, transition: { duration: duration / 1000 } },
      exit: { opacity: 0, scale: 0.8, transition: { duration: duration / 1000 } },
    },
    slide: {
      initial: { opacity: 0, y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0, x: position === 'left' ? 10 : position === 'right' ? -10 : 0 },
      animate: { opacity: 1, y: 0, x: 0, transition: { duration: duration / 1000 } },
      exit: { opacity: 0, y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0, x: position === 'left' ? 10 : position === 'right' ? -10 : 0, transition: { duration: duration / 1000 } },
    },
    zoom: {
      initial: { opacity: 0, scale: 0.5 },
      animate: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 15, stiffness: 300 } },
      exit: { opacity: 0, scale: 0.5, transition: { duration: duration / 1000 } },
    },
    bounce: {
      initial: { opacity: 0, scale: 0.7 },
      animate: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 8, stiffness: 300 } },
      exit: { opacity: 0, scale: 0.7, transition: { duration: duration / 1000 } },
    },
  };
  
  // Custom styles
  const tooltipStyles = {
    backgroundColor: appearance.background,
    color: appearance.textColor,
    borderColor: appearance.borderColor,
    borderRadius: appearance.borderRadius || '0.375rem',
    maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
  };
  
  // Arrow styles
  const getArrowStyles = () => {
    const arrowSize = appearance.arrowSize || 6;
    const baseArrowStyles = {
      position: 'absolute',
      width: 0,
      height: 0,
      borderStyle: 'solid',
    };
    
    const arrowPositionStyles = {
      top: {
        bottom: -arrowSize,
        left: arrowCoords.x,
        marginLeft: -arrowSize,
        borderWidth: `${arrowSize}px ${arrowSize}px 0`,
        borderColor: `${appearance.background || getDefaultBgColor()} transparent transparent transparent`,
      },
      bottom: {
        top: -arrowSize,
        left: arrowCoords.x,
        marginLeft: -arrowSize,
        borderWidth: `0 ${arrowSize}px ${arrowSize}px`,
        borderColor: `transparent transparent ${appearance.background || getDefaultBgColor()} transparent`,
      },
      left: {
        right: -arrowSize,
        top: arrowCoords.y,
        marginTop: -arrowSize,
        borderWidth: `${arrowSize}px 0 ${arrowSize}px ${arrowSize}px`,
        borderColor: `transparent transparent transparent ${appearance.background || getDefaultBgColor()}`,
      },
      right: {
        left: -arrowSize,
        top: arrowCoords.y,
        marginTop: -arrowSize,
        borderWidth: `${arrowSize}px ${arrowSize}px ${arrowSize}px 0`,
        borderColor: `transparent ${appearance.background || getDefaultBgColor()} transparent transparent`,
      },
    };
    
    return {
      ...baseArrowStyles,
      ...arrowPositionStyles[position],
    };
  };
  
  // Get default background color based on variant
  const getDefaultBgColor = () => {
    switch (variant) {
      case 'dark': return '#1f2937';
      case 'light': return '#ffffff';
      case 'primary': return 'var(--color-primary)';
      default: return '#1f2937';
    }
  };
  
  // Combine the trigger element with event handlers
  const triggerElement = (
    <div
      ref={triggerRef}
      className="inline-block"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
    </div>
  );
  
  // Tooltip content element
  const tooltipElement = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={tooltipRef}
          id={id}
          className={`fixed z-50 px-3 py-2 text-sm shadow-md ${variantStyles[variant]} ${className}`}
          style={{
            ...tooltipStyles,
            top: tooltipCoords.y,
            left: tooltipCoords.x,
            pointerEvents: interactive ? 'auto' : 'none',
          }}
          initial={tooltipAnimationVariants[animationStyle].initial}
          animate={tooltipAnimationVariants[animationStyle].animate}
          exit={tooltipAnimationVariants[animationStyle].exit}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
        >
          {typeof content === 'string' ? (
            <Typography variant="body2">
              {content}
            </Typography>
          ) : (
            content
          )}
          
          {/* Arrow element */}
          <div style={getArrowStyles() as React.CSSProperties} />
        </motion.div>
      )}
    </AnimatePresence>
  );
  
  // Render the tooltip
  if (portal) {
    // If portal prop is true, we need to use ReactDOM.createPortal
    // but since we can't directly use it here, we'll just return the elements
    // and let the consumer handle the portal part
    return (
      <>
        {triggerElement}
        {tooltipElement}
      </>
    );
  }
  
  return (
    <>
      {triggerElement}
      {tooltipElement}
    </>
  );
};

export default Tooltip; 