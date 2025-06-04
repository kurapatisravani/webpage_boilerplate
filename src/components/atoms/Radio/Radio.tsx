import React, { useState, useEffect, forwardRef } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

export type RadioSize = 'sm' | 'md' | 'lg';
export type RadioColorScheme = 'primary' | 'secondary' | 'success' | 'error' | 'warning';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  // Core functionality
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  
  // Appearance
  label?: React.ReactNode;
  size?: RadioSize;
  colorScheme?: RadioColorScheme;
  
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

export const Radio = forwardRef<HTMLInputElement, RadioProps>(({
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
  const radioId = id || `radio-${uniqueId}`;
  
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
  
  // Size styles for radio
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };
  
  // Size styles for inner dot
  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };
  
  // Size styles for label
  const labelSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  
  // Color scheme styles
  const colorSchemeClasses = {
    primary: 'text-primary border-primary-600 focus:ring-primary',
    secondary: 'text-secondary border-secondary-600 focus:ring-secondary',
    success: 'text-success border-success-600 focus:ring-success',
    error: 'text-error border-error-600 focus:ring-error',
    warning: 'text-warning border-warning-600 focus:ring-warning',
  };
  
  // Label placement styles
  const labelPlacementClasses = {
    start: 'flex-row-reverse space-x-reverse space-x-2',
    end: 'flex-row space-x-2',
    top: 'flex-col-reverse space-y-reverse space-y-1',
    bottom: 'flex-col space-y-1',
  };
  
  // Animation variants
  const dotVariants: Variants = {
    unchecked: { 
      opacity: 0, 
      scale: 0.5 
    },
    checked: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.1,
        ease: "easeOut"
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
  
  return (
    <motion.label
      htmlFor={radioId}
      className={containerClasses}
      initial={enableAnimation ? "initial" : false}
      animate={enableAnimation ? "animate" : false}
      variants={containerVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex items-center justify-center">
        {/* Hidden actual input for accessibility */}
        <input
          ref={ref}
          type="radio"
          id={radioId}
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
        
        {/* Custom radio visual */}
        <div 
          className={`
            relative border rounded-full flex items-center justify-center 
            ${sizeClasses[size]} 
            ${isChecked ? `border-${colorScheme}` : 'border-border'} 
            ${isFocused ? `ring-2 ring-${colorScheme}/30` : ''} 
            ${isHovered && !disabled ? 'shadow-sm' : ''}
            transition-all duration-150
          `}
        >
          {/* Inner dot */}
          <motion.div
            initial={false}
            animate={isChecked ? 'checked' : 'unchecked'}
            variants={dotVariants}
            className={`
              rounded-full bg-${colorScheme} 
              ${dotSizeClasses[size]} 
            `}
          />
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

Radio.displayName = 'Radio';

export default Radio; 