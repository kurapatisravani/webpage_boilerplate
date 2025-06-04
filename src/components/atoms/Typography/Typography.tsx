import React from 'react';
import { motion } from 'framer-motion';

// Typography variants - follows semantic HTML naming for clarity
type TypographyVariant = 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'h4' 
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'overline'
  | 'lead'
  | 'quote';

// Typography weights for fine-grained control
type TypographyWeight = 'light' | 'regular' | 'medium' | 'semibold' | 'bold';

// Typography alignment
type TypographyAlign = 'left' | 'center' | 'right' | 'justify';

// Typography decorations
type TypographyDecoration = 'none' | 'underline' | 'line-through';

// Typography color schemes
type TypographyColorScheme = 
  | 'primary' 
  | 'secondary' 
  | 'tertiary'
  | 'default'
  | 'muted'
  | 'inverted'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

// Animation variants for enhanced text effects
type AnimationVariant = 'none' | 'fadeIn' | 'slideIn' | 'highlight' | 'typewriter';

// HTML element types
type ElementType = 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'h4' 
  | 'h5' 
  | 'h6' 
  | 'p' 
  | 'span' 
  | 'blockquote';

interface TypographyProps {
  variant?: TypographyVariant;
  weight?: TypographyWeight;
  align?: TypographyAlign;
  decoration?: TypographyDecoration;
  colorScheme?: TypographyColorScheme;
  className?: string;
  children: React.ReactNode;
  id?: string;
  animate?: AnimationVariant;
  truncate?: boolean;
  lineClamp?: number;
  letterSpacing?: 'tight' | 'normal' | 'wide';
  leading?: 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';
  italic?: boolean;
  transform?: 'uppercase' | 'lowercase' | 'capitalize' | 'normal-case';
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  weight = 'regular',
  align = 'left',
  decoration = 'none',
  colorScheme = 'default',
  className = '',
  children,
  id,
  animate = 'none',
  truncate = false,
  lineClamp,
  letterSpacing = 'normal',
  leading = 'normal',
  italic = false,
  transform = 'normal-case',
}) => {
  // Mapping for HTML elements based on variant
  const variantMapping: Record<TypographyVariant, ElementType> = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    subtitle1: 'h6',
    subtitle2: 'h6',
    body1: 'p',
    body2: 'p',
    caption: 'span',
    overline: 'span',
    lead: 'p',
    quote: 'blockquote',
  };

  // Style mapping for different variants
  const variantStyles: Record<TypographyVariant, string> = {
    h1: 'text-4xl md:text-5xl',
    h2: 'text-3xl md:text-4xl',
    h3: 'text-2xl md:text-3xl',
    h4: 'text-xl md:text-2xl',
    h5: 'text-lg md:text-xl',
    h6: 'text-base md:text-lg',
    subtitle1: 'text-lg',
    subtitle2: 'text-base',
    body1: 'text-base',
    body2: 'text-sm',
    caption: 'text-xs',
    overline: 'text-xs uppercase tracking-wider',
    lead: 'text-xl',
    quote: 'text-lg border-l-4 pl-4 italic',
  };

  // Weight mapping
  const weightStyles: Record<TypographyWeight, string> = {
    light: 'font-light',
    regular: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  // Alignment mapping
  const alignStyles: Record<TypographyAlign, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };

  // Text decoration mapping
  const decorationStyles: Record<TypographyDecoration, string> = {
    none: '',
    underline: 'underline',
    'line-through': 'line-through',
  };

  // Color scheme mapping
  const colorSchemeStyles: Record<TypographyColorScheme, string> = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    tertiary: 'text-tertiary',
    default: 'text-text-base',
    muted: 'text-text-muted',
    inverted: 'text-bg-base',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    info: 'text-info',
  };

  // Letter spacing mapping
  const letterSpacingStyles: Record<'tight' | 'normal' | 'wide', string> = {
    tight: 'tracking-tight',
    normal: 'tracking-normal',
    wide: 'tracking-wide',
  };

  // Line height mapping
  const leadingStyles: Record<'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose', string> = {
    none: 'leading-none',
    tight: 'leading-tight',
    snug: 'leading-snug',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose',
  };

  // Animation variants
  const animationVariants = {
    none: {},
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.5 } }
    },
    slideIn: {
      initial: { x: -20, opacity: 0 },
      animate: { x: 0, opacity: 1, transition: { duration: 0.5 } }
    },
    highlight: {
      initial: { backgroundColor: 'rgba(255, 255, 0, 0.5)' },
      animate: { backgroundColor: 'rgba(255, 255, 0, 0)', transition: { duration: 1.5 } }
    },
    typewriter: {
      initial: {},
      animate: {}
    }
  };

  // Build the combined class names
  const combinedClassNames = [
    variantStyles[variant],
    weightStyles[weight],
    alignStyles[align],
    decorationStyles[decoration],
    colorSchemeStyles[colorScheme],
    letterSpacingStyles[letterSpacing],
    leadingStyles[leading],
    italic ? 'italic' : '',
    truncate ? 'truncate' : '',
    lineClamp ? `line-clamp-${lineClamp}` : '',
    transform,
    className
  ].filter(Boolean).join(' ');

  // Determine the appropriate HTML element based on variant
  const Component = variantMapping[variant];

  // Handle typewriter effect separately since it requires specific implementation
  if (animate === 'typewriter' && typeof children === 'string') {
    return (
      <TypewriterEffect
        text={children}
        element={Component}
        className={combinedClassNames}
        id={id}
      />
    );
  }

  // For other animation types, use motion component
  if (animate !== 'none' && animate !== 'typewriter') {
    const animProps = {
      initial: animationVariants[animate].initial,
      animate: animationVariants[animate].animate
    };

    if (Component === 'h1') {
      return <motion.h1 className={combinedClassNames} id={id} {...animProps}>{children}</motion.h1>;
    }
    if (Component === 'h2') {
      return <motion.h2 className={combinedClassNames} id={id} {...animProps}>{children}</motion.h2>;
    }
    if (Component === 'h3') {
      return <motion.h3 className={combinedClassNames} id={id} {...animProps}>{children}</motion.h3>;
    }
    if (Component === 'h4') {
      return <motion.h4 className={combinedClassNames} id={id} {...animProps}>{children}</motion.h4>;
    }
    if (Component === 'h5') {
      return <motion.h5 className={combinedClassNames} id={id} {...animProps}>{children}</motion.h5>;
    }
    if (Component === 'h6') {
      return <motion.h6 className={combinedClassNames} id={id} {...animProps}>{children}</motion.h6>;
    }
    if (Component === 'p') {
      return <motion.p className={combinedClassNames} id={id} {...animProps}>{children}</motion.p>;
    }
    if (Component === 'span') {
      return <motion.span className={combinedClassNames} id={id} {...animProps}>{children}</motion.span>;
    }
    if (Component === 'blockquote') {
      return <motion.blockquote className={combinedClassNames} id={id} {...animProps}>{children}</motion.blockquote>;
    }
  }

  // Default rendering without animations
  switch (Component) {
    case 'h1':
      return <h1 className={combinedClassNames} id={id}>{children}</h1>;
    case 'h2':
      return <h2 className={combinedClassNames} id={id}>{children}</h2>;
    case 'h3':
      return <h3 className={combinedClassNames} id={id}>{children}</h3>;
    case 'h4':
      return <h4 className={combinedClassNames} id={id}>{children}</h4>;
    case 'h5':
      return <h5 className={combinedClassNames} id={id}>{children}</h5>;
    case 'h6':
      return <h6 className={combinedClassNames} id={id}>{children}</h6>;
    case 'p':
      return <p className={combinedClassNames} id={id}>{children}</p>;
    case 'span':
      return <span className={combinedClassNames} id={id}>{children}</span>;
    case 'blockquote':
      return <blockquote className={combinedClassNames} id={id}>{children}</blockquote>;
    default:
      return <p className={combinedClassNames} id={id}>{children}</p>;
  }
};

// Specialized typewriter effect component
const TypewriterEffect: React.FC<{
  text: string;
  element: ElementType;
  className: string;
  id?: string;
}> = ({ text, element, className, id }) => {
  const characters = text.split('');
  
  const content = characters.map((char, index) => (
    <motion.span
      key={`${char}-${index}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1, delay: index * 0.05 }}
    >
      {char}
    </motion.span>
  ));

  switch (element) {
    case 'h1':
      return <h1 className={className} id={id}>{content}</h1>;
    case 'h2':
      return <h2 className={className} id={id}>{content}</h2>;
    case 'h3':
      return <h3 className={className} id={id}>{content}</h3>;
    case 'h4':
      return <h4 className={className} id={id}>{content}</h4>;
    case 'h5':
      return <h5 className={className} id={id}>{content}</h5>;
    case 'h6':
      return <h6 className={className} id={id}>{content}</h6>;
    case 'p':
      return <p className={className} id={id}>{content}</p>;
    case 'span':
      return <span className={className} id={id}>{content}</span>;
    case 'blockquote':
      return <blockquote className={className} id={id}>{content}</blockquote>;
    default:
      return <p className={className} id={id}>{content}</p>;
  }
};

// Export common typography components for convenience
export const Heading1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h1" {...props} />
);

export const Heading2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h2" {...props} />
);

export const Heading3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h3" {...props} />
);

export const Heading4: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h4" {...props} />
);

export const Heading5: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h5" {...props} />
);

export const Heading6: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h6" {...props} />
);

export const Subtitle1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="subtitle1" {...props} />
);

export const Subtitle2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="subtitle2" {...props} />
);

export const Body1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body1" {...props} />
);

export const Body2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body2" {...props} />
);

export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="caption" {...props} />
);

export const Overline: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="overline" {...props} />
);

export const Lead: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="lead" {...props} />
);

export const Quote: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="quote" {...props} />
); 