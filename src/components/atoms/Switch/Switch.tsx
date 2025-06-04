import React, { useState, useEffect, forwardRef } from 'react';
import { motion } from 'framer-motion';
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
  const [isHovered, setIsHovered] = useState<boolean>(false);
  
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
  
  // Size styles for switch track
  const trackSizeClasses = {
    sm: 'w-7 h-4',
    md: 'w-9 h-5',
    lg: 'w-12 h-6',
  };
  
  // Size styles for switch thumb
  const thumbSizeClasses = {
    sm: 'w-3 h-3 translate-x-0.5',
    md: 'w-4 h-4 translate-x-0.5',
    lg: 'w-5 h-5 translate-x-0.5',
  };
  
  // Checked thumb position
  const thumbCheckedPosition = {
    sm: 'translate-x-3',
    md: 'translate-x-4',
    lg: 'translate-x-6',
  };
  
  // Size styles for label
  const labelSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  
  // Size styles for icons
  const iconSizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };
  
  // Color scheme styles
  const colorSchemeClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-success',
    error: 'bg-error',
    warning: 'bg-warning',
  };
  
  // Label placement styles
  const labelPlacementClasses = {
    start: 'flex-row-reverse space-x-reverse space-x-2',
    end: 'flex-row space-x-2',
    top: 'flex-col-reverse space-y-reverse space-y-1',
    bottom: 'flex-col space-y-1',
  };
  
  // Animation variants for thumb
  const thumbVariants: Variants = {
    unchecked: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 30
      }
    },
    checked: {
      x: size === 'sm' ? 12 : size === 'md' ? 16 : 24,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 30
      }
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
    trackSizeClasses[size],
    isChecked 
      ? colorSchemeClasses[colorScheme] 
      : 'bg-bg-surface-hover',
    isFocused && !disabled 
      ? `ring-2 ring-${colorScheme}/30` 
      : '',
  ].filter(Boolean).join(' ');
  
  // Thumb classes
  const thumbClasses = [
    'absolute rounded-full bg-white shadow transform transition-transform',
    thumbSizeClasses[size],
    isChecked ? thumbCheckedPosition[size] : '',
  ].filter(Boolean).join(' ');
  
  return (
    <motion.label
      htmlFor={switchId}
      className={containerClasses}
      initial={enableAnimation ? "initial" : false}
      animate={enableAnimation ? "animate" : false}
      variants={containerVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        <div className={trackClasses}>
          {/* Icons in track */}
          <div className="absolute inset-0 flex justify-between items-center px-1.5 pointer-events-none">
            {checkedIcon && (
              <div className={`text-white ${iconSizeClasses[size]} ${isChecked ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                {checkedIcon}
              </div>
            )}
            {uncheckedIcon && (
              <div className={`text-text-muted ${iconSizeClasses[size]} ${isChecked ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
                {uncheckedIcon}
              </div>
            )}
          </div>
          
          {/* Thumb/Handle */}
          <motion.div
            className={thumbClasses}
            variants={thumbVariants}
            animate={isChecked ? 'checked' : 'unchecked'}
          >
            {thumbIcon && (
              <div className="absolute inset-0 flex items-center justify-center text-text-muted">
                {thumbIcon}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Label text */}
      {label && (
        <span className={`
          ${labelSizeClasses[size]} 
          ${disabled ? 'text-text-muted' : 'text-text-base'}
        `}>
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </span>
      )}
    </motion.label>
  );
});

Switch.displayName = 'Switch';

export default Switch; 