import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser } from 'react-icons/fa';

export interface AvatarProps {
  /**
   * Image source URL
   */
  src?: string;
  
  /**
   * Alternative text for the image
   */
  alt?: string;
  
  /**
   * Size of the avatar
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Shape of the avatar
   */
  shape?: 'circle' | 'square' | 'rounded';
  
  /**
   * Border style
   */
  border?: 'none' | 'thin' | 'medium' | 'thick';
  
  /**
   * Fallback options when image fails to load
   */
  fallback?: 'initials' | 'icon' | 'color';
  
  /**
   * Initials to display when fallback is 'initials'
   */
  initials?: string;
  
  /**
   * Status indicator
   */
  status?: 'online' | 'offline' | 'away' | 'busy' | 'none';
  
  /**
   * Whether to show a hover effect
   */
  interactive?: boolean;
  
  /**
   * Click handler
   */
  onClick?: () => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  shape = 'circle',
  border = 'none',
  fallback = 'icon',
  initials = '',
  status = 'none',
  interactive = false,
  onClick,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  
  // Handle image load error
  const handleError = () => {
    setImageError(true);
  };
  
  // Get appropriate size class
  const getSizeClass = () => {
    switch (size) {
      case 'xs': return 'w-6 h-6 text-xs';
      case 'sm': return 'w-8 h-8 text-sm';
      case 'md': return 'w-10 h-10 text-base';
      case 'lg': return 'w-16 h-16 text-xl';
      case 'xl': return 'w-24 h-24 text-3xl';
      default: return 'w-10 h-10 text-base';
    }
  };
  
  // Get appropriate shape class
  const getShapeClass = () => {
    switch (shape) {
      case 'circle': return 'rounded-full';
      case 'square': return 'rounded-none';
      case 'rounded': return 'rounded-lg';
      default: return 'rounded-full';
    }
  };
  
  // Get appropriate border class
  const getBorderClass = () => {
    switch (border) {
      case 'none': return 'border-0';
      case 'thin': return 'border border-border';
      case 'medium': return 'border-2 border-border';
      case 'thick': return 'border-4 border-border';
      default: return 'border-0';
    }
  };
  
  // Get status indicator color
  const getStatusColor = () => {
    switch (status) {
      case 'online': return 'bg-success';
      case 'offline': return 'bg-text-muted';
      case 'away': return 'bg-warning';
      case 'busy': return 'bg-danger';
      default: return '';
    }
  };
  
  // Get fallback background color based on initials
  const getFallbackColor = () => {
    if (fallback !== 'color' || !initials) return 'bg-bg-muted';
    
    // Generate a deterministic color based on initials
    const hash = initials.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    // Generate hue between 0 and 360
    const hue = hash % 360;
    return `bg-[hsl(${hue},85%,60%)]`;
  };
  
  // Combine CSS classes
  const avatarClasses = [
    getSizeClass(),
    getShapeClass(),
    getBorderClass(),
    imageError ? getFallbackColor() : 'bg-transparent',
    interactive ? 'cursor-pointer hover:ring-2 hover:ring-primary/50' : '',
    'relative flex items-center justify-center text-white font-medium overflow-hidden transition-all duration-200',
    className
  ].filter(Boolean).join(' ');
  
  // Create motion variants for hover effect
  const hoverVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  };
  
  // Render avatar content (image or fallback)
  const renderContent = () => {
    if (src && !imageError) {
      return (
        <img
          src={src}
          alt={alt}
          onError={handleError}
          className="w-full h-full object-cover"
        />
      );
    }
    
    if (fallback === 'initials' && initials) {
      return <span>{initials.substring(0, 2).toUpperCase()}</span>;
    }
    
    if (fallback === 'icon' || fallback === 'color') {
      return <FaUser className="w-1/2 h-1/2 opacity-75" />;
    }
    
    return null;
  };
  
  return (
    <motion.div
      className={avatarClasses}
      variants={interactive ? hoverVariants : undefined}
      initial="initial"
      whileHover={interactive ? "hover" : undefined}
      whileTap={interactive && onClick ? "tap" : undefined}
      onClick={interactive && onClick ? onClick : undefined}
      aria-label={alt}
    >
      {renderContent()}
      
      {/* Status indicator */}
      {status !== 'none' && (
        <span
          className={`absolute bottom-0 right-0 w-1/4 h-1/4 ${getStatusColor()} ${shape === 'circle' ? 'rounded-full' : 'rounded-full'} ring-2 ring-bg`}
          aria-label={`Status: ${status}`}
        />
      )}
    </motion.div>
  );
};

export default Avatar; 