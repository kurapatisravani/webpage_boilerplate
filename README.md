# React & Tailwind Design System

<p align="center">
  <img src="https://via.placeholder.com/1200x600?text=Design+System+Preview" alt="Design System Preview" width="800">
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#features">Features</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#usage">Usage</a> •
  <a href="#component-documentation">Documentation</a> •
  <a href="#customization">Customization</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind%20CSS-3.x-38B2AC?logo=tailwind-css" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT">
</p>

A modern, accessible, and highly customizable design system built with React and Tailwind CSS. This comprehensive template provides a robust collection of UI components, utilities, and design tokens to help you build beautiful, consistent, and user-friendly interfaces for your web applications.

## Overview

This design system represents a complete UI toolkit that follows modern web standards and best practices. Built on React and Tailwind CSS, it offers a powerful combination of component flexibility and styling simplicity. The system is designed to be:

### Core Principles

- **🌟 Accessible**: All components are developed following WCAG 2.1 AA guidelines, with proper ARIA attributes, keyboard navigation, and focus management.

- **📱 Responsive**: Components adapt seamlessly to different screen sizes, from mobile devices to large desktop displays.

- **🎨 Customizable**: Easy to adapt to your brand's design language through Tailwind configuration, theme context, and component props.

- **⚡ Performance-Optimized**: Lightweight implementation with code-splitting and optimized rendering to ensure fast load times and smooth user experience.

- **🧩 Composable**: Components are designed to work together seamlessly while remaining independent, allowing for flexible composition.

- **💻 Developer-Friendly**: Intuitive APIs, comprehensive TypeScript definitions, and detailed documentation make implementation straightforward.

- **🔄 Maintainable**: Consistent patterns and architecture make the codebase easy to maintain and extend.

## Features

### Component Library

Our design system follows the Atomic Design methodology, organizing components into three main categories:

#### Atoms (Basic UI Elements)

| Component | Description | Variants |
|-----------|-------------|----------|
| **Button** | Interactive clickable elements | Primary, Secondary, Outline, Ghost, Danger |
| **Typography** | Text styles and formatting | Headings (h1-h6), Body (body1, body2), Caption, Overline |
| **Input** | Text entry fields | Outlined, Filled, Underlined, Unstyled |
| **Badge** | Status indicators and counters | Default, Primary, Success, Warning, Error |
| **Checkbox** | Multi-selection controls | Default, Indeterminate, Disabled |
| **Radio** | Single selection controls | Default, Disabled |
| **Switch** | Toggle controls | Default, Disabled |
| **Icon** | Visual symbols | Multiple sizes, Animated options |
| **Spinner** | Loading indicators | Sizes (sm, md, lg), Colors, Animation styles |
| **Dropdown** | Selection menus | Default, Multiselect, Searchable |
| **Avatar** | User profile images | Sizes, Initials fallback, Status indicator |

#### Molecules (Compound Components)

| Component | Description | Features |
|-----------|-------------|----------|
| **Tabs** | Content organization | Horizontal/Vertical, Animated, Icon support |
| **Card** | Content containers | Elevations, Header/Body/Footer sections |
| **Tooltip** | Contextual information | Positions, Custom content, Delay control |
| **Calendar** | Date selection and display | Range selection, Min/Max dates, Custom rendering |
| **Toast** | Notification system | Success/Error/Info/Warning variants, Auto-dismiss |
| **DatePicker** | Date input with calendar | Range selection, Time selection, Localization |

#### Organisms (Complex UI Patterns)

| Component | Description | Features |
|-----------|-------------|----------|
| **Modal** | Dialog windows | Sizes, Custom headers, Backdrop options |
| **Nav** | Navigation components | Horizontal/Vertical, Mobile-responsive, Active states |
| **Table** | Data display | Sorting, Selection, Fixed headers, Custom cell rendering |
| **Drawer** | Side panels | Multiple positions, Backdrop options, Custom transitions |
| **Form** | Input collection | Validation, Error handling, Field grouping |
| **DataGrid** | Advanced data tables | Filtering, Pagination, Column resizing, Row grouping |
| **Carousel** | Image/content slideshows | Autoplay, Navigation controls, Multiple transitions |

### Design Tokens & Utilities

- **📊 Theme System**: Comprehensive theming with light/dark mode support
- **🎭 Color System**: Carefully crafted color palette with semantic color tokens
- **📏 Spacing System**: Consistent spacing scale for margins, paddings, and gaps
- **🖌️ Typography System**: Type scale with responsive sizing
- **⚡ Animation Library**: Pre-defined animations and transitions for UI elements
- **🧩 Layout Helpers**: Flex and grid utilities for common layout patterns
- **🔍 Focus Management**: Utilities for managing focus states and accessibility
- **🌐 Media Queries**: Responsive breakpoint utilities

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher (or yarn 1.22.x+)

### Installation

#### Option 1: Use as a template

```bash
# Create a new repository from this template on GitHub
# Then clone your new repository
git clone https://github.com/your-username/your-project.git

# Navigate to the project directory
cd your-project

# Install dependencies
npm install

# Start the development server
npm run dev
```

#### Option 2: Install in an existing project

```bash
# Clone the repository
git clone https://github.com/yourusername/design-system.git

# Navigate to the project directory
cd design-system

# Install dependencies
npm install

# Build the library
npm run build

# Link to your project or publish to npm
```

### Directory Structure

```
design-system/
├── src/
│   ├── components/
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   └── index.ts
│   ├── contexts/
│   │   └── ThemeContext.tsx
│   ├── hooks/
│   ├── styles/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── public/
├── .eslintrc.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## Usage

### Quick Start

Add the ThemeProvider to your root component:

```jsx
// src/index.tsx or src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

### Component Usage Examples

#### Basic Button Example

```jsx
import { Button } from './components/atoms/Button';

function MyComponent() {
  return (
    <div>
      <Button variant="primary" onClick={() => console.log('Clicked!')}>
        Click Me
      </Button>
      
      <Button 
        variant="outline" 
        size="lg" 
        leftIcon={<Icon name="download" />}
        isLoading={isLoading}
        disabled={!isValid}
      >
        Download Report
      </Button>
    </div>
  );
}
```

#### Form Example

```jsx
import { Form, Input, Select, Checkbox, Button } from './components';

function ContactForm() {
  const handleSubmit = (values) => {
    console.log('Form values:', values);
  };

  return (
    <Form 
      onSubmit={handleSubmit}
      initialValues={{ name: '', email: '', topic: 'support', subscribe: false }}
    >
      <Input 
        name="name"
        label="Your Name"
        placeholder="Enter your full name"
        required
        validations={[{ type: 'required', message: 'Name is required' }]}
      />
      
      <Input 
        name="email"
        type="email"
        label="Email Address"
        placeholder="your@email.com"
        required
        validations={[
          { type: 'required', message: 'Email is required' },
          { type: 'pattern', value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' }
        ]}
      />
      
      <Select
        name="topic"
        label="Topic"
        options={[
          { label: 'Support', value: 'support' },
          { label: 'Sales', value: 'sales' },
          { label: 'Feedback', value: 'feedback' }
        ]}
      />
      
      <Checkbox
        name="subscribe"
        label="Subscribe to newsletter"
      />
      
      <Button type="submit" variant="primary">Submit</Button>
    </Form>
  );
}
```

#### Modal Example

```jsx
import { useState } from 'react';
import { Modal, Button, Typography } from './components';

function ModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Important Information"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => { /* Handle confirm */ setIsOpen(false) }}>
              Confirm
            </Button>
          </div>
        }
      >
        <Typography variant="body1">
          This is the modal content. You can include any React components here.
        </Typography>
      </Modal>
    </>
  );
}
```

## Component Documentation

### Interactive Showcase

The design system includes a built-in component showcase that provides an interactive way to explore all components.

To access the showcase:
1. Start the development server: `npm run dev`
2. Navigate to `/components` in your browser
3. Browse components by category
4. Interact with live examples and view code snippets

### Component API Documentation

Each component is documented with:

- **Purpose**: What the component is designed for
- **Props**: All available props with types and default values
- **Variants**: Visual and functional variations
- **Examples**: Code samples showing common use cases
- **Accessibility**: ARIA attributes and keyboard behavior
- **Best Practices**: Guidelines for proper usage

Example of Button component documentation:

```tsx
/**
 * Button Component
 * 
 * A versatile button component that supports different variants, sizes, and states.
 * 
 * @component
 * @example
 * ```jsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click Me
 * </Button>
 * ```
 */
export interface ButtonProps {
  /**
   * The visual style of the button
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  
  /**
   * The size of the button
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Whether the button is in loading state
   * @default false
   */
  isLoading?: boolean;
  
  // ... other props documentation
}
```

## Customization

### Theming System

The design system uses a comprehensive theme context to manage design tokens. This allows for global theme changes and supports features like dark mode.

#### Customizing the Theme

```tsx
// src/contexts/ThemeContext.tsx
export const lightTheme = {
  colors: {
    primary: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      200: '#BFDBFE',
      300: '#93C5FD',
      400: '#60A5FA',
      500: '#3B82F6', // Base color
      600: '#2563EB',
      700: '#1D4ED8',
      800: '#1E40AF',
      900: '#1E3A8A',
    },
    // ... other color tokens
    
    // Semantic colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Background colors
    background: '#FFFFFF',
    surface: '#F9FAFB',
    
    // Text colors
    text: {
      primary: '#111827',
      secondary: '#4B5563',
      disabled: '#9CA3AF',
    },
  },
  
  spacing: {
    // ... spacing scale
  },
  
  typography: {
    // ... typography settings
  },
  
  // ... other design tokens
};

export const darkTheme = {
  colors: {
    // Dark mode color tokens
    // ...
  },
  // ...
};

// To customize the theme, modify these objects or create your own theme
```

#### Switching Themes

```tsx
import { useTheme } from './contexts/ThemeContext';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  );
}
```

### Tailwind Configuration

The design system is built on Tailwind CSS, which allows for extensive customization through the `tailwind.config.js` file.

```js
// tailwind.config.js
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Replace with your brand colors
        primary: {
          50: '#EFF6FF',
          // ... color shades
          600: '#2563EB',
        },
        secondary: {
          // ... color shades
        },
        // ... other custom colors
      },
      fontFamily: {
        sans: ['Inter var', 'ui-sans-serif', 'system-ui', /* ... */],
        // ... other font families
      },
      borderRadius: {
        'sm': '0.125rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      // ... extend other design tokens
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    // ... other plugins
  ],
};
```

### Component Customization

Most components accept props for customization:

1. **Via Props**: Most components have props for common customizations
   ```jsx
   <Button variant="primary" size="lg" className="rounded-full" />
   ```

2. **Via Tailwind Classes**: Use Tailwind classes for one-off styling
   ```jsx
   <Card className="shadow-xl bg-gradient-to-r from-blue-500 to-purple-500" />
   ```

3. **Via CSS Modules**: For component-specific styling
   ```jsx
   // MyCustomButton.module.css
   .customButton {
     /* Custom styles */
   }
   
   // MyCustomButton.tsx
   import styles from './MyCustomButton.module.css';
   
   function MyCustomButton(props) {
     return <Button {...props} className={styles.customButton} />;
   }
   ```

4. **Via Theme Override**: For global component styling
   ```jsx
   // In your theme configuration
   components: {
     Button: {
       baseStyle: {
         fontWeight: 'bold',
         // ... other base styles
       },
       variants: {
         custom: {
           // ... custom variant styles
         },
       },
     },
     // ... other component overrides
   }
   ```

## Contributing

We welcome contributions to improve this design system! Please follow these steps to contribute:

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** to your local machine
3. **Create a new branch** for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Development Workflow

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Make your changes**:
   - Follow the code style and patterns used in the project
   - Add tests for new functionality
   - Update documentation as needed

4. **Run tests**:
   ```bash
   npm test
   ```

5. **Build locally to verify**:
   ```bash
   npm run build
   ```

### Submitting Changes

1. **Commit your changes** with descriptive commit messages:
   ```bash
   git commit -m "Add feature: description of changes"
   ```

2. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Open a Pull Request** on GitHub
   - Provide a clear description of the changes
   - Reference any related issues

### Code Guidelines

- Follow the established code style (ESLint and Prettier are configured)
- Write meaningful commit messages following [Conventional Commits](https://www.conventionalcommits.org/)
- Add appropriate tests for new features or bug fixes
- Ensure components are accessible
- Update TypeScript definitions for any API changes
- Document new components or API changes

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types
- [Framer Motion](https://www.framer.com/motion/) - Animation library

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/yourusername">Your Name or Organization</a>
</p>

<p align="center">
  <a href="https://github.com/yourusername/design-system/issues">Report Bug</a> •
  <a href="https://github.com/yourusername/design-system/issues">Request Feature</a>
</p>
