import React, { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Textarea label
   */
  label?: string;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Size of the textarea
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Whether to show the full width
   */
  fullWidth?: boolean;
  
  /**
   * Number of rows in the textarea
   */
  rows?: number;
  
  /**
   * Maximum number of rows to display (for auto-resize)
   */
  maxRows?: number;
  
  /**
   * Whether to resize automatically based on content
   */
  autoResize?: boolean;
  
  /**
   * Additional classes to apply
   */
  className?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  size = 'md',
  fullWidth = false,
  rows = 4,
  maxRows,
  autoResize = false,
  id,
  className = '',
  disabled = false,
  required = false,
  ...props
}, ref) => {
  // Generate a unique ID for the textarea if none provided
  const uniqueId = React.useId();
  const textareaId = id || `textarea-${uniqueId}`;
  
  // Size classes
  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3',
  };
  
  // Label size classes
  const labelSizeClasses = {
    sm: 'text-xs mb-1',
    md: 'text-sm mb-1',
    lg: 'text-base mb-2',
  };
  
  // Error size classes
  const errorSizeClasses = {
    sm: 'text-xs mt-1',
    md: 'text-xs mt-1',
    lg: 'text-sm mt-1.5',
  };
  
  // Combine classes
  const textareaClasses = [
    'block rounded-md border min-h-[80px] resize-y bg-bg-surface',
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
    error ? 'border-error text-error' : 'border-border text-text',
    disabled ? 'opacity-60 cursor-not-allowed bg-bg-muted' : '',
    sizeClasses[size],
    fullWidth ? 'w-full' : 'max-w-xs',
    className,
  ].filter(Boolean).join(' ');
  
  return (
    <div className={fullWidth ? 'w-full' : 'max-w-xs'}>
      {label && (
        <label 
          htmlFor={textareaId}
          className={`block font-medium ${labelSizeClasses[size]} ${disabled ? 'opacity-60' : ''}`}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        id={textareaId}
        className={textareaClasses}
        disabled={disabled}
        required={required}
        rows={rows}
        {...props}
      />
      
      {error && (
        <p className={`text-error ${errorSizeClasses[size]}`}>
          {error}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea; 