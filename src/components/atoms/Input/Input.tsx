import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '../Typography/Typography';

// Input size variants
type InputSize = 'sm' | 'md' | 'lg';

// Input variants
type InputVariant = 'outlined' | 'filled' | 'underlined' | 'unstyled';

// Input animation styles
type AnimationStyle = 'grow' | 'highlight' | 'bounce' | 'none';

// Common input types
type InputType = 
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'time'
  | 'datetime-local';

// Input state for validation
type ValidationState = 'default' | 'success' | 'error' | 'warning';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  // Appearance
  label?: string;
  helperText?: string;
  size?: InputSize;
  variant?: InputVariant;
  animationStyle?: AnimationStyle;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  
  // Validation
  validationState?: ValidationState;
  
  // Animation controls
  enableFocusAnimation?: boolean;
  enableHoverAnimation?: boolean;
  enableValidationAnimation?: boolean;
  animationDuration?: number;
  
  // Special behaviors
  revealPassword?: boolean;
  clearable?: boolean;
  
  // Callback for when clear button is clicked
  onClear?: () => void;
}

export const Input: React.FC<InputProps> = ({
  // Appearance props
  label,
  helperText,
  size = 'md',
  variant = 'outlined',
  animationStyle = 'grow',
  fullWidth = false,
  leftIcon,
  rightIcon,
  
  // Validation
  validationState = 'default',
  
  // Animation controls
  enableFocusAnimation = true,
  enableHoverAnimation = true,
  enableValidationAnimation = true,
  animationDuration = 0.2,
  
  // Special behaviors
  revealPassword = false,
  clearable = false,
  
  // Events
  onClear,
  onChange,
  onFocus,
  onBlur,
  
  // Native input props
  type = 'text',
  className = '',
  placeholder,
  disabled,
  required,
  readOnly,
  value,
  defaultValue,
  id,
  name,
  autoComplete,
  autoFocus,
  min,
  max,
  minLength,
  maxLength,
  pattern,
  ...props
}) => {
  // State management
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [inputValue, setInputValue] = useState(value || defaultValue || '');
  const [showPassword, setShowPassword] = useState(false);
  const [hasBeenFocused, setHasBeenFocused] = useState(false);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const labelRef = useRef<HTMLLabelElement>(null);
  
  // Effects
  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);
  
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
      setHasBeenFocused(true);
    }
    
    // Start entrance animation
    setTimeout(() => {
      setHasAnimatedIn(true);
    }, 100);
  }, [autoFocus]);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (value === undefined) {
      setInputValue(newValue);
    }
    
    if (onChange) {
      onChange(e);
    }
  };
  
  // Handle input focus
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    setHasBeenFocused(true);
    setAnimationKey(prev => prev + 1);
    
    if (onFocus) {
      onFocus(e);
    }
  };
  
  // Handle input blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    
    if (onBlur) {
      onBlur(e);
    }
  };
  
  // Handle input hover
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  
  // Handle password toggle
  const togglePassword = () => {
    setShowPassword(prev => !prev);
  };
  
  // Handle input clear
  const handleClear = () => {
    if (value === undefined) {
      setInputValue('');
    }
    
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
      
      // Create a synthetic event to trigger onChange
      const event = new Event('input', { bubbles: true });
      inputRef.current.dispatchEvent(event);
    }
    
    if (onClear) {
      onClear();
    }
  };
  
  // Base classnames
  const sizeClasses = {
    sm: 'h-8 text-sm px-2 py-1',
    md: 'h-10 text-base px-3 py-2',
    lg: 'h-12 text-lg px-4 py-3',
  };
  
  const variantClasses = {
    outlined: 'border rounded-md bg-transparent',
    filled: 'border-0 rounded-md bg-bg-surface',
    underlined: 'border-0 border-b rounded-none bg-transparent',
    unstyled: 'border-0 bg-transparent',
  };
  
  const validationStateClasses = {
    default: 'border-border focus:border-primary',
    success: 'border-success focus:border-success',
    error: 'border-error focus:border-error',
    warning: 'border-warning focus:border-warning',
  };
  
  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };
  
  const labelSizeClasses = {
    sm: 'text-xs mb-1',
    md: 'text-sm mb-1',
    lg: 'text-base mb-2',
  };
  
  const helperTextSizeClasses = {
    sm: 'text-xs mt-1',
    md: 'text-xs mt-1',
    lg: 'text-sm mt-1.5',
  };
  
  const validationIconColors = {
    default: 'text-text-muted',
    success: 'text-success',
    error: 'text-error',
    warning: 'text-warning',
  };
  
  // Combined classnames
  const inputClasses = [
    'w-full outline-none transition-all',
    sizeClasses[size],
    variantClasses[variant],
    validationStateClasses[validationState],
    leftIcon ? 'pl-9' : '',
    rightIcon || (type === 'password' && revealPassword) || (clearable && inputValue) ? 'pr-9' : '',
    disabled ? 'opacity-60 cursor-not-allowed bg-bg-surface/50' : '',
    className,
  ].filter(Boolean).join(' ');
  
  // Animation variants
  const focusAnimationVariants = {
    grow: {
      normal: {},
      focus: enableFocusAnimation ? {
        scale: 1.02,
        transition: { duration: animationDuration }
      } : {},
    },
    highlight: {
      normal: {},
      focus: enableFocusAnimation ? {
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)',
        transition: { duration: animationDuration }
      } : {},
    },
    bounce: {
      normal: {},
      focus: enableFocusAnimation ? {
        y: [0, -3, 0],
        transition: { duration: 0.3, times: [0, 0.5, 1] }
      } : {},
    },
    none: {
      normal: {},
      focus: {},
    }
  };
  
  const containerAnimationVariants = {
    hidden: { 
      opacity: 0, 
      y: 10,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut" 
      }
    }
  };
  
  const labelAnimationVariants = {
    rest: { 
      y: 0, 
      color: validationState !== 'default' 
        ? validationIconColors[validationState]
        : 'inherit',
    },
    focus: { 
      y: 0, 
      color: validationState !== 'default' 
        ? validationIconColors[validationState]
        : 'var(--color-primary)',
      transition: { duration: animationDuration }
    },
    error: {
      x: [0, -3, 3, -2, 2, 0],
      transition: { duration: 0.4 }
    }
  };
  
  const validationIconVariants = {
    initial: { scale: 0.5, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1, 
      transition: { 
        type: 'spring',
        damping: 12
      }
    },
    exit: {
      scale: 0.5,
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };
  
  // Get the effective input type
  const effectiveType = type === 'password' && showPassword ? 'text' : type;
  
  // Determine if we should show validation icons
  const showValidationIcon = validationState !== 'default' && enableValidationAnimation;
  
  // Generate a unique ID if none is provided
  const inputId = id || `input-${name || Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <motion.div 
      className={`input-container ${fullWidth ? 'w-full' : 'max-w-xs'}`}
      initial="hidden"
      animate={hasAnimatedIn ? "visible" : "hidden"}
      variants={containerAnimationVariants}
    >
      {label && (
        <motion.label 
          ref={labelRef}
          htmlFor={inputId}
          className={`block font-medium ${labelSizeClasses[size]}`}
          animate={isFocused ? "focus" : "rest"}
          variants={labelAnimationVariants}
          key={`label-${validationState}-${animationKey}`}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </motion.label>
      )}
      
      <motion.div 
        className="relative"
        animate={isFocused ? "focus" : "normal"}
        variants={focusAnimationVariants[animationStyle]}
        initial={false}
      >
        {leftIcon && (
          <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${validationIconColors.default}`}>
            {leftIcon}
          </div>
        )}
        
        <input
          ref={inputRef}
          id={inputId}
          type={effectiveType}
          className={inputClasses}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          autoComplete={autoComplete}
          value={value}
          defaultValue={defaultValue}
          name={name}
          min={min}
          max={max}
          minLength={minLength}
          maxLength={maxLength}
          pattern={pattern}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...props}
        />
        
        {/* Right side icons container */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {/* Validation icon with animation */}
          <AnimatePresence mode="wait">
            {showValidationIcon && (
              <motion.div
                key={`validation-${validationState}`}
                variants={validationIconVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className={`${iconSizeClasses[size]} ${validationIconColors[validationState]}`}
              >
                {validationState === 'success' && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {validationState === 'error' && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                {validationState === 'warning' && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Password visibility toggle */}
          {type === 'password' && revealPassword && (
            <motion.button
              type="button"
              className={`${iconSizeClasses[size]} text-text-muted hover:text-primary focus:outline-none`}
              onClick={togglePassword}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </motion.button>
          )}
          
          {/* Clearable button */}
          {clearable && inputValue && (
            <motion.button
              type="button"
              className={`${iconSizeClasses[size]} text-text-muted hover:text-primary focus:outline-none`}
              onClick={handleClear}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          )}
          
          {/* Custom right icon */}
          {rightIcon && (
            <div className={`${iconSizeClasses[size]} text-text-muted`}>
              {rightIcon}
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Helper text with validation state colors */}
      {helperText && (
        <motion.div 
          className={`${helperTextSizeClasses[size]} ${validationIconColors[validationState]}`}
          initial={{ opacity: 0, y: -5 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: { delay: 0.1, duration: 0.2 }
          }}
        >
          <Typography variant="caption" colorScheme={
            validationState === 'default' ? 'muted' : 
            validationState === 'success' ? 'success' : 
            validationState === 'error' ? 'error' : 
            'warning'
          }>
            {helperText}
          </Typography>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Input; 