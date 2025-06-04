import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import { Typography } from '../../atoms/Typography/Typography';

export interface NavItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: NavItem[];
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
}

export interface NavProps {
  // Core content
  items: NavItem[];
  logo?: React.ReactNode;
  
  // Layout and style
  variant?: 'horizontal' | 'vertical';
  position?: 'left' | 'center' | 'right';
  colorScheme?: 'primary' | 'neutral' | 'transparent';
  size?: 'sm' | 'md' | 'lg';
  
  // Behavior
  mobileBreakpoint?: 'sm' | 'md' | 'lg';
  
  // Additional content
  rightContent?: React.ReactNode;
  
  // HTML props
  className?: string;
  id?: string;
}

export const Nav: React.FC<NavProps> = ({
  // Core content
  items,
  logo,
  
  // Layout and style
  variant = 'horizontal',
  position = 'left',
  colorScheme = 'primary',
  size = 'md',
  
  // Behavior
  mobileBreakpoint = 'md',
  
  // Additional content
  rightContent,
  
  // HTML props
  className = '',
  id,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };
  
  // Toggle submenu
  const toggleSubmenu = (label: string) => {
    setOpenSubmenus(prev => {
      if (prev.includes(label)) {
        return prev.filter(item => item !== label);
      } else {
        return [...prev, label];
      }
    });
  };
  
  // Color scheme styles
  const colorSchemeStyles = {
    primary: 'bg-primary text-white',
    neutral: 'bg-bg-surface text-text-base border-b border-border',
    transparent: 'bg-transparent text-text-base',
  };
  
  // Size styles
  const sizeStyles = {
    sm: 'py-2',
    md: 'py-3',
    lg: 'py-4',
  };
  
  // Position styles (horizontal only)
  const positionStyles = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };
  
  // Mobile breakpoint styles
  const mobileBreakpointStyles = {
    sm: 'sm:hidden',
    md: 'md:hidden',
    lg: 'lg:hidden',
  };
  
  const desktopBreakpointStyles = {
    sm: 'hidden sm:flex',
    md: 'hidden md:flex',
    lg: 'hidden lg:flex',
  };
  
  // Render a single nav item
  const renderNavItem = (item: NavItem, isSubmenuItem = false, isMobile = false) => {
    const isDropdown = item.children && item.children.length > 0;
    const isSubmenuOpen = openSubmenus.includes(item.label);
    
    const navItemClasses = `
      ${isSubmenuItem ? 'py-2 px-4' : 'py-2 px-3'}
      ${item.active ? 'font-semibold' : 'font-medium'}
      ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/10 cursor-pointer'}
      ${isSubmenuItem ? '' : 'relative'}
      transition-colors duration-200 rounded-md flex items-center gap-2
    `;
    
    const handleClick = () => {
      if (item.disabled) return;
      
      if (isDropdown) {
        toggleSubmenu(item.label);
      } else if (item.onClick) {
        item.onClick();
        // Close mobile menu after clicking an item
        if (isMobile) {
          setIsMobileMenuOpen(false);
        }
      }
    };
    
    return (
      <li key={item.label} className={isSubmenuItem ? '' : 'relative'}>
        <div
          className={navItemClasses}
          onClick={handleClick}
          role="button"
          tabIndex={item.disabled ? -1 : 0}
          aria-disabled={item.disabled}
          aria-expanded={isDropdown ? isSubmenuOpen : undefined}
        >
          {item.icon && <span>{item.icon}</span>}
          <span>{item.label}</span>
          {isDropdown && (
            <FaChevronDown 
              size={12} 
              className={`ml-1 transition-transform duration-200 ${isSubmenuOpen ? 'rotate-180' : ''}`} 
            />
          )}
        </div>
        
        {/* Submenu for dropdowns */}
        {isDropdown && (
          <AnimatePresence>
            {isSubmenuOpen && (
              <motion.ul
                className={`
                  ${isMobile ? 'pl-4 bg-black/5' : 'absolute z-10 left-0 mt-1 bg-bg-surface shadow-lg rounded-md border border-border/20 min-w-[200px]'}
                `}
                initial={{ opacity: 0, y: isMobile ? 0 : -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: isMobile ? 0 : -10, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {item.children!.map(childItem => renderNavItem(childItem, true, isMobile))}
              </motion.ul>
            )}
          </AnimatePresence>
        )}
      </li>
    );
  };
  
  return (
    <nav 
      id={id}
      className={`w-full ${colorSchemeStyles[colorScheme]} ${sizeStyles[size]} ${className}`}
    >
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className={`items-center ${desktopBreakpointStyles[mobileBreakpoint]}`}>
          {/* Logo */}
          {logo && <div className="mr-8">{logo}</div>}
          
          {/* Nav Items */}
          {variant === 'horizontal' ? (
            <ul className={`flex items-center gap-2 ${positionStyles[position]} flex-1`}>
              {items.map(item => renderNavItem(item))}
            </ul>
          ) : (
            <ul className="flex flex-col gap-1 w-full">
              {items.map(item => renderNavItem(item))}
            </ul>
          )}
          
          {/* Right Content */}
          {rightContent && <div className="ml-auto">{rightContent}</div>}
        </div>
        
        {/* Mobile Navigation */}
        <div className={`flex items-center justify-between ${mobileBreakpointStyles[mobileBreakpoint]}`}>
          {/* Logo */}
          {logo && <div>{logo}</div>}
          
          {/* Mobile Menu Button */}
          <button
            className="p-2 ml-auto rounded-md hover:bg-black/10 transition-colors"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          
          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                className="fixed inset-x-0 top-[calc(4rem)] bg-bg-surface border-t border-border z-20"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ul className="flex flex-col p-4">
                  {items.map(item => renderNavItem(item, false, true))}
                </ul>
                
                {/* Mobile Right Content */}
                {rightContent && (
                  <div className="p-4 border-t border-border">
                    {rightContent}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Nav; 