import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaTimes } from 'react-icons/fa';
import { Input } from '../../atoms/Input/Input';
import { Calendar } from '../Calendar/Calendar';
import type { DateRange } from '../Calendar/Calendar';
import { useClickOutside } from '../../../hooks';

// Date utilities
const formatDateToString = (date: Date | null, format: string = 'yyyy-MM-dd'): string => {
  if (!date) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return format
    .replace('yyyy', String(year))
    .replace('MM', month)
    .replace('dd', day);
};

const parseDateString = (dateString: string, format: string = 'yyyy-MM-dd'): Date | null => {
  if (!dateString) return null;
  
  // Simple parsing for yyyy-MM-dd format
  if (format === 'yyyy-MM-dd') {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        const date = new Date(year, month, day);
        
        // Validate that the date is valid
        if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
          return date;
        }
      }
    }
  }
  
  // Handle other formats or invalid strings
  const timestamp = Date.parse(dateString);
  return isNaN(timestamp) ? null : new Date(timestamp);
};

export interface DatePickerProps {
  // Basic props
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  
  // Range selection
  isRangePicker?: boolean;
  dateRange?: DateRange;
  defaultDateRange?: DateRange;
  onRangeChange?: (range: DateRange) => void;
  
  // Input props
  label?: string;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  validationState?: 'default' | 'success' | 'error' | 'warning';
  
  // Display options
  displayFormat?: string;
  valueFormat?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outlined' | 'filled' | 'underlined' | 'unstyled';
  clearable?: boolean;
  
  // Calendar props
  calendarSize?: 'sm' | 'md' | 'lg';
  calendarVariant?: 'filled' | 'outlined' | 'minimal';
  colorScheme?: 'primary' | 'secondary' | 'neutral';
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[] | ((date: Date) => boolean);
  
  // Animation props
  animationStyle?: 'fade' | 'slide' | 'zoom' | 'none';
  
  // Position props
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  
  // HTML props
  className?: string;
  id?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  // Basic props
  value,
  defaultValue = null,
  onChange,
  
  // Range selection
  isRangePicker = false,
  dateRange,
  defaultDateRange = { startDate: null, endDate: null },
  onRangeChange,
  
  // Input props
  label,
  placeholder = 'Select date',
  helperText,
  disabled = false,
  required = false,
  validationState = 'default',
  
  // Display options
  displayFormat = 'yyyy-MM-dd',
  valueFormat = 'yyyy-MM-dd',
  size = 'md',
  variant = 'outlined',
  clearable = true,
  
  // Calendar props
  calendarSize = 'md',
  calendarVariant = 'filled',
  colorScheme = 'primary',
  minDate,
  maxDate,
  disabledDates,
  
  // Animation props
  animationStyle = 'fade',
  
  // Position props
  placement = 'bottom-start',
  
  // HTML props
  className,
  id,
}) => {
  // State for controlled values
  const [selectedDate, setSelectedDate] = useState<Date | null>(value !== undefined ? value : defaultValue);
  const [selectedRange, setSelectedRange] = useState<DateRange>(dateRange !== undefined ? dateRange || defaultDateRange : defaultDateRange);
  const [inputValue, setInputValue] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string>('');
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Close calendar when clicking outside
  useClickOutside(containerRef as React.RefObject<HTMLElement>, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });
  
  // Update input value when date changes
  useEffect(() => {
    if (isRangePicker) {
      const start = selectedRange.startDate ? formatDateToString(selectedRange.startDate, displayFormat) : '';
      const end = selectedRange.endDate ? formatDateToString(selectedRange.endDate, displayFormat) : '';
      
      if (start && end) {
        setInputValue(`${start} to ${end}`);
      } else if (start) {
        setInputValue(start);
      } else {
        setInputValue('');
      }
    } else {
      setInputValue(formatDateToString(selectedDate, displayFormat));
    }
  }, [selectedDate, selectedRange, isRangePicker, displayFormat]);
  
  // Update internal state when controlled props change
  useEffect(() => {
    if (value !== undefined) {
      setSelectedDate(value);
    }
  }, [value]);
  
  useEffect(() => {
    if (dateRange !== undefined) {
      setSelectedRange(dateRange || defaultDateRange);
    }
  }, [dateRange, defaultDateRange]);
  
  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (!newValue) {
      if (isRangePicker) {
        const newRange = { startDate: null, endDate: null };
        setSelectedRange(newRange);
        if (onRangeChange) {
          onRangeChange(newRange);
        }
      } else {
        setSelectedDate(null);
        if (onChange) {
          onChange(null);
        }
      }
      return;
    }
    
    if (isRangePicker) {
      // Attempt to parse range like "2023-01-01 to 2023-01-15"
      const parts = newValue.split(' to ');
      if (parts.length === 2) {
        const startDate = parseDateString(parts[0], valueFormat);
        const endDate = parseDateString(parts[1], valueFormat);
        
        if (startDate && endDate) {
          const newRange = { startDate, endDate };
          setSelectedRange(newRange);
          setValidationMessage('');
          
          if (onRangeChange) {
            onRangeChange(newRange);
          }
        } else {
          setValidationMessage('Invalid date range format');
        }
      }
    } else {
      // Attempt to parse single date
      const date = parseDateString(newValue, valueFormat);
      if (date) {
        setSelectedDate(date);
        setValidationMessage('');
        
        if (onChange) {
          onChange(date);
        }
      } else {
        setValidationMessage('Invalid date format');
      }
    }
  };
  
  const handleCalendarSelect = (date: Date | null) => {
    setSelectedDate(date);
    if (onChange) {
      onChange(date);
    }
    setIsOpen(false);
  };
  
  const handleCalendarRangeSelect = (range: DateRange) => {
    setSelectedRange(range);
    if (onRangeChange) {
      onRangeChange(range);
    }
    
    // Only close the calendar when both dates are selected
    if (range.startDate && range.endDate) {
      setIsOpen(false);
    }
  };
  
  const handleClear = () => {
    if (isRangePicker) {
      const newRange = { startDate: null, endDate: null };
      setSelectedRange(newRange);
      setInputValue('');
      
      if (onRangeChange) {
        onRangeChange(newRange);
      }
    } else {
      setSelectedDate(null);
      setInputValue('');
      
      if (onChange) {
        onChange(null);
      }
    }
  };
  
  const toggleCalendar = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };
  
  // Determine placement styles
  const placementStyles = {
    'bottom-start': 'top-full left-0 mt-1',
    'bottom-end': 'top-full right-0 mt-1',
    'top-start': 'bottom-full left-0 mb-1',
    'top-end': 'bottom-full right-0 mb-1',
  };
  
  // Animation variants
  const calendarVariants = {
    hidden: animationStyle === 'fade' 
      ? { opacity: 0 } 
      : animationStyle === 'slide' 
        ? { y: -10, opacity: 0 } 
        : animationStyle === 'zoom' 
          ? { scale: 0.95, opacity: 0 }
          : {},
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.2 } 
    },
    exit: animationStyle === 'fade' 
      ? { opacity: 0 } 
      : animationStyle === 'slide' 
        ? { y: -10, opacity: 0 } 
        : animationStyle === 'zoom' 
          ? { scale: 0.95, opacity: 0 }
          : {},
  };
  
  return (
    <div 
      ref={containerRef}
      className={`relative ${className || ''}`}
      id={id}
    >
      <Input
        type="text"
        label={label}
        placeholder={placeholder}
        helperText={validationMessage || helperText}
        value={inputValue}
        onChange={handleInputChange}
        onClick={toggleCalendar}
        rightIcon={<FaCalendarAlt />}
        clearable={clearable && (!!inputValue)}
        onClear={handleClear}
        disabled={disabled}
        required={required}
        size={size}
        variant={variant}
        validationState={validationMessage ? 'error' : validationState}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      />
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`absolute z-50 shadow-lg ${placementStyles[placement]}`}
            variants={calendarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {isRangePicker ? (
              <Calendar
                dateRange={selectedRange}
                onRangeChange={handleCalendarRangeSelect}
                selectionMode="range"
                size={calendarSize}
                variant={calendarVariant}
                colorScheme={colorScheme}
                minDate={minDate}
                maxDate={maxDate}
                disabledDates={disabledDates}
                animationStyle="none" // Disable internal animation
                showFooter={true}
                showClearButton={true}
              />
            ) : (
              <Calendar
                value={selectedDate}
                onChange={handleCalendarSelect}
                size={calendarSize}
                variant={calendarVariant}
                colorScheme={colorScheme}
                minDate={minDate}
                maxDate={maxDate}
                disabledDates={disabledDates}
                animationStyle="none" // Disable internal animation
                showFooter={true}
                showClearButton={true}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 