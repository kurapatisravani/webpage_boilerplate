import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaTimes, FaExclamationTriangle, FaInfo, FaBell } from 'react-icons/fa';
import { Typography } from '../../atoms/Typography/Typography';

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'default';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
export type ToastAnimationStyle = 'fade' | 'slide' | 'zoom' | 'flip';

// Toast item interface
export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
  position?: ToastPosition;
  animationStyle?: ToastAnimationStyle;
  onClose?: () => void;
}

// Toast context interface
export interface ToastContextType {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
  removeAllToasts: () => void;
  updateToast: (id: string, toast: Partial<Omit<ToastItem, 'id'>>) => void;
}

// Create the toast context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast provider props
export interface ToastProviderProps {
  children: React.ReactNode;
  defaultPosition?: ToastPosition;
  defaultDuration?: number;
  defaultAnimationStyle?: ToastAnimationStyle;
  maxToasts?: number;
}

// Toast provider component
export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  defaultPosition = 'top-right',
  defaultDuration = 3000,
  defaultAnimationStyle = 'slide',
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Add a new toast
  const addToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    
    setToasts((currentToasts) => {
      // If we've reached the max number of toasts, remove the oldest one
      if (currentToasts.length >= maxToasts) {
        return [
          ...currentToasts.slice(1),
          { ...toast, id, position: toast.position || defaultPosition, duration: toast.duration || defaultDuration },
        ];
      }
      
      return [
        ...currentToasts,
        { ...toast, id, position: toast.position || defaultPosition, duration: toast.duration || defaultDuration },
      ];
    });
    
    return id;
  }, [defaultPosition, defaultDuration, maxToasts]);

  // Remove a toast by ID
  const removeToast = useCallback((id: string) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  // Remove all toasts
  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Update an existing toast
  const updateToast = useCallback((id: string, updates: Partial<Omit<ToastItem, 'id'>>) => {
    setToasts((currentToasts) =>
      currentToasts.map((toast) =>
        toast.id === id ? { ...toast, ...updates } : toast
      )
    );
  }, []);

  // Create the context value
  const contextValue = {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
    updateToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer 
        toasts={toasts} 
        removeToast={removeToast} 
        defaultAnimationStyle={defaultAnimationStyle} 
      />
    </ToastContext.Provider>
  );
};

// Custom hook to use the toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};

// Toast container props
interface ToastContainerProps {
  toasts: ToastItem[];
  removeToast: (id: string) => void;
  defaultAnimationStyle: ToastAnimationStyle;
}

// Toast container component
const ToastContainer: React.FC<ToastContainerProps> = ({ 
  toasts, 
  removeToast,
  defaultAnimationStyle 
}) => {
  // Group toasts by position
  const groupedToasts = toasts.reduce<Record<ToastPosition, ToastItem[]>>(
    (groups, toast) => {
      const position = toast.position || 'top-right';
      if (!groups[position]) {
        groups[position] = [];
      }
      groups[position].push(toast);
      return groups;
    },
    {} as Record<ToastPosition, ToastItem[]>
  );

  // Position styling
  const positionStyles: Record<ToastPosition, string> = {
    'top-right': 'top-4 right-4 flex flex-col items-end',
    'top-left': 'top-4 left-4 flex flex-col items-start',
    'bottom-right': 'bottom-4 right-4 flex flex-col items-end',
    'bottom-left': 'bottom-4 left-4 flex flex-col items-start',
    'top-center': 'top-4 left-1/2 -translate-x-1/2 flex flex-col items-center',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center',
  };

  return (
    <>
      {Object.entries(groupedToasts).map(([position, positionToasts]) => (
        <div
          key={position}
          className={`fixed z-50 space-y-2 ${positionStyles[position as ToastPosition]}`}
          style={{ pointerEvents: 'none' }}
        >
          <AnimatePresence>
            {positionToasts.map((toast) => (
              <Toast
                key={toast.id}
                toast={toast}
                onClose={() => {
                  removeToast(toast.id);
                  if (toast.onClose) {
                    toast.onClose();
                  }
                }}
                animationStyle={toast.animationStyle || defaultAnimationStyle}
              />
            ))}
          </AnimatePresence>
        </div>
      ))}
    </>
  );
};

// Single toast props
interface ToastProps {
  toast: ToastItem;
  onClose: () => void;
  animationStyle: ToastAnimationStyle;
}

// Animation variants based on position and style
const getAnimationVariants = (position: ToastPosition, style: ToastAnimationStyle) => {
  const isTop = position.startsWith('top');
  const isCenter = position.includes('center');
  
  // Slide animations
  if (style === 'slide') {
    if (position.includes('right')) {
      return {
        hidden: { x: 100, opacity: 0 },
        visible: { x: 0, opacity: 1 },
        exit: { x: 100, opacity: 0 },
      };
    } else if (position.includes('left')) {
      return {
        hidden: { x: -100, opacity: 0 },
        visible: { x: 0, opacity: 1 },
        exit: { x: -100, opacity: 0 },
      };
    } else {
      // Center positions
      return {
        hidden: { y: isTop ? -50 : 50, opacity: 0 },
        visible: { y: 0, opacity: 1 },
        exit: { y: isTop ? -50 : 50, opacity: 0 },
      };
    }
  }
  
  // Zoom animation
  if (style === 'zoom') {
    return {
      hidden: { scale: 0.8, opacity: 0 },
      visible: { scale: 1, opacity: 1 },
      exit: { scale: 0.8, opacity: 0 },
    };
  }
  
  // Flip animation
  if (style === 'flip') {
    return {
      hidden: { rotateX: 90, opacity: 0 },
      visible: { rotateX: 0, opacity: 1 },
      exit: { rotateX: 90, opacity: 0 },
    };
  }
  
  // Default fade animation
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };
};

// Toast component
export const Toast: React.FC<ToastProps> = ({ toast, onClose, animationStyle }) => {
  const { id, type, title, message, duration = 3000, position = 'top-right' } = toast;

  // Auto-close timer
  useEffect(() => {
    if (duration !== Infinity) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  // Type-based styling
  const typeStyles: Record<ToastType, { bgColor: string; icon: React.ReactNode }> = {
    success: {
      bgColor: 'bg-success/10 border-success/30',
      icon: <FaCheck className="text-success" />,
    },
    error: {
      bgColor: 'bg-error/10 border-error/30',
      icon: <FaTimes className="text-error" />,
    },
    warning: {
      bgColor: 'bg-warning/10 border-warning/30',
      icon: <FaExclamationTriangle className="text-warning" />,
    },
    info: {
      bgColor: 'bg-primary/10 border-primary/30',
      icon: <FaInfo className="text-primary" />,
    },
    default: {
      bgColor: 'bg-bg-surface border-border',
      icon: <FaBell className="text-text-secondary" />,
    },
  };

  // Animation variants
  const variants = getAnimationVariants(position, animationStyle);

  return (
    <motion.div
      layout
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.2 }}
      className={`max-w-xs md:max-w-md w-full rounded-lg shadow-lg border ${
        typeStyles[type].bgColor
      } backdrop-blur-sm p-3 pointer-events-auto`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          {typeStyles[type].icon}
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <Typography variant="subtitle2" weight="medium" className="mb-0.5">
              {title}
            </Typography>
          )}
          <Typography variant="body2" className="text-text-secondary">
            {message}
          </Typography>
        </div>
        <button
          onClick={onClose}
          className="ml-3 flex-shrink-0 text-text-muted hover:text-text-base transition-colors"
          aria-label="Close toast"
        >
          <FaTimes size={14} />
        </button>
      </div>
    </motion.div>
  );
};

// Export the actual Toast component for direct use
// export default Toast; 