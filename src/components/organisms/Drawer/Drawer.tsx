import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

export interface DrawerProps {
  /**
   * Whether the drawer is open
   */
  isOpen: boolean;
  
  /**
   * The position of the drawer
   */
  position?: 'left' | 'right' | 'top' | 'bottom';
  
  /**
   * The size of the drawer
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  /**
   * The header title for the drawer
   */
  title?: string;
  
  /**
   * Callback function when close button is clicked
   */
  onClose: () => void;
  
  /**
   * Whether to close the drawer when clicking outside
   */
  closeOnOutsideClick?: boolean;
  
  /**
   * Whether to close the drawer when pressing Escape key
   */
  closeOnEsc?: boolean;
  
  /**
   * Whether to show the close button
   */
  showCloseButton?: boolean;
  
  /**
   * The content of the drawer
   */
  children: React.ReactNode;
  
  /**
   * Whether to show an overlay
   */
  hasOverlay?: boolean;
  
  /**
   * CSS class for the drawer
   */
  className?: string;
  
  /**
   * CSS class for the content
   */
  contentClassName?: string;
  
  /**
   * The z-index for the drawer
   */
  zIndex?: number;
  
  /**
   * Whether the drawer is nested inside another drawer
   */
  isNested?: boolean;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  position = 'right',
  size = 'md',
  title,
  onClose,
  closeOnOutsideClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  children,
  hasOverlay = true,
  className = '',
  contentClassName = '',
  zIndex = 50,
  isNested = false,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  
  // Handle escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeOnEsc, isOpen, onClose]);
  
  // Handle clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        closeOnOutsideClick &&
        isOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [closeOnOutsideClick, isOpen, onClose]);
  
  // Handle body scroll lock
  useEffect(() => {
    if (isOpen && !isNested) {
      document.body.style.overflow = 'hidden';
    } else if (!isNested) {
      document.body.style.overflow = '';
    }
    
    return () => {
      if (!isNested) {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen, isNested]);
  
  // Get size class based on position and size
  const getSizeClass = () => {
    if (position === 'left' || position === 'right') {
      switch (size) {
        case 'sm': return 'w-64';
        case 'md': return 'w-80';
        case 'lg': return 'w-96';
        case 'xl': return 'w-[32rem]';
        case 'full': return 'w-full';
        default: return 'w-80';
      }
    } else {
      switch (size) {
        case 'sm': return 'h-1/4';
        case 'md': return 'h-1/3';
        case 'lg': return 'h-1/2';
        case 'xl': return 'h-3/4';
        case 'full': return 'h-full';
        default: return 'h-1/3';
      }
    }
  };
  
  // Motion variants for drawer and overlay
  const drawerVariants = {
    hidden: {
      x: position === 'right' ? '100%' : position === 'left' ? '-100%' : 0,
      y: position === 'bottom' ? '100%' : position === 'top' ? '-100%' : 0,
      transition: { type: 'tween', duration: 0.25, ease: 'easeInOut' }
    },
    visible: {
      x: 0,
      y: 0,
      transition: { type: 'tween', duration: 0.25, ease: 'easeInOut' }
    }
  };
  
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } }
  };
  
  // Drawer positioning classes
  const getPositionClasses = () => {
    switch (position) {
      case 'left': return 'left-0 top-0 bottom-0';
      case 'right': return 'right-0 top-0 bottom-0';
      case 'top': return 'top-0 left-0 right-0';
      case 'bottom': return 'bottom-0 left-0 right-0';
      default: return 'right-0 top-0 bottom-0';
    }
  };
  
  // Combine all drawer classes
  const drawerClasses = [
    'fixed bg-bg-surface shadow-xl flex flex-col',
    getPositionClasses(),
    getSizeClass(),
    className
  ].join(' ');
  
  // Get content classes based on position
  const getContentContainerClasses = () => {
    return [
      'flex-grow overflow-y-auto p-4',
      contentClassName
    ].join(' ');
  };
  
  // Create a portal for the drawer
  const drawerComponent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          {hasOverlay && (
            <motion.div
              className="fixed inset-0 bg-black/50"
              style={{ zIndex: zIndex - 1 }}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={overlayVariants}
            />
          )}
          
          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            className={drawerClasses}
            style={{ zIndex }}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={drawerVariants}
            aria-modal="true"
            role="dialog"
            aria-labelledby={title ? 'drawer-title' : undefined}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-4 border-b border-border">
                {title && (
                  <h2 id="drawer-title" className="text-lg font-medium">
                    {title}
                  </h2>
                )}
                
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full text-text-muted hover:text-text hover:bg-bg-muted transition-colors"
                    aria-label="Close drawer"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
            
            {/* Content */}
            <div className={getContentContainerClasses()}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
  
  return isNested ? drawerComponent : createPortal(drawerComponent, document.body);
};

export default Drawer; 