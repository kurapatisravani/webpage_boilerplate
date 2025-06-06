import React, { forwardRef } from 'react';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /**
   * Select options
   */
  options: SelectOption[];
  
  /**
   * Input label
   */
  label?: string;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Size of the select
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Whether to show the full width
   */
  fullWidth?: boolean;
  
  /**
   * Additional classes to apply
   */
  className?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  options,
  label,
  error,
  size = 'md',
  fullWidth = false,
  id,
  className = '',
  disabled = false,
  required = false,
  ...props
}, ref) => {
  // Generate a unique ID for the select if none provided
  const uniqueId = React.useId();
  const selectId = id || `select-${uniqueId}`;
  
  // Size classes
  const sizeClasses = {
    sm: 'h-8 text-sm px-2 py-1',
    md: 'h-10 text-base px-3 py-2',
    lg: 'h-12 text-lg px-4 py-3',
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
  const selectClasses = [
    'block rounded-md border appearance-none bg-bg-surface',
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
          htmlFor={selectId}
          className={`block font-medium ${labelSizeClasses[size]} ${disabled ? 'opacity-60' : ''}`}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={selectClasses}
          disabled={disabled}
          required={required}
          {...props}
        >
          {options.map((option, index) => (
            <option 
              key={`${option.value}-${index}`} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-muted">
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {error && (
        <p className={`text-error ${errorSizeClasses[size]}`}>
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select; 