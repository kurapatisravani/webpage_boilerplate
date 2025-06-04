import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export type DropdownSize = 'sm' | 'md' | 'lg';
export type DropdownVariant = 'filled' | 'outlined' | 'unstyled';
export type DropdownPlacement = 'bottom-start' | 'bottom-end' | 'bottom' | 'top-start' | 'top-end' | 'top';
export type DropdownColorScheme = 'primary' | 'secondary' | 'neutral';

export interface DropdownItem {
  id: string | number;
  label: React.ReactNode;
  value: string | number;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface DropdownProps {
  // Core content
  items: DropdownItem[];
  selectedItem?: DropdownItem;
  placeholder?: string;
  
  // Appearance
  size?: DropdownSize;
  variant?: DropdownVariant;
  placement?: DropdownPlacement;
  colorScheme?: DropdownColorScheme;
  fullWidth?: boolean;
  maxHeight?: string;
  icon?: React.ReactNode;
  
  // Behavior
  disabled?: boolean;
  required?: boolean;
  searchable?: boolean;
  closeOnSelect?: boolean;
  
  // Events
  onSelect?: (item: DropdownItem) => void;
  onOpen?: () => void;
  onClose?: () => void;
  
  // HTML props
  className?: string;
  id?: string;
  name?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  // Core content
  items,
  selectedItem,
  placeholder = 'Select an option',
  
  // Appearance
  size = 'md',
  variant = 'outlined',
  placement = 'bottom-start',
  colorScheme = 'primary',
  fullWidth = false,
  maxHeight = '250px',
  icon,
  
  // Behavior
  disabled = false,
  required = false,
  searchable = false,
  closeOnSelect = true,
  
  // Events
  onSelect,
  onOpen,
  onClose,
  
  // HTML props
  className = '',
  id,
  name,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
}) => {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Generate unique ID
  const uniqueId = React.useId();
  const dropdownId = id || `dropdown-${uniqueId}`;
  const labelId = `${dropdownId}-label`;
  
  // Toggle dropdown
  const toggleDropdown = () => {
    if (disabled) return;
    
    if (!isOpen) {
      setIsOpen(true);
      onOpen && onOpen();
      
      if (searchable) {
        // Focus the search input when dropdown opens
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    } else {
      setIsOpen(false);
      setSearchQuery('');
      onClose && onClose();
    }
  };
  
  // Close dropdown
  const closeDropdown = () => {
    if (isOpen) {
      setIsOpen(false);
      setSearchQuery('');
      onClose && onClose();
    }
  };
  
  // Handle select
  const handleSelect = (item: DropdownItem) => {
    if (item.disabled) return;
    
    onSelect && onSelect(item);
    
    if (closeOnSelect) {
      closeDropdown();
    }
  };
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setHighlightedIndex(-1);
  };
  
  // Filter items based on search query
  const filteredItems = searchQuery 
    ? items.filter(item => 
        typeof item.label === 'string' && 
        item.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : items;
  
  // Handle key navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          toggleDropdown();
        } else {
          setHighlightedIndex(prevIndex => {
            const nextIndex = prevIndex + 1 >= filteredItems.length ? 0 : prevIndex + 1;
            // Skip disabled items
            if (filteredItems[nextIndex]?.disabled) {
              return prevIndex + 2 >= filteredItems.length ? 0 : prevIndex + 2;
            }
            return nextIndex;
          });
        }
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex(prevIndex => {
            const nextIndex = prevIndex - 1 < 0 ? filteredItems.length - 1 : prevIndex - 1;
            // Skip disabled items
            if (filteredItems[nextIndex]?.disabled) {
              const nextNextIndex = prevIndex - 2 < 0 ? filteredItems.length - 1 : prevIndex - 2;
              return nextNextIndex;
            }
            return nextIndex;
          });
        }
        break;
        
      case 'Enter':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0 && highlightedIndex < filteredItems.length) {
          handleSelect(filteredItems[highlightedIndex]);
        } else if (!isOpen) {
          toggleDropdown();
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        closeDropdown();
        break;
        
      case 'Tab':
        closeDropdown();
        break;
        
      default:
        break;
    }
  };
  
  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  // Style variables
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };
  
  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };
  
  const variantClasses = {
    filled: 'bg-bg-surface border border-border hover:bg-bg-surface-hover',
    outlined: 'bg-transparent border border-border hover:bg-bg-surface/30',
    unstyled: 'bg-transparent hover:bg-bg-surface/20',
  };
  
  const placementClasses = {
    'bottom-start': 'origin-top-left left-0 top-full mt-1',
    'bottom-end': 'origin-top-right right-0 top-full mt-1',
    'bottom': 'origin-top left-1/2 -translate-x-1/2 top-full mt-1',
    'top-start': 'origin-bottom-left left-0 bottom-full mb-1',
    'top-end': 'origin-bottom-right right-0 bottom-full mb-1',
    'top': 'origin-bottom left-1/2 -translate-x-1/2 bottom-full mb-1',
  };
  
  const colorSchemeClasses = {
    primary: 'text-primary focus:ring-primary',
    secondary: 'text-secondary focus:ring-secondary',
    neutral: 'text-text-base focus:ring-border',
  };
  
  // Animation variants
  const dropdownVariants: Variants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95, 
      y: placement.startsWith('top') ? 5 : -5,
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.15,
        ease: "easeOut" 
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: placement.startsWith('top') ? 5 : -5,
      transition: { 
        duration: 0.1,
        ease: "easeIn" 
      }
    }
  };
  
  // Combined classes
  const containerClasses = [
    'relative inline-block',
    fullWidth ? 'w-full' : '',
    disabled ? 'opacity-60 cursor-not-allowed' : '',
    className,
  ].filter(Boolean).join(' ');
  
  const triggerClasses = [
    'flex items-center justify-between rounded',
    sizeClasses[size],
    variantClasses[variant],
    colorSchemeClasses[colorScheme],
    disabled ? 'cursor-not-allowed' : 'cursor-pointer',
    fullWidth ? 'w-full' : '',
    isOpen ? 'ring-2 ring-opacity-50 ring-offset-0' : '',
  ].filter(Boolean).join(' ');
  
  const menuClasses = [
    'absolute z-10 min-w-[180px] w-full overflow-auto bg-bg-surface shadow-lg rounded border border-border',
    placementClasses[placement],
  ].filter(Boolean).join(' ');
  
  const searchInputClasses = [
    'w-full px-3 py-2 bg-bg-surface border-b border-border text-text-base placeholder:text-text-muted focus:outline-none',
    `text-${size}`,
  ].filter(Boolean).join(' ');
  
  return (
    <div 
      ref={containerRef}
      className={containerClasses}
      id={dropdownId}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger button */}
      <div
        className={triggerClasses}
        onClick={toggleDropdown}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={ariaLabelledby}
        aria-label={ariaLabel}
        aria-controls={`${dropdownId}-menu`}
        tabIndex={disabled ? -1 : 0}
      >
        <div className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          <span className={!selectedItem ? 'text-text-muted' : ''}>
            {selectedItem ? selectedItem.label : placeholder}
          </span>
        </div>
        <span className={iconSizeClasses[size]}>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </div>
      
      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            className={menuClasses}
            style={{ maxHeight }}
            role="listbox"
            id={`${dropdownId}-menu`}
            aria-labelledby={labelId}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
          >
            {/* Search input */}
            {searchable && (
              <div className="sticky top-0 z-10">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  className={searchInputClasses}
                  placeholder="Search..."
                  aria-autocomplete="list"
                  autoComplete="off"
                />
              </div>
            )}
            
            {/* Items list */}
            <div className={`overflow-y-auto ${maxHeight ? `max-h-[${maxHeight}]` : ''}`}>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`
                      px-3 py-2 cursor-pointer flex items-center
                      ${highlightedIndex === index ? 'bg-bg-surface-hover' : 'hover:bg-bg-surface-hover'}
                      ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                      ${selectedItem?.id === item.id ? `bg-${colorScheme}/10 font-medium` : ''}
                    `}
                    role="option"
                    aria-selected={selectedItem?.id === item.id}
                    aria-disabled={item.disabled}
                    onClick={() => !item.disabled && handleSelect(item)}
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-text-muted text-center">
                  No items found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Hidden select for form submission */}
      <select
        name={name}
        value={selectedItem?.value || ''}
        required={required}
        disabled={disabled}
        aria-hidden="true"
        className="sr-only"
        tabIndex={-1}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {items.map(item => (
          <option key={item.id} value={item.value} disabled={item.disabled}>
            {typeof item.label === 'string' ? item.label : ''}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown; 