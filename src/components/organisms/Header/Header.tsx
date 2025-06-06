import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';
import { Button } from '../../atoms/Button/Button';

export interface HeaderProps {
  /**
   * The URL of the logo to display
   */
  logoUrl?: string;
  
  /**
   * Alternative text for the logo
   */
  logoAlt?: string;
  
  /**
   * Logo text (used if no logo URL is provided)
   */
  logoText?: string;
  
  /**
   * Navigation items to display in the header
   */
  navItems?: Array<{
    label: string;
    href: string;
    isActive?: boolean;
  }>;
  
  /**
   * Whether to make the header sticky
   */
  isSticky?: boolean;
  
  /**
   * Whether to use glass morphism effect
   */
  useGlassEffect?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Callback for when the theme is toggled
   */
  onThemeToggle?: (theme: 'light' | 'dark') => void;

  /**
   * Callback for when a navigation item is clicked
   */
  onNavItemClick?: (item: { label: string; href: string; isActive?: boolean }) => void;
}

export const Header: React.FC<HeaderProps> = ({
  logoUrl,
  logoAlt = 'Company Logo',
  logoText = 'YourBrand',
  navItems = [],
  isSticky = true,
  useGlassEffect = true,
  className = '',
  onThemeToggle,
  onNavItemClick,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle theme toggle with callback
  const handleThemeToggle = () => {
    toggleTheme();
    if (onThemeToggle) {
      onThemeToggle(theme === 'light' ? 'dark' : 'light');
    }
  };

  // Handle navigation item click
  const handleNavItemClick = (item: { label: string; href: string; isActive?: boolean }) => {
    setMobileMenuOpen(false);
    if (onNavItemClick) {
      onNavItemClick(item);
    }
  };
  
  // Framer motion variants
  const headerVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  const logoVariants = {
    hover: { 
      scale: 1.05,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      } 
    },
    tap: { scale: 0.95 }
  };
  
  const navItemVariants = {
    hover: { 
      y: -1,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 20 
      } 
    },
    tap: { y: 1, transition: { duration: 0.1 } }
  };
  
  const mobileMenuVariants = {
    closed: { 
      opacity: 0,
      height: 0,
      transition: { 
        duration: 0.25,
        ease: "easeInOut"
      }
    },
    open: { 
      opacity: 1,
      height: "auto",
      transition: { 
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };
  
  const mobileItemVariants = {
    closed: { opacity: 0, x: -10 },
    open: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };
  
  // Theme toggle button variants
  const sunMoonIconVariants = {
    initial: (isLight: boolean) => ({
      rotate: isLight ? 0 : 45,
      scale: 1,
    }),
    animate: (isLight: boolean) => ({
      rotate: isLight ? 360 : 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    }),
    exit: (isLight: boolean) => ({
      rotate: isLight ? -45 : 0,
      scale: 0,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }),
    hover: {
      scale: 1.15,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 10
      }
    }
  };
  
  // Combine CSS classes for header
  const headerClasses = [
    'px-4 py-3 w-full z-50 transition-all duration-300',
    scrolled ? 'shadow-md py-2' : '',
    isSticky ? 'sticky top-0' : '',
    useGlassEffect && scrolled ? 'backdrop-blur-md bg-bg/90 dark:bg-bg/90' : 'bg-bg dark:bg-bg',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <motion.header
      className={headerClasses}
      variants={headerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="flex items-center"
          variants={logoVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Link to="/" className="flex items-center gap-2">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={logoAlt} 
                className="h-8 w-auto" 
              />
            ) : (
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light">
                {logoText}
              </span>
            )}
          </Link>
        </motion.div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex gap-6">
            {navItems.map((item) => (
              <motion.div
                key={item.label}
                className="relative"
                variants={navItemVariants}
                whileHover="hover"
                whileTap="tap"
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link
                  to={item.href}
                  onClick={() => handleNavItemClick(item)}
                  className={`relative text-sm font-medium transition-colors px-1 py-2 block
                    ${item.isActive 
                      ? 'text-primary dark:text-primary-light font-semibold' 
                      : 'text-text hover:text-primary dark:hover:text-primary-light'}`}
                  aria-current={item.isActive ? 'page' : undefined}
                >
                  {item.label}
                  
                  {/* Active indicator */}
                  {item.isActive && (
                    <motion.span
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary dark:bg-primary-light rounded-full pointer-events-none"
                      layoutId="activeIndicator"
                      initial={{ opacity: 0, width: '0%' }}
                      animate={{ opacity: 1, width: '100%' }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  {/* Hover indicator */}
                  {hoveredItem === item.label && !item.isActive && (
                    <motion.span
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary/30 dark:bg-primary-light/30 rounded-full pointer-events-none"
                      layoutId="hoverIndicator"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: '100%' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </nav>
          
          {/* Theme Toggle Button */}
          <motion.button
            onClick={handleThemeToggle}
            className="relative w-10 h-10 rounded-full flex items-center justify-center bg-bg-surface hover:bg-bg-muted transition-colors outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          >
            <div className="relative w-6 h-6">
              <AnimatePresence initial={false} mode="wait">
                {theme === 'light' ? (
                  <motion.div
                    key="sun"
                    className="absolute inset-0 text-amber-500 flex items-center justify-center"
                    variants={sunMoonIconVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    whileHover="hover"
                    custom={true}
                  >
                    <FaSun className="text-xl pointer-events-none" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    className="absolute inset-0 text-indigo-300 flex items-center justify-center"
                    variants={sunMoonIconVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    whileHover="hover"
                    custom={false}
                  >
                    <FaMoon className="text-xl pointer-events-none" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.button>
          
          <Button 
            variant="primary" 
            size="sm"
            animationStyle="glow"
          >
            <span className="text-xs mr-1">✨</span>
            Get Started
          </Button>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          {/* Theme Toggle for Mobile */}
          <motion.button
            onClick={handleThemeToggle}
            className="relative w-9 h-9 rounded-full flex items-center justify-center bg-bg-surface hover:bg-bg-muted transition-colors cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          >
            <AnimatePresence initial={false} mode="wait">
              {theme === 'light' ? (
                <motion.div
                  key="sun-mobile"
                  className="absolute inset-0 text-amber-500 flex items-center justify-center"
                  variants={sunMoonIconVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  custom={true}
                >
                  <FaSun className="text-lg pointer-events-none" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon-mobile"
                  className="absolute inset-0 text-indigo-300 flex items-center justify-center"
                  variants={sunMoonIconVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  custom={false}
                >
                  <FaMoon className="text-lg pointer-events-none" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
          
          {/* Hamburger Menu Toggle */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-md ${mobileMenuOpen ? 'bg-primary/10 text-primary' : 'text-text-muted hover:text-text'} transition-colors`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <AnimatePresence initial={false} mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaTimes className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaBars className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden overflow-hidden"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <motion.div className="py-4 px-4 space-y-4 border-t border-border mt-3 bg-bg-surface/80 backdrop-blur-sm rounded-b-lg">
              <motion.nav 
                className="flex flex-col gap-2"
                variants={mobileMenuVariants}
              >
                {navItems.map((item) => (
                  <motion.div
                    key={item.label}
                    className="relative overflow-hidden"
                    variants={mobileItemVariants}
                    whileHover={{ x: 3, transition: { type: "spring", stiffness: 300, damping: 25 } }}
                    whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                  >
                    <Link 
                      to={item.href}
                      onClick={() => handleNavItemClick(item)}
                      className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all relative ${
                        item.isActive 
                          ? 'bg-primary/15 text-primary dark:bg-primary-dark/20 dark:text-primary-light' 
                          : 'text-text hover:bg-bg-muted hover:text-primary'
                      }`}
                      aria-current={item.isActive ? 'page' : undefined}
                    >
                      <div className="flex items-center">
                        <span>{item.label}</span>
                        
                        {/* Active indicator */}
                        {item.isActive && (
                          <motion.span 
                            className="ml-auto text-primary dark:text-primary-light pointer-events-none"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 400 }}
                          >
                            •
                          </motion.span>
                        )}
                      </div>
                      
                      {/* Subtle shimmer effect on hover */}
                      <motion.div
                        className="absolute inset-0 -z-10 pointer-events-none"
                        initial={false}
                        whileHover={{
                          background: [
                            'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 100%)',
                            'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%)',
                            'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 100%)',
                          ],
                          transition: { 
                            duration: 2, 
                            repeat: Infinity,
                            ease: "easeInOut" 
                          }
                        }}
                      />
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>
              <Button 
                variant="primary" 
                size="md"
                className="w-full"
                animationStyle="shine"
              >
                <span className="text-xs mr-1">✨</span>
                Get Started
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header; 