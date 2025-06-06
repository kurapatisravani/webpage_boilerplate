import React from 'react';

export interface SimpleFormProps {
  /**
   * Form content
   */
  children?: React.ReactNode;
  
  /**
   * CSS class
   */
  className?: string;
  
  /**
   * Form submission handler
   */
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  
  /**
   * Whether to disable browser validation
   */
  noValidate?: boolean;
  
  /**
   * Form ID
   */
  id?: string;
}

/**
 * A simple form component that just wraps the HTML form element
 */
export const SimpleForm: React.FC<SimpleFormProps> = ({
  children,
  className = '',
  onSubmit,
  noValidate,
  id,
}) => {
  return (
    <form 
      id={id}
      className={className} 
      onSubmit={onSubmit} 
      noValidate={noValidate}
    >
      {children}
    </form>
  );
};

export default SimpleForm; 