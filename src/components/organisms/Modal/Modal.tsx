import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { Typography } from '../../atoms/Typography/Typography';
import { Button } from '../../atoms/Button/Button';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  // Core content
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  
  // Behavior
  isOpen: boolean;
  onClose: () => void;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  
  // Style and layout
  size?: ModalSize;
  position?: 'center' | 'top';
  hideCloseButton?: boolean;
  scrollBehavior?: 'inside' | 'outside';
  
  // HTML props
  className?: string;
  overlayClassName?: string;
  id?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  
  // Actions
  primaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    isLoading?: boolean;
    disabled?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    isLoading?: boolean;
    disabled?: boolean;
  };
}

export const Modal: React.FC<ModalProps> = ({
  // Core content
  title,
  children,
  footer,
  
  // Behavior
  isOpen,
  onClose,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  
  // Style and layout
  size = 'md',
  position = 'center',
  hideCloseButton = false,
  scrollBehavior = 'inside',
  
  // HTML props
  className = '',
  overlayClassName = '',
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  
  // Actions
  primaryAction,
  secondaryAction,
}) => {
  // Refs
  const modalRef = useRef<HTMLDivElement>(null);
  const [previousFocus, setPreviousFocus] = useState<HTMLElement | null>(null);
  
  // Handle click outside
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };
  
  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);
  
  // Handle focus trap and restoration
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      setPreviousFocus(document.activeElement as HTMLElement);
      
      // Focus the modal or the first focusable element inside it
      if (modalRef.current) {
        modalRef.current.focus();
      }
      
      // Prevent scrolling on the body
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      // Restore previous focus and scrolling when modal closes
      if (previousFocus) {
        previousFocus.focus();
      }
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Size styles
  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };
  
  // Position styles
  const positionStyles = {
    center: 'items-center',
    top: 'items-start pt-20',
  };
  
  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };
  
  const modalVariants = {
    hidden: { 
      opacity: 0, 
      y: position === 'center' ? 10 : -10,
      scale: 0.98,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1, 
      transition: { 
        type: 'spring',
        damping: 25,
        stiffness: 300,
        duration: 0.3,
      } 
    },
    exit: { 
      opacity: 0, 
      y: position === 'center' ? 10 : -10,
      scale: 0.98, 
      transition: { duration: 0.2 } 
    },
  };
  
  // Generate footer from primary and secondary actions if no custom footer provided
  const actionFooter = (!footer && (primaryAction || secondaryAction)) ? (
    <div className="flex justify-end gap-3 pt-4">
      {secondaryAction && (
        <Button
          variant={secondaryAction.variant || 'outline'}
          onClick={secondaryAction.onClick}
          isLoading={secondaryAction.isLoading}
          disabled={secondaryAction.disabled}
        >
          {secondaryAction.label}
        </Button>
      )}
      {primaryAction && (
        <Button
          variant={primaryAction.variant || 'primary'}
          onClick={primaryAction.onClick}
          isLoading={primaryAction.isLoading}
          disabled={primaryAction.disabled}
        >
          {primaryAction.label}
        </Button>
      )}
    </div>
  ) : null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay */}
          <motion.div
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm ${overlayClassName}`}
            onClick={handleOverlayClick}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
          />
          
          {/* Modal positioning container */}
          <div className={`flex min-h-full justify-center ${positionStyles[position]} p-4`}>
            {/* Modal */}
            <motion.div
              ref={modalRef}
              id={id}
              className={`w-full ${sizeStyles[size]} bg-bg-surface dark:bg-bg-surface/95 shadow-xl rounded-lg border border-border/30 backdrop-blur-sm relative flex flex-col outline-none ${className}`}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              role="dialog"
              aria-modal="true"
              aria-labelledby={ariaLabelledBy || `${id}-title`}
              aria-describedby={ariaDescribedBy}
              tabIndex={-1}
            >
              {/* Header */}
              {title && (
                <div className="px-6 py-4 border-b border-border/30 flex items-center justify-between">
                  <div className="pr-8" id={`${id}-title`}>
                    {typeof title === 'string' ? (
                      <Typography variant="subtitle1" weight="semibold">
                        {title}
                      </Typography>
                    ) : (
                      title
                    )}
                  </div>
                  
                  {!hideCloseButton && (
                    <button
                      className="absolute top-4 right-4 p-2 rounded-full hover:bg-bg-surface-hover transition-colors"
                      onClick={onClose}
                      aria-label="Close modal"
                    >
                      <FaTimes size={16} className="text-text-muted" />
                    </button>
                  )}
                </div>
              )}
              
              {/* Body */}
              <div 
                className={`px-6 py-4 ${scrollBehavior === 'inside' ? 'overflow-y-auto' : ''} flex-1`}
              >
                {children}
              </div>
              
              {/* Footer */}
              {(footer || actionFooter) && (
                <div className="px-6 py-4 border-t border-border/30">
                  {footer || actionFooter}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal; 