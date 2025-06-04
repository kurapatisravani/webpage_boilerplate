import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChevronDown } from 'react-icons/io5';
import { Typography } from '../../atoms/Typography/Typography';

type AccordionVariant = 'default' | 'bordered' | 'filled' | 'minimal';
type AccordionIconPosition = 'left' | 'right';

export interface AccordionItemProps {
  title: React.ReactNode;
  children: React.ReactNode;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
}

export interface AccordionProps {
  items?: AccordionItemProps[];
  variant?: AccordionVariant;
  iconPosition?: AccordionIconPosition;
  multiple?: boolean;
  collapsible?: boolean;
  animated?: boolean;
  expandIcon?: React.ReactNode;
  collapseIcon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export const AccordionItem: React.FC<AccordionItemProps & { 
  variant?: AccordionVariant;
  iconPosition?: AccordionIconPosition; 
  isOpen: boolean;
  onToggle: () => void;
  animated?: boolean;
  expandIcon?: React.ReactNode;
  collapseIcon?: React.ReactNode;
  isFirst?: boolean;
  isLast?: boolean;
}> = ({
  title,
  children,
  icon,
  disabled = false,
  className = '',
  contentClassName = '',
  variant = 'default',
  iconPosition = 'right',
  isOpen,
  onToggle,
  animated = true,
  expandIcon,
  collapseIcon,
  isFirst = false,
  isLast = false,
}) => {
  // Styles based on variant
  const getHeaderClasses = () => {
    const baseClasses = 'flex items-center w-full py-3 px-4 text-left focus:outline-none transition-colors';
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
    
    let variantClasses = '';
    
    switch (variant) {
      case 'bordered':
        variantClasses = `border ${isOpen ? 'border-primary' : 'border-border'} rounded-t-lg ${isOpen && !isLast ? 'rounded-b-none' : 'rounded-b-lg'} ${!isOpen && !isFirst ? 'border-t-0 rounded-t-none' : ''}`;
        break;
      case 'filled':
        variantClasses = `${isOpen ? 'bg-primary-light text-primary' : 'bg-bg-subtle hover:bg-bg-muted'} rounded-t-lg ${isOpen && !isLast ? 'rounded-b-none' : 'rounded-b-lg'} ${!isOpen && !isFirst ? 'rounded-t-none' : ''}`;
        break;
      case 'minimal':
        variantClasses = 'border-b border-border hover:bg-bg-subtle';
        break;
      default:
        variantClasses = `border-t ${isFirst ? '' : 'border-t'} border-b border-border ${isOpen ? 'bg-bg-subtle' : 'hover:bg-bg-subtle'}`;
        break;
    }
    
    return `${baseClasses} ${variantClasses} ${disabledClasses} ${className}`;
  };
  
  const getContentClasses = () => {
    let variantClasses = '';
    
    switch (variant) {
      case 'bordered':
        variantClasses = 'border border-t-0 border-primary rounded-b-lg p-4';
        break;
      case 'filled':
        variantClasses = 'bg-bg-subtle p-4 rounded-b-lg';
        break;
      case 'minimal':
        variantClasses = 'pt-2 pb-4 px-4';
        break;
      default:
        variantClasses = 'px-4 pb-4 pt-1';
        break;
    }
    
    return `${variantClasses} ${contentClassName}`;
  };
  
  // Handle click on the header
  const handleClick = () => {
    if (!disabled) {
      onToggle();
    }
  };
  
  // Default icon with animation
  const renderIcon = () => {
    if (expandIcon && collapseIcon) {
      return isOpen ? collapseIcon : expandIcon;
    }
    
    return (
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
        className="text-text-muted"
      >
        <IoChevronDown size={18} />
      </motion.div>
    );
  };
  
  return (
    <div className={`accordion-item ${isOpen ? 'is-open' : ''}`}>
      <h3>
        <button
          type="button"
          className={getHeaderClasses()}
          onClick={handleClick}
          aria-expanded={isOpen}
          disabled={disabled}
        >
          {/* Left-positioned icon */}
          {iconPosition === 'left' && (
            <span className="mr-3">
              {renderIcon()}
            </span>
          )}
          
          {/* Custom icon if provided */}
          {icon && (
            <span className="mr-3">
              {icon}
            </span>
          )}
          
          {/* Title */}
          <span className="flex-1">
            {typeof title === 'string' ? (
              <Typography variant="body1" weight={isOpen ? 'medium' : 'regular'}>
                {title}
              </Typography>
            ) : (
              title
            )}
          </span>
          
          {/* Right-positioned icon */}
          {iconPosition === 'right' && (
            <span className="ml-3">
              {renderIcon()}
            </span>
          )}
        </button>
      </h3>
      
      {/* Content with animation */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={animated ? { height: 0, opacity: 0, overflow: 'hidden' } : undefined}
            animate={animated ? { 
              height: 'auto', 
              opacity: 1,
              transition: { 
                height: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] },
                opacity: { duration: 0.25, delay: 0.05 }
              } 
            } : undefined}
            exit={animated ? { 
              height: 0, 
              opacity: 0,
              transition: { 
                height: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] },
                opacity: { duration: 0.25 }
              } 
            } : undefined}
          >
            <div className={getContentClasses()}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Accordion: React.FC<AccordionProps> = ({
  items = [],
  variant = 'default',
  iconPosition = 'right',
  multiple = false,
  collapsible = true,
  animated = true,
  expandIcon,
  collapseIcon,
  className = '',
  children,
}) => {
  // State to track which items are open
  const [openIndices, setOpenIndices] = useState<number[]>(() => {
    // Initialize with default open items
    return items
      .map((item, index) => (item.defaultOpen ? index : -1))
      .filter(index => index !== -1);
  });
  
  // Handle toggling an accordion item
  const handleToggle = (index: number) => {
    if (multiple) {
      // If multiple is true, toggle the clicked item
      setOpenIndices(prev => {
        if (prev.includes(index)) {
          // If already open and collapsible is true, close it
          return collapsible ? prev.filter(i => i !== index) : prev;
        } else {
          // If closed, open it
          return [...prev, index];
        }
      });
    } else {
      // If multiple is false, only one item can be open at a time
      setOpenIndices(prev => {
        if (prev.includes(index)) {
          // If already open and collapsible is true, close it
          return collapsible ? [] : prev;
        } else {
          // If closed, open it and close others
          return [index];
        }
      });
    }
  };
  
  // If children are provided, we assume they are AccordionItem components
  // and we clone them with the necessary props
  if (children) {
    return (
      <div className={`accordion ${className}`}>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              variant,
              iconPosition,
              isOpen: openIndices.includes(index),
              onToggle: () => handleToggle(index),
              animated,
              expandIcon,
              collapseIcon,
              isFirst: index === 0,
              isLast: index === React.Children.count(children) - 1,
            });
          }
          return child;
        })}
      </div>
    );
  }
  
  // If items are provided, render them
  return (
    <div className={`accordion ${className}`}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          icon={item.icon}
          disabled={item.disabled}
          className={item.className}
          contentClassName={item.contentClassName}
          variant={variant}
          iconPosition={iconPosition}
          isOpen={openIndices.includes(index)}
          onToggle={() => handleToggle(index)}
          animated={animated}
          expandIcon={expandIcon}
          collapseIcon={collapseIcon}
          isFirst={index === 0}
          isLast={index === items.length - 1}
        >
          {item.children}
        </AccordionItem>
      ))}
    </div>
  );
};

export default Accordion; 