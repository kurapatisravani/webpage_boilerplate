import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaTimes, FaCheck } from 'react-icons/fa';
import { Typography } from '../../atoms/Typography/Typography';
import { Button } from '../../atoms/Button/Button';

// Types for the Calendar component
export type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

export interface CalendarProps {
  // Core functionality
  value?: Date | null;
  defaultValue?: Date | null;
  dateRange?: DateRange;
  defaultDateRange?: DateRange;
  onChange?: (date: Date | null) => void;
  onRangeChange?: (range: DateRange) => void;
  
  // Appearance
  size?: 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'outlined' | 'minimal';
  colorScheme?: 'primary' | 'secondary' | 'neutral';
  showWeekdays?: boolean;
  showOutsideDays?: boolean;
  showToday?: boolean;
  
  // Behavior
  selectionMode?: 'single' | 'multiple' | 'range';
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[] | ((date: Date) => boolean);
  isDateHighlighted?: (date: Date) => boolean;
  
  // UI options
  showHeader?: boolean;
  showFooter?: boolean;
  showClearButton?: boolean;
  headerFormat?: string;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  
  // Animation
  animationStyle?: 'fade' | 'slide' | 'zoom' | 'none';
  enableAnimation?: boolean;
  
  // Custom rendering
  renderDay?: (date: Date, props: RenderDayProps) => React.ReactNode;
  renderHeader?: (props: RenderHeaderProps) => React.ReactNode;
  renderFooter?: (props: RenderFooterProps) => React.ReactNode;
  
  // Events
  onMonthChange?: (month: Date) => void;
  onYearChange?: (year: Date) => void;
  
  // HTML props
  className?: string;
  id?: string;
}

// Props for custom rendering functions
export interface RenderDayProps {
  date: Date;
  selected: boolean;
  today: boolean;
  disabled: boolean;
  inCurrentMonth: boolean;
  isHighlighted: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
  onClick: () => void;
}

export interface RenderHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onPrevYear: () => void;
  onNextYear: () => void;
  onTitleClick: () => void;
}

export interface RenderFooterProps {
  selectedDate: Date | null;
  selectedRange: DateRange;
  onClear: () => void;
  onToday: () => void;
  onDone: () => void;
}

// Helper functions for date manipulation
const getDaysInMonth = (date: Date): number => {
  const year = date.getFullYear();
  const month = date.getMonth();
  return new Date(year, month + 1, 0).getDate();
};

const getStartDayOfMonth = (date: Date, firstDayOfWeek: number): number => {
  const startDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  return (startDay - firstDayOfWeek + 7) % 7;
};

const addMonths = (date: Date, amount: number): Date => {
  const newDate = new Date(date);
  const currentMonth = newDate.getMonth();
  newDate.setMonth(currentMonth + amount);
  
  // If the new date has a different day than the original, it means
  // the day overflowed to the next month, so set it to the last day of the previous month
  if (newDate.getMonth() !== ((currentMonth + amount) % 12)) {
    newDate.setDate(0);
  }
  
  return newDate;
};

const addYears = (date: Date, amount: number): Date => {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + amount);
  return newDate;
};

const isSameDay = (date1: Date | null, date2: Date | null): boolean => {
  if (!date1 || !date2) return false;
  
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const isDateBetween = (date: Date, startDate: Date | null, endDate: Date | null): boolean => {
  if (!startDate || !endDate) return false;
  
  const timestamp = date.getTime();
  return timestamp > startDate.getTime() && timestamp < endDate.getTime();
};

const formatDate = (date: Date, format: string = 'MMMM yyyy'): string => {
  // Simple formatter for common formats
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const monthShortNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const dayNames = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
    'Thursday', 'Friday', 'Saturday'
  ];
  
  const dayShortNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return format
    .replace('MMMM', monthNames[date.getMonth()])
    .replace('MMM', monthShortNames[date.getMonth()])
    .replace('MM', String(date.getMonth() + 1).padStart(2, '0'))
    .replace('M', String(date.getMonth() + 1))
    .replace('yyyy', String(date.getFullYear()))
    .replace('yy', String(date.getFullYear()).slice(-2))
    .replace('dd', String(date.getDate()).padStart(2, '0'))
    .replace('d', String(date.getDate()))
    .replace('EEEE', dayNames[date.getDay()])
    .replace('EEE', dayShortNames[date.getDay()]);
};

export const Calendar: React.FC<CalendarProps> = ({
  // Core functionality
  value,
  defaultValue = null,
  dateRange,
  defaultDateRange = { startDate: null, endDate: null },
  onChange,
  onRangeChange,
  
  // Appearance
  size = 'md',
  variant = 'filled',
  colorScheme = 'primary',
  showWeekdays = true,
  showOutsideDays = true,
  showToday = true,
  
  // Behavior
  selectionMode = 'single',
  minDate,
  maxDate,
  disabledDates,
  isDateHighlighted,
  
  // UI options
  showHeader = true,
  showFooter = true,
  showClearButton = true,
  headerFormat = 'MMMM yyyy',
  firstDayOfWeek = 0, // Sunday
  
  // Animation
  animationStyle = 'fade',
  enableAnimation = true,
  
  // Custom rendering
  renderDay,
  renderHeader,
  renderFooter,
  
  // Events
  onMonthChange,
  onYearChange,
  
  // HTML props
  className = '',
  id,
}) => {
  // State for controlled/uncontrolled components
  const [selectedDate, setSelectedDate] = useState<Date | null>(value !== undefined ? value : defaultValue);
  const [selectedRange, setSelectedRange] = useState<DateRange>(dateRange || defaultDateRange);
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate || new Date());
  const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  
  // When in range selection mode, we need to track if we're selecting the start or end date
  const [selectingRangeEnd, setSelectingRangeEnd] = useState<boolean>(false);
  
  // Update internal state when controlled props change
  useEffect(() => {
    if (value !== undefined) {
      setSelectedDate(value);
      if (value) {
        setCurrentMonth(value);
      }
    }
  }, [value]);
  
  useEffect(() => {
    if (dateRange !== undefined) {
      setSelectedRange(dateRange || { startDate: null, endDate: null });
      if (dateRange?.startDate) {
        setCurrentMonth(dateRange.startDate);
      }
    }
  }, [dateRange]);
  
  // Navigation functions
  const goToPreviousMonth = useCallback(() => {
    const prevMonth = addMonths(currentMonth, -1);
    setCurrentMonth(prevMonth);
    if (onMonthChange) {
      onMonthChange(prevMonth);
    }
  }, [currentMonth, onMonthChange]);
  
  const goToNextMonth = useCallback(() => {
    const nextMonth = addMonths(currentMonth, 1);
    setCurrentMonth(nextMonth);
    if (onMonthChange) {
      onMonthChange(nextMonth);
    }
  }, [currentMonth, onMonthChange]);
  
  const goToPreviousYear = useCallback(() => {
    const prevYear = addYears(currentMonth, -1);
    setCurrentMonth(prevYear);
    if (onYearChange) {
      onYearChange(prevYear);
    }
  }, [currentMonth, onYearChange]);
  
  const goToNextYear = useCallback(() => {
    const nextYear = addYears(currentMonth, 1);
    setCurrentMonth(nextYear);
    if (onYearChange) {
      onYearChange(nextYear);
    }
  }, [currentMonth, onYearChange]);
  
  const goToToday = useCallback(() => {
    const today = new Date();
    setCurrentMonth(today);
    if (selectionMode === 'single') {
      setSelectedDate(today);
      if (onChange) {
        onChange(today);
      }
    }
  }, [selectionMode, onChange]);
  
  // Function to check if a date is disabled
  const isDisabled = useCallback((date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    
    if (disabledDates) {
      if (typeof disabledDates === 'function') {
        return disabledDates(date);
      } else if (Array.isArray(disabledDates)) {
        return disabledDates.some(disabledDate => isSameDay(date, disabledDate));
      }
    }
    
    return false;
  }, [minDate, maxDate, disabledDates]);
  
  // Function to handle date selection
  const handleDateSelect = useCallback((date: Date) => {
    if (isDisabled(date)) return;
    
    if (selectionMode === 'single') {
      setSelectedDate(date);
      if (onChange) {
        onChange(date);
      }
    } else if (selectionMode === 'range') {
      if (!selectingRangeEnd) {
        // Selecting start date
        const newRange = { startDate: date, endDate: null };
        setSelectedRange(newRange);
        setSelectingRangeEnd(true);
        
        // If onRangeChange accepts partial ranges
        if (onRangeChange) {
          onRangeChange(newRange);
        }
      } else {
        // Selecting end date
        const { startDate } = selectedRange;
        
        // Ensure end date is after start date
        if (startDate && date >= startDate) {
          const newRange = { startDate, endDate: date };
          setSelectedRange(newRange);
          setSelectingRangeEnd(false);
          
          if (onRangeChange) {
            onRangeChange(newRange);
          }
        } else if (startDate) {
          // If end date is before start date, swap them
          const newRange = { startDate: date, endDate: startDate };
          setSelectedRange(newRange);
          setSelectingRangeEnd(false);
          
          if (onRangeChange) {
            onRangeChange(newRange);
          }
        }
      }
    }
  }, [selectionMode, onChange, onRangeChange, selectingRangeEnd, selectedRange, isDisabled]);
  
  // Function to clear selection
  const handleClear = useCallback(() => {
    if (selectionMode === 'single') {
      setSelectedDate(null);
      if (onChange) {
        onChange(null);
      }
    } else if (selectionMode === 'range') {
      const newRange = { startDate: null, endDate: null };
      setSelectedRange(newRange);
      setSelectingRangeEnd(false);
      
      if (onRangeChange) {
        onRangeChange(newRange);
      }
    }
  }, [selectionMode, onChange, onRangeChange]);
  
  // Generate calendar grid data
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(currentMonth);
    const startDay = getStartDayOfMonth(currentMonth, firstDayOfWeek);
    
    // Previous month days
    const prevMonth = addMonths(currentMonth, -1);
    const prevMonthDays = getDaysInMonth(prevMonth);
    
    // Generate day objects for the calendar grid
    const days = [];
    
    // Add days from previous month
    for (let i = 0; i < startDay; i++) {
      const day = prevMonthDays - startDay + i + 1;
      days.push({
        date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day),
        isCurrentMonth: false,
        isPrevMonth: true,
        isNextMonth: false,
      });
    }
    
    // Add days from current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true,
        isPrevMonth: false,
        isNextMonth: false,
      });
    }
    
    // Add days from next month to complete the grid
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    const nextMonth = addMonths(currentMonth, 1);
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day),
        isCurrentMonth: false,
        isPrevMonth: false,
        isNextMonth: true,
      });
    }
    
    return days;
  }, [currentMonth, firstDayOfWeek]);
  
  // Weekdays array
  const weekdays = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const reorderedDays = [...days.slice(firstDayOfWeek), ...days.slice(0, firstDayOfWeek)];
    return reorderedDays;
  }, [firstDayOfWeek]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };
  
  const monthVariants = {
    hidden: animationStyle === 'fade' 
      ? { opacity: 0 } 
      : animationStyle === 'slide' 
        ? { x: -20, opacity: 0 } 
        : animationStyle === 'zoom' 
          ? { scale: 0.9, opacity: 0 }
          : {},
    visible: { 
      x: 0, 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' } 
    },
    exit: animationStyle === 'fade' 
      ? { opacity: 0 } 
      : animationStyle === 'slide' 
        ? { x: 20, opacity: 0 } 
        : animationStyle === 'zoom' 
          ? { scale: 0.9, opacity: 0 }
          : {},
  };
  
  // Determine size-based styles
  const sizeClasses = {
    sm: {
      container: 'p-2 text-xs',
      header: 'text-sm py-1 px-2',
      day: 'w-6 h-6 text-xs',
      weekday: 'w-6 h-6 text-xs',
      footer: 'text-xs py-1',
    },
    md: {
      container: 'p-3 text-sm',
      header: 'text-base py-2 px-3',
      day: 'w-8 h-8 text-sm',
      weekday: 'w-8 h-8 text-xs',
      footer: 'text-sm py-2',
    },
    lg: {
      container: 'p-4 text-base',
      header: 'text-lg py-3 px-4',
      day: 'w-10 h-10 text-base',
      weekday: 'w-10 h-8 text-sm',
      footer: 'text-base py-3',
    },
  };
  
  const variantClasses = {
    filled: {
      container: 'bg-bg-surface shadow-md rounded-lg',
      header: 'bg-bg-surface-hover rounded-t-lg',
      day: 'hover:bg-bg-surface-hover rounded-full',
      selected: `bg-${colorScheme} text-white hover:bg-${colorScheme}/90`,
      range: `bg-${colorScheme}/20 hover:bg-${colorScheme}/30`,
      rangeEnd: `bg-${colorScheme} text-white hover:bg-${colorScheme}/90`,
      footer: 'border-t border-border',
    },
    outlined: {
      container: 'border border-border rounded-lg bg-bg-surface',
      header: 'border-b border-border',
      day: 'hover:bg-bg-surface-hover rounded-full',
      selected: `bg-${colorScheme} text-white hover:bg-${colorScheme}/90`,
      range: `bg-${colorScheme}/20 hover:bg-${colorScheme}/30`,
      rangeEnd: `bg-${colorScheme} text-white hover:bg-${colorScheme}/90`,
      footer: 'border-t border-border',
    },
    minimal: {
      container: 'bg-transparent',
      header: 'border-b border-border/50',
      day: 'hover:bg-bg-surface-hover rounded-full',
      selected: `bg-${colorScheme} text-white hover:bg-${colorScheme}/90`,
      range: `bg-${colorScheme}/20 hover:bg-${colorScheme}/30`,
      rangeEnd: `bg-${colorScheme} text-white hover:bg-${colorScheme}/90`,
      footer: 'border-t border-border/50',
    },
  };
  
  // Render the calendar header
  const renderCalendarHeader = () => {
    if (renderHeader) {
      return renderHeader({
        currentMonth,
        onPrevMonth: goToPreviousMonth,
        onNextMonth: goToNextMonth,
        onPrevYear: goToPreviousYear,
        onNextYear: goToNextYear,
        onTitleClick: () => setViewMode(viewMode === 'days' ? 'months' : 'days'),
      });
    }
    
    return (
      <div className={`flex items-center justify-between ${sizeClasses[size].header}`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={goToPreviousMonth}
          leftIcon={FaChevronLeft}
          aria-label="Previous month"
        />
        
        <button
          className="font-medium hover:text-primary transition-colors px-2 py-1 rounded"
          onClick={() => setViewMode(viewMode === 'days' ? 'months' : 'days')}
        >
          {formatDate(currentMonth, headerFormat)}
        </button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={goToNextMonth}
          leftIcon={FaChevronRight}
          aria-label="Next month"
        />
      </div>
    );
  };
  
  // Render weekday labels
  const renderWeekdays = () => {
    if (!showWeekdays) return null;
    
    return (
      <div className="grid grid-cols-7 mb-1">
        {weekdays.map((day, index) => (
          <div
            key={`weekday-${index}`}
            className={`flex items-center justify-center font-medium text-text-muted ${sizeClasses[size].weekday}`}
          >
            {day}
          </div>
        ))}
      </div>
    );
  };
  
  // Render calendar days
  const renderCalendarDays = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return (
      <div className="grid grid-cols-7 gap-0.5">
        {calendarDays.map((day, index) => {
          const { date, isCurrentMonth } = day;
          
          // Check if this date is selected
          const isSelected = selectionMode === 'single' 
            ? isSameDay(date, selectedDate)
            : false;
          
          // Check range selection status
          const isRangeStart = selectionMode === 'range' && isSameDay(date, selectedRange.startDate);
          const isRangeEnd = selectionMode === 'range' && isSameDay(date, selectedRange.endDate);
          const isInRange = selectionMode === 'range' && 
            selectedRange.startDate && 
            (selectedRange.endDate || hoverDate) &&
            isDateBetween(
              date, 
              selectedRange.startDate, 
              selectedRange.endDate || hoverDate
            );
          
          // Check if today
          const isToday = isSameDay(date, today);
          
          // Check if disabled
          const disabled = isDisabled(date);
          
          // Check if highlighted
          const highlighted = isDateHighlighted ? isDateHighlighted(date) : false;
          
          // Custom renderer
          if (renderDay) {
            return renderDay(date, {
              date,
              selected: isSelected || isRangeStart || isRangeEnd,
              today: isToday,
              disabled,
              inCurrentMonth: isCurrentMonth,
              isHighlighted: highlighted,
              isRangeStart,
              isRangeEnd,
              isInRange: isInRange || false,
              onClick: () => handleDateSelect(date),
            });
          }
          
          // Create classes based on state
          let dayClasses = [
            'flex items-center justify-center transition-colors',
            sizeClasses[size].day,
            variantClasses[variant].day,
          ];
          
          // Disable outside days if needed
          if (!isCurrentMonth && !showOutsideDays) {
            dayClasses.push('invisible');
          } else if (!isCurrentMonth) {
            dayClasses.push('text-text-muted/50');
          }
          
          // Apply selection styles
          if (isSelected || isRangeStart || isRangeEnd) {
            dayClasses.push(variantClasses[variant].selected);
          } else if (isInRange) {
            dayClasses.push(variantClasses[variant].range);
          }
          
          // Apply today styles
          if (isToday) {
            dayClasses.push('font-bold');
            if (!isSelected && !isRangeStart && !isRangeEnd) {
              dayClasses.push('border border-current');
            }
          }
          
          // Apply disabled styles
          if (disabled) {
            dayClasses.push('opacity-30 cursor-not-allowed');
          } else {
            dayClasses.push('cursor-pointer');
          }
          
          // Apply highlighted styles
          if (highlighted) {
            dayClasses.push('ring-2 ring-primary/50');
          }
          
          return (
            <div
              key={`day-${index}`}
              className={dayClasses.join(' ')}
              onClick={() => !disabled && handleDateSelect(date)}
              onMouseEnter={() => setHoverDate(date)}
              onMouseLeave={() => setHoverDate(null)}
              role="button"
              tabIndex={disabled || !isCurrentMonth ? -1 : 0}
              aria-disabled={disabled}
              aria-label={formatDate(date, 'EEEE, MMMM d, yyyy')}
              aria-selected={isSelected || isRangeStart || isRangeEnd}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>
    );
  };
  
  // Render calendar footer
  const renderCalendarFooter = () => {
    if (!showFooter) return null;
    
    if (renderFooter) {
      return renderFooter({
        selectedDate,
        selectedRange,
        onClear: handleClear,
        onToday: goToToday,
        onDone: () => {},
      });
    }
    
    return (
      <div className={`flex justify-between items-center ${sizeClasses[size].footer}`}>
        <div className="flex gap-2">
          {showClearButton && (
            <Button
              variant="ghost"
              size={size === 'lg' ? 'md' : 'sm'}
              onClick={handleClear}
              leftIcon={FaTimes}
            >
              Clear
            </Button>
          )}
          
          {showToday && (
            <Button
              variant="ghost"
              size={size === 'lg' ? 'md' : 'sm'}
              onClick={goToToday}
              leftIcon={FaCalendarAlt}
            >
              Today
            </Button>
          )}
        </div>
        
        <div>
          {(selectedDate || (selectedRange.startDate && selectedRange.endDate)) && (
            <Button
              variant="primary"
              size={size === 'lg' ? 'md' : 'sm'}
              leftIcon={FaCheck}
              onClick={() => {}}
            >
              Apply
            </Button>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <motion.div
      className={`inline-block ${sizeClasses[size].container} ${variantClasses[variant].container} ${className}`}
      variants={enableAnimation ? containerVariants : undefined}
      initial={enableAnimation ? 'hidden' : undefined}
      animate={enableAnimation ? 'visible' : undefined}
      exit={enableAnimation ? 'exit' : undefined}
      id={id}
    >
      {/* Calendar header */}
      {showHeader && renderCalendarHeader()}
      
      <motion.div
        key={`${currentMonth.getMonth()}-${currentMonth.getFullYear()}`}
        variants={enableAnimation ? monthVariants : undefined}
        initial={enableAnimation ? 'hidden' : undefined}
        animate={enableAnimation ? 'visible' : undefined}
        exit={enableAnimation ? 'exit' : undefined}
        className="py-2"
      >
        {/* Weekday labels */}
        {renderWeekdays()}
        
        {/* Calendar grid */}
        {renderCalendarDays()}
      </motion.div>
      
      {/* Calendar footer */}
      {renderCalendarFooter()}
    </motion.div>
  );
}; 