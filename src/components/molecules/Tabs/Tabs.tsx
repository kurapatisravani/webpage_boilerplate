import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '../../atoms/Typography/Typography';

type TabVariant = 'underlined' | 'contained' | 'pills' | 'buttons';
type TabSize = 'sm' | 'md' | 'lg';
type TabAlignment = 'start' | 'center' | 'end' | 'stretch';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  defaultActiveTab?: string;
  activeTab?: string;
  onTabChange?: (id: string) => void;
  variant?: TabVariant;
  size?: TabSize;
  fullWidth?: boolean;
  alignment?: TabAlignment;
  animated?: boolean;
  className?: string;
  tabListClassName?: string;
  tabPanelClassName?: string;
  animateIndicator?: boolean;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  defaultActiveTab,
  activeTab: controlledActiveTab,
  onTabChange,
  variant = 'underlined',
  size = 'md',
  fullWidth = false,
  alignment = 'start',
  animated = true,
  className = '',
  tabListClassName = '',
  tabPanelClassName = '',
  animateIndicator = true,
}) => {
  // State for active tab (controlled or uncontrolled)
  const [activeTabId, setActiveTabId] = useState<string>(
    controlledActiveTab || defaultActiveTab || (items.length > 0 ? items[0].id : '')
  );
  
  // Refs for the active tab and indicator
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    height: 2
  });
  const tabListRef = useRef<HTMLDivElement>(null);
  
  // Update active tab when controlled prop changes
  useEffect(() => {
    if (controlledActiveTab !== undefined) {
      setActiveTabId(controlledActiveTab);
    }
  }, [controlledActiveTab]);
  
  // Handle tab change
  const handleTabChange = (id: string) => {
    // Don't do anything if the tab is disabled
    const tab = items.find(item => item.id === id);
    if (tab?.disabled) return;
    
    if (controlledActiveTab === undefined) {
      setActiveTabId(id);
    }
    
    if (onTabChange) {
      onTabChange(id);
    }
  };
  
  // Update indicator position
  const updateIndicator = () => {
    const activeTab = tabRefs.current[activeTabId];
    if (!activeTab || !tabListRef.current) return;
    
    const tabRect = activeTab.getBoundingClientRect();
    const tabListRect = tabListRef.current.getBoundingClientRect();
    
    setIndicatorStyle({
      left: tabRect.left - tabListRect.left,
      width: tabRect.width,
      height: variant === 'pills' ? tabRect.height : 2
    });
  };
  
  // Update indicator when active tab changes or window resizes
  useEffect(() => {
    updateIndicator();
    
    const handleResize = () => {
      updateIndicator();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [activeTabId, variant]);
  
  // Style classes based on variant
  const getTabListClasses = () => {
    const baseClasses = 'relative flex';
    
    let variantClasses = '';
    let alignmentClasses = '';
    
    switch (variant) {
      case 'contained':
        variantClasses = 'p-1 bg-bg-subtle rounded-lg';
        break;
      case 'pills':
        variantClasses = 'p-1 space-x-1';
        break;
      case 'buttons':
        variantClasses = 'p-0 space-x-2';
        break;
      default:
        variantClasses = 'border-b border-border';
        break;
    }
    
    switch (alignment) {
      case 'center':
        alignmentClasses = 'justify-center';
        break;
      case 'end':
        alignmentClasses = 'justify-end';
        break;
      case 'stretch':
        alignmentClasses = 'justify-stretch';
        break;
      default:
        alignmentClasses = 'justify-start';
        break;
    }
    
    return `${baseClasses} ${variantClasses} ${alignmentClasses} ${tabListClassName}`;
  };
  
  const getTabClasses = (item: TabItem) => {
    const isActive = activeTabId === item.id;
    const isDisabled = item.disabled;
    
    const baseClasses = 'relative flex items-center transition-all outline-none';
    
    let variantClasses = '';
    let sizeClasses = '';
    let stateClasses = '';
    
    switch (variant) {
      case 'contained':
        variantClasses = isActive 
          ? 'bg-bg-base text-primary shadow-sm rounded'
          : 'text-text-muted hover:text-text-base hover:bg-bg-muted rounded';
        break;
      case 'pills':
        variantClasses = isActive 
          ? 'bg-primary text-white rounded-full'
          : 'text-text-muted hover:text-text-base hover:bg-bg-muted rounded-full';
        break;
      case 'buttons':
        variantClasses = isActive 
          ? 'bg-primary text-white rounded-md shadow-sm'
          : 'bg-bg-subtle text-text-base hover:bg-bg-muted rounded-md';
        break;
      default:
        variantClasses = isActive 
          ? 'text-primary'
          : 'text-text-muted hover:text-text-base';
        break;
    }
    
    switch (size) {
      case 'sm':
        sizeClasses = 'text-sm py-1 px-2';
        break;
      case 'lg':
        sizeClasses = 'text-base py-2.5 px-4';
        break;
      default:
        sizeClasses = 'text-base py-2 px-3';
        break;
    }
    
    stateClasses = isDisabled 
      ? 'opacity-50 cursor-not-allowed'
      : 'cursor-pointer';
    
    return `${baseClasses} ${variantClasses} ${sizeClasses} ${stateClasses} ${fullWidth ? 'flex-1' : ''}`;
  };
  
  // Get indicator styles based on variant
  const getIndicatorStyles = () => {
    if (!animateIndicator) return {};
    
    switch (variant) {
      case 'contained':
      case 'pills':
      case 'buttons':
        return {
          position: 'absolute',
          left: 0,
          top: 0,
          width: 0,
          display: 'none'
        };
      default:
        return {
          position: 'absolute',
          bottom: 0,
          height: '2px',
          backgroundColor: 'var(--color-primary)',
          borderRadius: '1px',
          transition: 'left 0.3s ease, width 0.3s ease',
          left: indicatorStyle.left,
          width: indicatorStyle.width
        };
    }
  };
  
  // Save ref callback
  const saveTabRef = (id: string) => (el: HTMLButtonElement | null) => {
    tabRefs.current[id] = el;
  };
  
  // Active tab content
  const activeTabContent = items.find(item => item.id === activeTabId)?.content;
  
  return (
    <div className={`tabs ${className}`}>
      {/* Tab list */}
      <div ref={tabListRef} className={getTabListClasses()} role="tablist">
        {items.map(item => (
          <button
            key={item.id}
            ref={saveTabRef(item.id)}
            role="tab"
            aria-selected={activeTabId === item.id}
            aria-controls={`tabpanel-${item.id}`}
            id={`tab-${item.id}`}
            tabIndex={activeTabId === item.id ? 0 : -1}
            className={getTabClasses(item)}
            onClick={() => handleTabChange(item.id)}
            disabled={item.disabled}
          >
            {item.icon && (
              <span className="mr-2">
                {item.icon}
              </span>
            )}
            {typeof item.label === 'string' ? (
              <Typography 
                variant="body2" 
                weight={activeTabId === item.id ? 'medium' : 'regular'}
                className="whitespace-nowrap"
              >
                {item.label}
              </Typography>
            ) : (
              item.label
            )}
          </button>
        ))}
        
        {/* Animated indicator for underlined variant */}
        {variant === 'underlined' && animateIndicator && (
          <motion.div
            className="absolute bottom-0 bg-primary rounded-t"
            style={getIndicatorStyles() as React.CSSProperties}
            initial={false}
            animate={{ 
              left: indicatorStyle.left,
              width: indicatorStyle.width,
              opacity: 1 
            }}
            transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
          />
        )}
      </div>
      
      {/* Tab content */}
      <div className={`mt-4 ${tabPanelClassName}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTabId}
            role="tabpanel"
            id={`tabpanel-${activeTabId}`}
            aria-labelledby={`tab-${activeTabId}`}
            initial={animated ? { opacity: 0, x: 10 } : undefined}
            animate={animated ? { opacity: 1, x: 0 } : undefined}
            exit={animated ? { opacity: 0, x: -10 } : undefined}
            transition={{ duration: 0.2 }}
          >
            {activeTabContent}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Tabs; 