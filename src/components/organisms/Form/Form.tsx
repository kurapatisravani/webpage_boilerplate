import React, { useState, useEffect } from 'react';
import { Button } from '../../atoms/Button/Button';
import { Input } from '../../atoms/Input/Input';
import { Checkbox } from '../../atoms/Checkbox/Checkbox';
import { Select } from '../../atoms/Select';
import { Textarea } from '../../atoms/Textarea';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

// Form field types
export type FormFieldType = 
  | 'text' 
  | 'email' 
  | 'password' 
  | 'number' 
  | 'tel' 
  | 'url' 
  | 'date' 
  | 'time'
  | 'datetime-local'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'textarea'
  | 'custom';

// Validation rules
export type ValidationRule = {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
};

// Form field config
export type FormFieldConfig = {
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  defaultValue?: any;
  options?: { label: string; value: any }[];
  validations?: ValidationRule[];
  disabled?: boolean;
  className?: string;
  render?: (props: {
    field: FormFieldConfig;
    value: any;
    onChange: (value: any) => void;
    error?: string;
    touched: boolean;
  }) => React.ReactNode;
};

// Form section
export type FormSection = {
  title?: string;
  description?: string;
  fields: FormFieldConfig[];
};

// Form status
export type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

// Form props
export interface FormProps {
  /**
   * Form identifier
   */
  id?: string;
  
  /**
   * Form title
   */
  title?: string;
  
  /**
   * Form description
   */
  description?: string;
  
  /**
   * Form fields grouped into sections
   */
  sections?: FormSection[];
  
  /**
   * Form fields (flat list)
   */
  fields?: FormFieldConfig[];
  
  /**
   * Initial form values
   */
  initialValues?: Record<string, any>;
  
  /**
   * Submit button text
   */
  submitText?: string;
  
  /**
   * Cancel button text
   */
  cancelText?: string;
  
  /**
   * Whether to show cancel button
   */
  showCancel?: boolean;
  
  /**
   * Form submission handler
   */
  onSubmit: (values: Record<string, any>, form: { reset: () => void }) => Promise<void> | void;
  
  /**
   * Cancel handler
   */
  onCancel?: () => void;
  
  /**
   * Success message
   */
  successMessage?: string;
  
  /**
   * Error message
   */
  errorMessage?: string;
  
  /**
   * Whether to show form status
   */
  showFormStatus?: boolean;
  
  /**
   * Whether to reset form after successful submission
   */
  resetOnSubmit?: boolean;
  
  /**
   * Form layout: stacked or horizontal
   */
  layout?: 'stacked' | 'horizontal';
  
  /**
   * Form CSS class
   */
  className?: string;
  
  /**
   * Custom submit handler to validate/transform data before submission
   */
  beforeSubmit?: (values: Record<string, any>) => Record<string, any> | false;
}

export const Form: React.FC<FormProps> = ({
  id,
  title,
  description,
  sections = [],
  fields = [],
  initialValues = {},
  submitText = 'Submit',
  cancelText = 'Cancel',
  showCancel = false,
  onSubmit,
  onCancel,
  successMessage = 'Form submitted successfully',
  errorMessage = 'There was an error submitting the form',
  showFormStatus = true,
  resetOnSubmit = true,
  layout = 'stacked',
  className = '',
  beforeSubmit,
}) => {
  // Combine fields from sections and fields props
  const allFields = [...fields, ...sections.flatMap(section => section.fields)];
  
  // State for form values, errors, touched fields, and form status
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [serverError, setServerError] = useState<string | null>(null);
  
  // Initialize form values from initialValues
  useEffect(() => {
    // Create initial values from field defaults and provided initialValues
    const initialFormValues = allFields.reduce<Record<string, any>>((acc, field) => {
      if (initialValues[field.name] !== undefined) {
        acc[field.name] = initialValues[field.name];
      } else if (field.defaultValue !== undefined) {
        acc[field.name] = field.defaultValue;
      } else if (field.type === 'checkbox') {
        acc[field.name] = false;
      } else if (field.type === 'select' && field.options && field.options.length > 0) {
        acc[field.name] = field.options[0].value;
      } else {
        acc[field.name] = '';
      }
      return acc;
    }, {});
    
    setValues(initialFormValues);
  }, []);
  
  // Validate a single field
  const validateField = (name: string, value: any): string | null => {
    const field = allFields.find(f => f.name === name);
    
    if (!field || !field.validations) return null;
    
    for (const rule of field.validations) {
      let isValid = true;
      
      switch (rule.type) {
        case 'required':
          isValid = value !== undefined && value !== null && value !== '';
          if (field.type === 'checkbox') {
            isValid = value === true;
          }
          break;
          
        case 'minLength':
          isValid = typeof value === 'string' && value.length >= (rule.value || 0);
          break;
          
        case 'maxLength':
          isValid = typeof value === 'string' && value.length <= (rule.value || 0);
          break;
          
        case 'pattern':
          isValid = new RegExp(rule.value).test(value);
          break;
          
        case 'custom':
          isValid = rule.validator ? rule.validator(value) : true;
          break;
      }
      
      if (!isValid) {
        return rule.message;
      }
    }
    
    return null;
  };
  
  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    // Validate each field
    Object.keys(values).forEach(name => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Handle field change
  const handleChange = (name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Validate field if it has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ 
        ...prev, 
        [name]: error || ''
      }));
    }
  };
  
  // Handle field blur
  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field
    const error = validateField(name, values[name]);
    setErrors(prev => ({ 
      ...prev, 
      [name]: error || '' 
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const touchedFields = allFields.reduce<Record<string, boolean>>((acc, field) => {
      acc[field.name] = true;
      return acc;
    }, {});
    setTouched(touchedFields);
    
    // Validate form
    const isValid = validateForm();
    
    if (!isValid) return;
    
    // Run beforeSubmit handler if provided
    let submissionValues = { ...values };
    if (beforeSubmit) {
      const result = beforeSubmit(submissionValues);
      if (result === false) return;
      if (result) submissionValues = result;
    }
    
    setStatus('submitting');
    setServerError(null);
    
    try {
      await onSubmit(submissionValues, {
        reset: () => {
          // Reset form to initial values
          setValues(initialValues);
          setErrors({});
          setTouched({});
        }
      });
      
      setStatus('success');
      
      // Reset form if resetOnSubmit is true
      if (resetOnSubmit) {
        setValues(initialValues);
        setErrors({});
        setTouched({});
      }
      
      // Reset status after delay
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setServerError(error instanceof Error ? error.message : String(error));
      
      // Reset status after delay
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    }
  };
  
  // Render a field based on its type
  const renderField = (field: FormFieldConfig) => {
    const { name, label, type, placeholder, options, disabled, className: fieldClassName, render } = field;
    const value = values[name];
    const error = errors[name];
    const isTouched = touched[name] || false;
    
    // Use custom render function if provided
    if (render) {
      return render({
        field,
        value,
        onChange: (newValue: any) => handleChange(name, newValue),
        error,
        touched: isTouched
      });
    }
    
    // Render field based on type
    switch (type) {
      case 'checkbox':
        return (
          <Checkbox
            id={`${id}-${name}`}
            label={label}
            checked={!!value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(name, e.target.checked)}
            onBlur={() => handleBlur(name)}
            disabled={disabled}
            className={fieldClassName}
          />
        );
        
      case 'select':
        return (
          <Select
            id={`${id}-${name}`}
            label={label}
            value={value}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(name, e.target.value)}
            onBlur={() => handleBlur(name)}
            error={isTouched && error ? error : undefined}
            disabled={disabled}
            className={fieldClassName}
            options={options || []}
          />
        );
        
      case 'textarea':
        return (
          <Textarea
            id={`${id}-${name}`}
            label={label}
            value={value}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange(name, e.target.value)}
            onBlur={() => handleBlur(name)}
            placeholder={placeholder}
            error={isTouched && error ? error : undefined}
            disabled={disabled}
            className={fieldClassName}
          />
        );
        
      default:
        return (
          <Input
            id={`${id}-${name}`}
            label={label}
            type={type}
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(name, e.target.value)}
            onBlur={() => handleBlur(name)}
            placeholder={placeholder}
            validationState={isTouched && error ? 'error' : 'default'}
            helperText={isTouched && error ? error : undefined}
            disabled={disabled}
            className={fieldClassName}
          />
        );
    }
  };
  
  // Determine form layout classes
  const formLayoutClasses = layout === 'horizontal' 
    ? 'grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'
    : 'flex flex-col space-y-4';
  
  // Determine form status classes and content
  const getFormStatusContent = () => {
    if (!showFormStatus || status === 'idle') return null;
    
    const statusStyles = {
      submitting: 'bg-bg-muted',
      success: 'bg-green-50 text-green-700 border-green-200',
      error: 'bg-red-50 text-red-700 border-red-200'
    }[status];
    
    const statusMessages = {
      submitting: 'Submitting...',
      success: successMessage,
      error: serverError || errorMessage
    };
    
    const statusIcons = {
      submitting: null,
      success: <FiCheckCircle className="w-5 h-5" />,
      error: <FiAlertCircle className="w-5 h-5" />
    };
    
    return (
      <div className={`p-3 rounded border ${statusStyles} flex items-center space-x-2 mt-4`}>
        {statusIcons[status]}
        <span>{statusMessages[status]}</span>
      </div>
    );
  };
  
  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className={`w-full ${className}`}
      noValidate
    >
      {/* Form header */}
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className="text-xl font-medium text-text">{title}</h2>}
          {description && (
            <p className="mt-1 text-text-muted">
              {description}
            </p>
          )}
        </div>
      )}
      
      {/* Form sections */}
      {sections.length > 0 ? (
        <div className="space-y-8">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="border-b pb-6 last:border-b-0 last:pb-0">
              {/* Section header */}
              {(section.title || section.description) && (
                <div className="mb-4">
                  {section.title && (
                    <h3 className="text-lg font-medium text-text">
                      {section.title}
                    </h3>
                  )}
                  {section.description && (
                    <p className="mt-1 text-sm text-text-muted">
                      {section.description}
                    </p>
                  )}
                </div>
              )}
              
              {/* Section fields */}
              <div className={formLayoutClasses}>
                {section.fields.map(field => (
                  <div key={field.name} className="mb-4">
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Form fields (flat) */
        <div className={formLayoutClasses}>
          {fields.map(field => (
            <div key={field.name} className="mb-4">
              {renderField(field)}
            </div>
          ))}
        </div>
      )}
      
      {/* Form status */}
      {getFormStatusContent()}
      
      {/* Form buttons */}
      <div className="flex justify-end mt-6 space-x-3">
        {showCancel && (
          <Button 
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={status === 'submitting'}
          >
            {cancelText}
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={status === 'submitting'}
          disabled={status === 'submitting'}
        >
          {submitText}
        </Button>
      </div>
    </form>
  );
};

export default Form; 