import React, { useState, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';

export type SwitchSize = 'sm' | 'md' | 'lg';
export type SwitchColorScheme = 'primary' | 'secondary' | 'success' | 'error' | 'warning';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  // Core functionality
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  
  // Appearance
  label?: React.ReactNode;
  size?: SwitchSize;
  colorScheme?: SwitchColorScheme;
  thumbIcon?: React.ReactNode;
  checkedIcon?: React.ReactNode;
  uncheckedIcon?: React.ReactNode;
  
  // Behavior
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  
  // Animation
  enableAnimation?: boolean;
  animationStyle?: 'bounce' | 'elastic' | 'smooth' | 'none';
  
  // Layout
  labelPlacement?: 'start' | 'end' | 'top' | 'bottom';
  
  // HTML props
  className?: string;
  id?: string;
  name?: string;
  value?: string | number;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(({
  // Core functionality
  checked,
  defaultChecked,
  onChange,
  onFocus,
  onBlur,
  
  // Appearance
  label,
  size = 'md',
  colorScheme = 'primary',
  thumbIcon,
  checkedIcon,
  uncheckedIcon,
  
  // Behavior
  disabled = false,
  required = false,
  readOnly = false,
  
  // Animation
  enableAnimation = true,
  animationStyle = 'elastic',
  
  // Layout
  labelPlacement = 'end',
  
  // HTML props
  className = '',
  id,
  name,
  value,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  
  ...props
}, ref) => {
  // Internal state for controlled/uncontrolled component
  const [isChecked, setIsChecked] = useState<boolean>(checked !== undefined ? checked : defaultChecked !== undefined ? defaultChecked : false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isPressed, setIsPressed] = useState<boolean>(false);
  
  // Generate unique ID if not provided
  const uniqueId = React.useId();
  const switchId = id || `switch-${uniqueId}`;
  
  // Update internal state when controlled prop changes
  useEffect(() => {
    if (checked !== undefined) {
      setIsChecked(checked);
    }
  }, [checked]);
  
  // Handle changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;
    
    if (checked === undefined) {
      setIsChecked(e.target.checked);
    }
    
    if (onChange) {
      onChange(e);
    }
  };
  
  // Handle focus events
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };
  
  // Handle blur events
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  // Handle mouse down
  const handleMouseDown = () => {
    if (!disabled && !readOnly) {
      setIsPressed(true);
    }
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setIsPressed(false);
  };
  
  // Size configurations
  const sizeConfig = {
    sm: {
      track: 'w-8 h-4',
      thumb: 'w-3 h-3',
      label: 'text-xs',
      icon: 'w-2 h-2',
      thumbOffsetChecked: 'calc(100% - 12px)'
    },
    md: {
      track: 'w-10 h-5',
      thumb: 'w-4 h-4',
      label: 'text-sm',
      icon: 'w-2.5 h-2.5',
      thumbOffsetChecked: 'calc(100% - 16px)'
    },
    lg: {
      track: 'w-14 h-7',
      thumb: 'w-6 h-6',
      label: 'text-base',
      icon: 'w-3 h-3',
      thumbOffsetChecked: 'calc(100% - 24px)'
    }
  };
  
  // Label placement styles
  const labelPlacementClasses = {
    start: 'flex-row-reverse space-x-reverse space-x-3',
    end: 'flex-row space-x-3',
    top: 'flex-col-reverse space-y-reverse space-y-2',
    bottom: 'flex-col space-y-2',
  };
  
  // Track animation variants
  const trackVariants: Variants = {
    unchecked: {
      backgroundColor: 'var(--color-bg-muted)',
      transition: { duration: 0.2 }
    },
    checked: {
      backgroundColor: `var(--color-${colorScheme})`,
      transition: { duration: 0.2 }
    }
  };
  
  // Ripple animation variants
  const rippleVariants: Variants = {
    initial: { scale: 0, opacity: 0.5 },
    animate: { 
      scale: 1.5,
      opacity: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };
  
  // Container animation variants
  const containerVariants: Variants = {
    initial: { opacity: 0, y: 5 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut" 
      }
    }
  };
  
  // Combined class names
  const containerClasses = [
    'flex items-center',
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    labelPlacementClasses[labelPlacement],
    className,
  ].filter(Boolean).join(' ');
  
  // Track classes
  const trackClasses = [
    'relative rounded-full transition-colors duration-200',
    sizeConfig[size].track,
    isFocused && !disabled 
      ? `ring-2 ring-${colorScheme}/30`
      : '',
    disabled ? 'opacity-50' : '',
  ].filter(Boolean).join(' ');
  
  // Thumb classes
  const thumbClasses = [
    'absolute rounded-full bg-white shadow-md',
    sizeConfig[size].thumb,
    'flex items-center justify-center top-1/2 -translate-y-1/2',
  ].filter(Boolean).join(' ');
  
  // Calculate thumb position
  const getThumbStyle = () => {
    // Starting position (unchecked)
    const startPosition = '2px';
    
    // End position (checked)
    const endPosition = sizeConfig[size].thumbOffsetChecked;
    
    const position = isChecked ? endPosition : startPosition;
    
    // Spring transition based on animation style
    let transition = '';
    if (animationStyle === 'elastic') {
      transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    } else if (animationStyle === 'bounce') {
      transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
    } else if (animationStyle === 'smooth') {
      transition = 'all 0.2s ease-in-out';
    } else {
      transition = 'none';
    }
    
    return {
      left: position,
      transition: enableAnimation ? transition : 'none'
    };
  };
  
  // Handle click on the label (for better UX)
  const handleLabelClick = (e: React.MouseEvent) => {
    // Prevent the default label behavior to handle it manually
    e.preventDefault();
    
    if (disabled || readOnly) return;
    
    // Create a synthetic change event
    const syntheticEvent = {
      target: { checked: !isChecked },
      currentTarget: { checked: !isChecked },
      preventDefault: () => {},
      stopPropagation: () => {}
    } as React.ChangeEvent<HTMLInputElement>;
    
    // Update the internal state if uncontrolled
    if (checked === undefined) {
      setIsChecked(!isChecked);
    }
    
    // Call the onChange handler if provided
    if (onChange) {
      onChange(syntheticEvent);
    }
  };

  // Calculate ripple position
  const getRipplePosition = () => {
    const rippleOffset = {
      sm: { left: isChecked ? 'calc(100% - 8px)' : '8px' },
      md: { left: isChecked ? 'calc(100% - 10px)' : '10px' },
      lg: { left: isChecked ? 'calc(100% - 14px)' : '14px' }
    };
    
    return rippleOffset[size].left;
  };
  
  return (
    <motion.div
      className={containerClasses}
      initial={enableAnimation ? "initial" : false}
      animate={enableAnimation ? "animate" : false}
      variants={containerVariants}
    >
      <label
        htmlFor={switchId}
        className="inline-flex relative items-center cursor-pointer select-none"
        onClick={handleLabelClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div className="relative">
          {/* Hidden actual input for accessibility */}
          <input
            ref={ref}
            type="checkbox"
            id={switchId}
            name={name}
            value={value}
            checked={isChecked}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            readOnly={readOnly}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            className="sr-only" // Visually hidden but accessible
            {...props}
          />
          
          {/* Custom switch visual */}
          <motion.div 
            className={trackClasses}
            variants={trackVariants}
            animate={isChecked ? "checked" : "unchecked"}
            data-state={isChecked ? "checked" : "unchecked"}
          >
            {/* Icons in track */}
            <div className="absolute inset-0 flex justify-between items-center px-1 pointer-events-none">
              {checkedIcon && (
                <div className={`text-white ${sizeConfig[size].icon} ${isChecked ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                  {checkedIcon}
                </div>
              )}
              {uncheckedIcon && (
                <div className={`text-text-muted ml-auto ${sizeConfig[size].icon} ${isChecked ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
                  {uncheckedIcon}
                </div>
              )}
            </div>
            
            {/* Thumb/Handle */}
            <div
              className={thumbClasses}
              style={getThumbStyle()}
            >
              {thumbIcon && (
                <div className="absolute inset-0 flex items-center justify-center text-text-muted">
                  {thumbIcon}
                </div>
              )}
            </div>

            {/* Ripple effect */}
            <AnimatePresence>
              {isPressed && !disabled && (
                <motion.span
                  key="ripple"
                  className="absolute rounded-full"
                  style={{ 
                    width: size === 'sm' ? '18px' : size === 'md' ? '22px' : '28px', 
                    height: size === 'sm' ? '18px' : size === 'md' ? '22px' : '28px',
                    backgroundColor: isChecked 
                      ? `var(--color-${colorScheme}, rgba(29, 78, 216, 0.2))`
                      : 'rgba(107, 114, 128, 0.2)',
                    opacity: 0.5,
                    left: getRipplePosition(),
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  variants={rippleVariants}
                  initial="initial"
                  animate="animate"
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        
        {/* Label text */}
        {label && (
          <span className={`
            ${sizeConfig[size].label} 
            ${disabled ? 'text-text-muted' : 'text-text'}
          `}>
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        )}
      </label>
    </motion.div>
  );
});

Switch.displayName = 'Switch';

export default Switch; 