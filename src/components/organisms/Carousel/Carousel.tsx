import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiCircle } from 'react-icons/fi';

export interface CarouselProps {
  /**
   * Array of carousel items to display
   */
  items: React.ReactNode[];
  
  /**
   * Whether to auto-play the carousel
   */
  autoPlay?: boolean;
  
  /**
   * Interval between auto-play transitions (in milliseconds)
   */
  interval?: number;
  
  /**
   * Whether to show navigation arrows
   */
  showArrows?: boolean;
  
  /**
   * Whether to show navigation dots
   */
  showDots?: boolean;
  
  /**
   * Whether to show thumbnails (for image carousels)
   */
  showThumbnails?: boolean;
  
  /**
   * Custom rendering function for thumbnails
   */
  renderThumbnail?: (item: React.ReactNode, index: number) => React.ReactNode;
  
  /**
   * Whether to enable infinite looping
   */
  infinite?: boolean;
  
  /**
   * Animation effect for transitions
   */
  effect?: 'slide' | 'fade' | 'zoom';
  
  /**
   * Whether to enable center mode (current slide is centered)
   */
  centerMode?: boolean;
  
  /**
   * Whether to enable multiple slides
   */
  multipleSlides?: boolean;
  
  /**
   * Number of slides to show at once (only applicable if multipleSlides is true)
   */
  slidesToShow?: number;
  
  /**
   * Number of slides to scroll at once
   */
  slidesToScroll?: number;
  
  /**
   * Whether to enable swiping on touch devices
   */
  swipeable?: boolean;
  
  /**
   * Function called when active slide changes
   */
  onSlideChange?: (activeIndex: number) => void;
  
  /**
   * CSS class for the carousel container
   */
  className?: string;
  
  /**
   * CSS class for each slide
   */
  slideClassName?: string;
  
  /**
   * Height of the carousel (auto or specific value)
   */
  height?: 'auto' | string | number;
  
  /**
   * Whether to keep the aspect ratio of slides
   */
  maintainAspectRatio?: boolean;
  
  /**
   * Aspect ratio to maintain (width:height, e.g., '16:9')
   */
  aspectRatio?: string;
}

export const Carousel: React.FC<CarouselProps> = ({
  items,
  autoPlay = false,
  interval = 5000,
  showArrows = true,
  showDots = true,
  showThumbnails = false,
  renderThumbnail,
  infinite = true,
  effect = 'slide',
  centerMode = false,
  multipleSlides = false,
  slidesToShow = 1,
  slidesToScroll = 1,
  swipeable = true,
  onSlideChange,
  className = '',
  slideClassName = '',
  height = 'auto',
  maintainAspectRatio = false,
  aspectRatio = '16:9'
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const autoPlayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const totalSlides = items.length;
  
  // Determine the height style
  const heightStyle = maintainAspectRatio
    ? { paddingTop: calculateAspectRatioHeight(aspectRatio) }
    : typeof height === 'number'
      ? { height: `${height}px` }
      : height === 'auto'
        ? {}
        : { height };
  
  // Calculate height based on aspect ratio
  function calculateAspectRatioHeight(ratio: string) {
    const [width, height] = ratio.split(':').map(Number);
    return `${(height / width) * 100}%`;
  }
  
  // Stop autoplay on component unmount or when autoPlay prop changes
  useEffect(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
    
    if (autoPlay && !isHovering && totalSlides > 1) {
      autoPlayRef.current = setInterval(() => {
        goToNext();
      }, interval);
    }
    
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };
  }, [autoPlay, interval, activeIndex, isHovering, totalSlides]);
  
  // Handle slide changes
  useEffect(() => {
    if (onSlideChange) {
      onSlideChange(activeIndex);
    }
  }, [activeIndex, onSlideChange]);
  
  // Navigate to previous slide
  const goToPrevious = useCallback(() => {
    setActiveIndex(prev => {
      if (prev === 0) {
        return infinite ? totalSlides - 1 : 0;
      }
      return prev - 1;
    });
  }, [infinite, totalSlides]);
  
  // Navigate to next slide
  const goToNext = useCallback(() => {
    setActiveIndex(prev => {
      if (prev === totalSlides - 1) {
        return infinite ? 0 : totalSlides - 1;
      }
      return prev + 1;
    });
  }, [infinite, totalSlides]);
  
  // Navigate to specific slide
  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);
  
  // Handle mouse enter
  const handleMouseEnter = () => {
    setIsHovering(true);
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  
  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!swipeable) return;
    
    const touch = e.touches[0];
    setDragStartX(touch.clientX);
  };
  
  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipeable || dragStartX === null) return;
    
    const touch = e.touches[0];
    const diff = dragStartX - touch.clientX;
    
    // Threshold for swipe
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
      setDragStartX(null);
    }
  };
  
  // Handle touch end
  const handleTouchEnd = () => {
    setDragStartX(null);
  };
  
  // Get animation variants based on effect
  const getVariants = () => {
    switch (effect) {
      case 'fade':
        return {
          enter: { opacity: 0 },
          center: { opacity: 1 },
          exit: { opacity: 0 }
        };
      case 'zoom':
        return {
          enter: { opacity: 0, scale: 0.8 },
          center: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.2 }
        };
      default: // slide
        return {
          enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0
          }),
          center: {
            x: 0,
            opacity: 1
          },
          exit: (direction: number) => ({
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0
          })
        };
    }
  };
  
  // Animation variants
  const variants = getVariants();
  
  // Calculate direction for animation
  const [[page, direction], setPage] = useState([0, 0]);
  
  // Update page state when activeIndex changes
  useEffect(() => {
    const newDirection = page > activeIndex ? -1 : 1;
    setPage([activeIndex, newDirection]);
  }, [activeIndex, page]);
  
  // Render a single slide
  const renderSlide = (item: React.ReactNode, index: number) => {
    return (
      <motion.div
        key={index}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: 'spring', stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 }
        }}
        className={`absolute inset-0 ${slideClassName}`}
        style={{ zIndex: index === activeIndex ? 1 : 0 }}
      >
        {item}
      </motion.div>
    );
  };
  
  // Render multiple slides for gallery view
  const renderMultipleSlides = () => {
    const slidesPerView = Math.min(slidesToShow, totalSlides);
    const slideWidth = `${100 / slidesPerView}%`;
    
    return (
      <div className="flex transition-transform duration-300" style={{
        transform: `translateX(-${activeIndex * (100 / slidesPerView)}%)`
      }}>
        {items.map((item, index) => (
          <div
            key={index}
            className={`flex-shrink-0 ${slideClassName}`}
            style={{ width: slideWidth }}
          >
            {item}
          </div>
        ))}
      </div>
    );
  };
  
  // Render dots for navigation
  const renderDots = () => {
    if (!showDots || totalSlides <= 1) return null;
    
    return (
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === activeIndex
                ? 'bg-primary-600 scale-125'
                : 'bg-gray-400 hover:bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    );
  };
  
  // Render navigation arrows
  const renderArrows = () => {
    if (!showArrows || totalSlides <= 1) return null;
    
    return (
      <>
        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 z-10 transition-colors"
          onClick={goToPrevious}
          aria-label="Previous slide"
          disabled={!infinite && activeIndex === 0}
        >
          <FiChevronLeft className="w-6 h-6" />
        </button>
        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 z-10 transition-colors"
          onClick={goToNext}
          aria-label="Next slide"
          disabled={!infinite && activeIndex === totalSlides - 1}
        >
          <FiChevronRight className="w-6 h-6" />
        </button>
      </>
    );
  };
  
  // Render thumbnails
  const renderThumbnails = () => {
    if (!showThumbnails || totalSlides <= 1) return null;
    
    return (
      <div className="flex justify-center mt-4 space-x-2 overflow-x-auto">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`flex-shrink-0 border-2 transition-colors ${
              index === activeIndex
                ? 'border-primary-600'
                : 'border-transparent hover:border-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            {renderThumbnail ? (
              renderThumbnail(item, index)
            ) : (
              <div className="w-16 h-12 bg-gray-100 flex items-center justify-center">
                {index + 1}
              </div>
            )}
          </button>
        ))}
      </div>
    );
  };
  
  // Empty carousel check
  if (totalSlides === 0) {
    return (
      <div className={`relative overflow-hidden bg-bg-muted rounded-lg ${className}`} style={heightStyle}>
        <div className="absolute inset-0 flex items-center justify-center text-text-muted">
          No items to display
        </div>
      </div>
    );
  }
  
  return (
    <div className={`flex flex-col ${className}`}>
      <div
        className="relative overflow-hidden rounded-lg bg-bg-muted"
        style={heightStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {multipleSlides ? (
          renderMultipleSlides()
        ) : (
          <AnimatePresence initial={false} custom={direction}>
            {renderSlide(items[activeIndex], activeIndex)}
          </AnimatePresence>
        )}
        
        {renderArrows()}
        {renderDots()}
      </div>
      
      {renderThumbnails()}
    </div>
  );
};

export default Carousel; 