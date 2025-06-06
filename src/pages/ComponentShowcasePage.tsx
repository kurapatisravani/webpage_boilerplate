// src/pages/ComponentShowcasePage.tsx
import React, { useState } from 'react';
import { 
  FaHeart, FaArrowRight, FaCheck, FaStar, FaDownload, 
  FaTimes, FaSearch, FaSun, FaMoon, 
  FaCalendarAlt, FaExclamationTriangle, 
  FaInfo, FaEnvelope, FaUser, FaLock, FaSpinner, FaBell,
  FaFeather, FaRocket, FaHome, FaList, FaShieldAlt, FaMagic,
  FaGift, FaLink, FaFileAlt, FaCode, FaBook, FaCalendar, FaCog, FaGlobe,
  FaBoxOpen, FaLayerGroup, FaPalette, FaUniversalAccess, FaCubes, FaCircle
} from 'react-icons/fa';
import { ThemeToggleButton } from '../components/ThemeToggleButton';
import { Button } from '../components/atoms/Button/Button';
import { Typography } from '../components/atoms/Typography/Typography';
import { Input } from '../components/atoms/Input/Input';
import { Accordion } from '../components/molecules/Accordion/Accordion';
import { Tabs } from '../components/molecules/Tabs/Tabs';
import { Card } from '../components/molecules/Card/Card';
import { Tooltip } from '../components/molecules/Tooltip/Tooltip';
import { Modal } from '../components/organisms/Modal/Modal';
import { Badge } from '../components/atoms/Badge/Badge';
import { Checkbox } from '../components/atoms/Checkbox/Checkbox';
import { Radio } from '../components/atoms/Radio/Radio';
import { Switch } from '../components/atoms/Switch';
import { Icon } from '../components/atoms/Icon/Icon';
import { Spinner } from '../components/atoms/Spinner/Spinner';
import { Dropdown } from '../components/atoms/Dropdown';
import { Nav } from '../components/organisms/Nav/Nav';
import { Table } from '../components/organisms/Table/Table';
import { Calendar } from '../components/molecules/Calendar/Calendar';
import type { DateRange } from '../components/molecules/Calendar/Calendar';
import { DatePicker } from '../components/molecules/DatePicker/DatePicker';
import { ToastProvider, useToast } from '../components/molecules/Toast';
import type { ToastType, ToastPosition, ToastAnimationStyle } from '../components/molecules/Toast';

// Type definitions
type ComponentCategory = 'atoms' | 'molecules' | 'organisms' | 'templates' | 'pages';
type ComponentType = {
  name: string;
  category: ComponentCategory;
  description: string;
  component: React.FC;
  implemented: boolean;
};

// Update the animation styles type
type AnimationStyle = 'slide' | 'fade' | 'scale' | 'bounce';

// Update the button variant type
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

// Reusable section component for the showcase
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-12 p-6 bg-bg-surface rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold mb-6 text-text-base border-b border-border pb-2">{title}</h2>
    <div className="space-y-4">{children}</div>
  </section>
);

// Reusable subsection component for organizing components by type
const Subsection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-8">
    <h3 className="text-lg font-medium mb-3 text-text-secondary">{title}</h3>
    <div className="flex flex-wrap gap-4">
      {children}
    </div>
  </div>
);

// Component registry - define all components here
const componentRegistry: ComponentType[] = [
  {
    name: 'Design Principles',
    category: 'atoms',
    description: 'Core design principles and guidelines that inform our component library',
    component: DesignPrinciplesShowcase,
    implemented: true
  },
  {
    name: 'Button',
    category: 'atoms',
    description: 'Interactive button element with various styles and animations',
    component: ButtonShowcase,
    implemented: true
  },
  {
    name: 'Typography',
    category: 'atoms',
    description: 'Text elements including headings, paragraphs, and text styles',
    component: TypographyShowcase,
    implemented: true
  },
  {
    name: 'Input',
    category: 'atoms',
    description: 'Form input elements like text fields, checkboxes, radio buttons',
    component: InputShowcase,
    implemented: true
  },
  {
    name: 'Badge',
    category: 'atoms',
    description: 'Compact elements for status, counts, or labels',
    component: BadgeShowcase,
    implemented: true
  },
  {
    name: 'Checkbox',
    category: 'atoms',
    description: 'Selectable input control for multiple options',
    component: CheckboxShowcase,
    implemented: true
  },
  {
    name: 'Radio',
    category: 'atoms',
    description: 'Selectable input control for single option selection',
    component: RadioShowcase,
    implemented: true
  },
  {
    name: 'Switch',
    category: 'atoms',
    description: 'Toggle control for binary options',
    component: SwitchShowcase,
    implemented: true
  },
  {
    name: 'Icon',
    category: 'atoms',
    description: 'Visual symbols with customizable sizes and animations',
    component: IconShowcase,
    implemented: true
  },
  {
    name: 'Spinner',
    category: 'atoms',
    description: 'Loading indicators with various styles and animations',
    component: SpinnerShowcase,
    implemented: true
  },
  {
    name: 'Dropdown',
    category: 'atoms',
    description: 'Selection control for choosing from a list of options',
    component: DropdownShowcase,
    implemented: true
  },
  {
    name: 'Accordion',
    category: 'molecules',
    description: 'Expandable/collapsible content sections with smooth animations',
    component: AccordionShowcase,
    implemented: true
  },
  {
    name: 'Tabs',
    category: 'molecules',
    description: 'Tabbed interface for organizing content into multiple views',
    component: TabsShowcase,
    implemented: true
  },
  {
    name: 'Card',
    category: 'molecules',
    description: 'Containment component for grouping related content',
    component: CardShowcase,
    implemented: true
  },
  {
    name: 'Tooltip',
    category: 'molecules',
    description: 'Contextual information that appears on hover or click',
    component: TooltipShowcase,
    implemented: true
  },
  {
    name: 'Modal',
    category: 'organisms',
    description: 'Dialog window that appears over the main content',
    component: ModalShowcase,
    implemented: true
  },
  {
    name: 'Nav',
    category: 'organisms',
    description: 'Navigation component for site structure and wayfinding',
    component: NavShowcase,
    implemented: true
  },
  {
    name: 'Table',
    category: 'organisms',
    description: 'Data table with sorting, pagination, and selection capabilities',
    component: TableShowcase,
    implemented: true
  },
  {
    name: 'Colors & Themes',
    category: 'atoms',
    description: 'Color palette and theme demonstration',
    component: ColorsShowcase,
    implemented: true
  },
  {
    name: 'Calendar',
    category: 'molecules',
    description: 'Date selection component with range selection and customization options',
    component: CalendarShowcase,
    implemented: true
  },
  {
    name: 'Toast',
    category: 'molecules',
    description: 'Lightweight notification system with different positions and animations',
    component: ToastShowcase,
    implemented: true
  },
  {
    name: 'DatePicker',
    category: 'molecules',
    description: 'Date input with calendar popup for easy date selection',
    component: DatePickerShowcase,
    implemented: true
  }
];

// Navigation sidebar for component selection
const ComponentNav: React.FC<{
  components: ComponentType[];
  activeComponent: string;
  onSelectComponent: (name: string) => void;
}> = ({ components, activeComponent, onSelectComponent }) => {
  return (
    <aside className="bg-bg-surface p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-primary">Components</h3>
      <div className="space-y-4">
        {['atoms', 'molecules', 'organisms', 'templates', 'pages'].map((category) => {
          const categoryComponents = components.filter(c => c.category === category);
          if (categoryComponents.length === 0) return null;
          
          return (
            <div key={category} className="mb-4">
              <h4 className="text-md font-medium mb-2 text-text-secondary capitalize">{category}</h4>
              <ul className="space-y-1">
                {categoryComponents.map(comp => (
                  <li key={comp.name}>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        activeComponent === comp.name
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-bg-surface/80'
                      } ${!comp.implemented ? 'opacity-50 italic' : ''}`}
                      onClick={() => comp.implemented && onSelectComponent(comp.name)}
                      disabled={!comp.implemented}
                    >
                      {comp.name}
                      {!comp.implemented && ' (Coming Soon)'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

// Placeholder for components not yet implemented
function PlaceholderShowcase() {
  return (
    <div className="p-6 bg-background rounded-lg shadow-md flex flex-col items-center justify-center min-h-[200px]">
      <div className="text-4xl text-primary/30 mb-4">🚧</div>
      <h3 className="text-xl font-medium text-text-secondary mb-2">Coming Soon</h3>
      <p className="text-text-muted text-center max-w-md">
        This component is currently under development and will be available soon.
      </p>
    </div>
  );
}

// Component sections
function ButtonShowcase() {
  return (
    <div className="p-6 bg-background rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-text-primary">Buttons</h2>

      <Subsection title="Button Variants">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </Subsection>

      <Subsection title="Button Sizes">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </Subsection>

      <Subsection title="Loading State">
        <Button isLoading>Loading</Button>
        <Button variant="secondary" isLoading>Loading</Button>
        <Button variant="outline" isLoading>Loading</Button>
      </Subsection>

      <Subsection title="Disabled State">
        <Button disabled>Disabled</Button>
        <Button variant="secondary" disabled>Disabled</Button>
        <Button variant="outline" disabled>Disabled</Button>
      </Subsection>

      <Subsection title="Animation Styles">
        <Button animationStyle="grow">Grow Effect</Button>
        <Button animationStyle="glow" variant="secondary">Glow Effect</Button>
        <Button animationStyle="slide" variant="outline">Slide Effect</Button>
        <Button animationStyle="pulse" variant="primary">Pulse Effect</Button>
        <Button animationStyle="bounce" variant="secondary">Bounce Effect</Button>
        <Button animationStyle="shine" variant="primary">Shine Effect</Button>
        <Button animationStyle="none" variant="ghost">No Animation</Button>
      </Subsection>

      <Subsection title="Buttons with Icons">
        <Button leftIcon={FaHeart}>Like</Button>
        <Button rightIcon={FaArrowRight} variant="secondary">Next</Button>
        <Button leftIcon={FaCheck} variant="outline">Confirm</Button>
        <Button leftIcon={FaStar} rightIcon={FaArrowRight} variant="primary">Rate & Continue</Button>
      </Subsection>

      <Subsection title="Animation Control">
        <Button enableHoverAnimation={false} enableClickAnimation={true}>Click Only</Button>
        <Button enableHoverAnimation={true} enableClickAnimation={false} variant="secondary">Hover Only</Button>
        <Button enableIconAnimation={false} leftIcon={FaDownload} variant="outline">Static Icon</Button>
        <Button enableIconAnimation={true} rightIcon={FaBell} variant="primary">Animated Icon</Button>
      </Subsection>

      <Subsection title="Epic Animation Examples">
        <Button 
          leftIcon={FaRocket}
          animationStyle="grow"
          onClick={() => alert('Launching...')}
        >
          Launch
        </Button>
        <Button 
          leftIcon={FaShieldAlt}
          variant="secondary" 
          animationStyle="glow"
          onClick={() => alert('Protected!')}
        >
          Protect
        </Button>
        <Button 
          rightIcon={FaMagic} 
          variant="outline" 
          animationStyle="shine"
          onClick={() => alert('Magic happening!')}
        >
          Enchant
        </Button>
        <Button 
          leftIcon={FaGift}
          variant="primary" 
          animationStyle="bounce"
          onClick={() => alert('Gift received!')}
        >
          Gift
        </Button>
      </Subsection>
    </div>
  );
}

// Typography showcase component
function TypographyShowcase() {
  const [highlightText, setHighlightText] = useState(false);
  const [typingText, setTypingText] = useState(false);
  const [slideText, setSlideText] = useState(false);
  const [fadeText, setFadeText] = useState(false);

  return (
    <div className="p-6 bg-background rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-text-primary">Typography</h2>

      <Subsection title="Headings">
        <div className="w-full space-y-4">
          <Typography variant="h1">Heading 1</Typography>
          <Typography variant="h2">Heading 2</Typography>
          <Typography variant="h3">Heading 3</Typography>
          <Typography variant="h4">Heading 4</Typography>
          <Typography variant="h5">Heading 5</Typography>
          <Typography variant="h6">Heading 6</Typography>
        </div>
      </Subsection>

      <Subsection title="Subtitles">
        <div className="w-full space-y-4">
          <Typography variant="subtitle1">Subtitle 1 - Used for medium emphasis text</Typography>
          <Typography variant="subtitle2">Subtitle 2 - Used for medium emphasis text that is smaller</Typography>
        </div>
      </Subsection>

      <Subsection title="Body Text">
        <div className="w-full space-y-4">
          <Typography variant="body1">
            Body 1 - This is the standard text style for body copy. It should be used for most paragraph text on your site.
            The font size and line height are designed for good readability on screens across devices.
          </Typography>
          <Typography variant="body2">
            Body 2 - This is a smaller text style for secondary or supporting content. It can be used for less important information,
            captions, or places where space is limited.
          </Typography>
        </div>
      </Subsection>

      <Subsection title="Special Text Styles">
        <div className="w-full space-y-4">
          <Typography variant="lead">
            Lead - This larger, attention-grabbing text style is perfect for introductory paragraphs or important messages that need emphasis.
          </Typography>
          <Typography variant="quote">
            "Quote - This style is designed for quotations, featuring a left border and italic text to distinguish quoted content from regular paragraphs."
          </Typography>
          <Typography variant="overline">Overline - Small uppercase text often used above headings</Typography>
          <Typography variant="caption">Caption - Very small text used for auxiliary information like image captions or footnotes</Typography>
        </div>
      </Subsection>

      <Subsection title="Font Weights">
        <div className="w-full space-y-2">
          <Typography weight="light">Light weight text (300)</Typography>
          <Typography weight="regular">Regular weight text (400)</Typography>
          <Typography weight="medium">Medium weight text (500)</Typography>
          <Typography weight="semibold">Semibold weight text (600)</Typography>
          <Typography weight="bold">Bold weight text (700)</Typography>
        </div>
      </Subsection>

      <Subsection title="Text Alignment">
        <div className="w-full space-y-2">
          <Typography align="left">Left aligned text (default)</Typography>
          <Typography align="center">Center aligned text</Typography>
          <Typography align="right">Right aligned text</Typography>
          <Typography align="justify">
            Justify aligned text. This text is justified, which means it stretches to fill the width of its container,
            creating a clean edge on both the left and right sides. This can be useful for formal documents or when you want
            a very structured look.
          </Typography>
        </div>
      </Subsection>

      <Subsection title="Text Colors">
        <div className="w-full space-y-2">
          <Typography colorScheme="primary">Primary color text</Typography>
          <Typography colorScheme="secondary">Secondary color text</Typography>
          <Typography colorScheme="muted">Muted color text</Typography>
          <Typography colorScheme="success">Success color text</Typography>
          <Typography colorScheme="warning">Warning color text</Typography>
          <Typography colorScheme="error">Error color text</Typography>
        </div>
      </Subsection>

      <Subsection title="Text Decorations & Transforms">
        <div className="w-full space-y-2">
          <Typography decoration="underline">Underlined text</Typography>
          <Typography decoration="line-through">Line-through text</Typography>
          <Typography italic>Italic text</Typography>
          <Typography transform="uppercase">Uppercase text</Typography>
          <Typography transform="lowercase">Lowercase text</Typography>
          <Typography transform="capitalize">Capitalized text</Typography>
        </div>
      </Subsection>

      <Subsection title="Line Height & Letter Spacing">
        <div className="w-full space-y-6">
          <div>
            <Typography leading="tight" className="mb-1">Tight line height</Typography>
            <Typography leading="normal" className="mb-1">Normal line height</Typography>
            <Typography leading="relaxed" className="mb-1">Relaxed line height</Typography>
          </div>
          <div>
            <Typography letterSpacing="tight" className="mb-1">Tight letter spacing</Typography>
            <Typography letterSpacing="normal" className="mb-1">Normal letter spacing</Typography>
            <Typography letterSpacing="wide" className="mb-1">Wide letter spacing</Typography>
          </div>
        </div>
      </Subsection>

      <Subsection title="Text Truncation & Line Clamping">
        <div className="w-full space-y-4">
          <div className="max-w-xs">
            <Typography truncate>
              This text is truncated with an ellipsis because it's too long to fit in the container and would otherwise wrap to multiple lines.
            </Typography>
          </div>
          <div className="max-w-md">
            <Typography lineClamp={2}>
              This text is clamped to exactly 2 lines. If it's longer than that, it will be truncated with an ellipsis.
              This is useful for card descriptions, previews, or anywhere you need to enforce consistent height.
              No matter how much content is in this paragraph, it will never display more than 2 lines.
            </Typography>
          </div>
        </div>
      </Subsection>

      <Subsection title="Interactive Text Animations">
        <div className="w-full space-y-6">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <Typography weight="medium">Fade In Animation</Typography>
              <Button 
                size="sm" 
                onClick={() => setFadeText(prev => !prev)}
                animationStyle="grow"
              >
                {fadeText ? 'Reset' : 'Animate'}
              </Button>
            </div>
            <div className="p-4 bg-bg-surface rounded-md min-h-[60px] flex items-center">
              {fadeText ? (
                <Typography animate="fadeIn" key={`fade-${fadeText}`}>
                  This text smoothly fades into view, creating a subtle entrance that draws attention without disruption.
                </Typography>
              ) : (
                <Typography colorScheme="muted">Click the animate button to see the fade-in effect</Typography>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <Typography weight="medium">Slide In Animation</Typography>
              <Button 
                size="sm" 
                onClick={() => setSlideText(prev => !prev)}
                animationStyle="slide"
              >
                {slideText ? 'Reset' : 'Animate'}
              </Button>
            </div>
            <div className="p-4 bg-bg-surface rounded-md min-h-[60px] flex items-center overflow-hidden">
              {slideText ? (
                <Typography animate="slideIn" key={`slide-${slideText}`}>
                  This text slides in from the left, creating a dynamic entrance that guides the user's eye from left to right.
                </Typography>
              ) : (
                <Typography colorScheme="muted">Click the animate button to see the slide-in effect</Typography>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <Typography weight="medium">Highlight Animation</Typography>
              <Button 
                size="sm" 
                onClick={() => setHighlightText(prev => !prev)}
                animationStyle="glow"
              >
                {highlightText ? 'Reset' : 'Animate'}
              </Button>
            </div>
            <div className="p-4 bg-bg-surface rounded-md min-h-[60px] flex items-center">
              {highlightText ? (
                <Typography animate="highlight" key={`highlight-${highlightText}`}>
                  This text has a highlighting effect that draws attention to important information or new content.
                </Typography>
              ) : (
                <Typography colorScheme="muted">Click the animate button to see the highlight effect</Typography>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <Typography weight="medium">Typewriter Animation</Typography>
              <Button 
                size="sm" 
                onClick={() => setTypingText(prev => !prev)}
                animationStyle="pulse"
              >
                {typingText ? 'Reset' : 'Animate'}
              </Button>
            </div>
            <div className="p-4 bg-bg-surface rounded-md min-h-[60px] flex items-center">
              {typingText ? (
                <Typography animate="typewriter" key={`type-${typingText}`}>
                  This text appears character by character, mimicking the experience of typing.
                </Typography>
              ) : (
                <Typography colorScheme="muted">Click the animate button to see the typewriter effect</Typography>
              )}
            </div>
          </div>

          <div className="mt-4 p-4 bg-primary/10 rounded-md">
            <Typography variant="subtitle2" weight="medium" className="mb-2">Usage Guidelines</Typography>
            <Typography variant="body2">
              <ul className="list-disc pl-5 space-y-1">
                <li>Use animations purposefully to guide user attention or indicate state changes</li>
                <li>Fade-in: Best for page transitions and initial content loading</li>
                <li>Slide-in: Effective for sequential information or step-by-step processes</li>
                <li>Highlight: Useful for emphasizing new or important information</li>
                <li>Typewriter: Impactful for headlines or important messages that deserve focus</li>
              </ul>
            </Typography>
          </div>
        </div>
      </Subsection>
    </div>
  );
}

// Input showcase component
function InputShowcase() {
  const [inputValue, setInputValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [validationValue, setValidationValue] = useState('');
  const [animationState, setAnimationState] = useState<'default' | 'success' | 'error' | 'warning'>('default');

  // Validate the email format
  const validateEmail = (email: string) => {
    if (!email) return 'default';
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email) ? 'success' : 'error';
  };

  return (
    <div className="p-6 bg-background rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-text-primary">Inputs</h2>

      <Subsection title="Input Variants">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <Input
            label="Outlined Input (Default)"
            placeholder="Enter text here"
            variant="outlined"
            helperText="Default outlined style with a border"
          />
          <Input
            label="Filled Input"
            placeholder="Enter text here"
            variant="filled"
            helperText="Filled style with background color"
          />
          <Input
            label="Underlined Input"
            placeholder="Enter text here"
            variant="underlined"
            helperText="Only bottom border is visible"
          />
          <Input
            label="Unstyled Input"
            placeholder="Enter text here"
            variant="unstyled"
            helperText="No borders or backgrounds"
          />
        </div>
      </Subsection>

      <Subsection title="Input Sizes">
        <div className="flex flex-col space-y-4 w-full">
          <Input
            label="Small Input"
            placeholder="Small input"
            size="sm"
          />
          <Input
            label="Medium Input (Default)"
            placeholder="Medium input"
            size="md"
          />
          <Input
            label="Large Input"
            placeholder="Large input"
            size="lg"
          />
        </div>
      </Subsection>

      <Subsection title="Inputs with Icons">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <Input
            label="Input with Left Icon"
            placeholder="Enter your name"
            leftIcon={<FaUser />}
          />
          <Input
            label="Input with Right Icon"
            placeholder="Search..."
            rightIcon={<FaSearch />}
          />
          <Input
            label="Email Input"
            placeholder="Enter your email"
            type="email"
            leftIcon={<FaEnvelope />}
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            validationState={validateEmail(emailValue)}
            helperText={emailValue ? (validateEmail(emailValue) === 'success' ? "Valid email format" : "Invalid email format") : "Please enter your email"}
          />
          <Input
            label="Password Input"
            placeholder="Enter your password"
            type="password"
            leftIcon={<FaLock />}
            revealPassword
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            helperText="Click the eye icon to reveal password"
          />
        </div>
      </Subsection>

      <Subsection title="Validation States">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <Input
            label="Default State"
            placeholder="Enter text"
            validationState="default"
            helperText="This is the default state"
          />
          <Input
            label="Success State"
            placeholder="Enter text"
            validationState="success"
            helperText="This input has valid data"
            defaultValue="Valid input"
          />
          <Input
            label="Error State"
            placeholder="Enter text"
            validationState="error"
            helperText="There is an error with this input"
            defaultValue="Invalid input"
          />
          <Input
            label="Warning State"
            placeholder="Enter text"
            validationState="warning"
            helperText="This input needs attention"
            defaultValue="Warning input"
          />
        </div>
      </Subsection>

      <Subsection title="Interactive Validations">
        <div className="w-full space-y-4">
          <Typography variant="body2">Type "success", "error", or "warning" to see different validation states:</Typography>
          <Input
            label="Interactive Validation"
            placeholder="Type 'success', 'error', or 'warning'"
            value={validationValue}
            onChange={(e) => {
              const val = e.target.value;
              setValidationValue(val);
              
              if (val.toLowerCase() === 'success') {
                setAnimationState('success');
              } else if (val.toLowerCase() === 'error') {
                setAnimationState('error');
              } else if (val.toLowerCase() === 'warning') {
                setAnimationState('warning');
              } else {
                setAnimationState('default');
              }
            }}
            validationState={animationState}
            helperText={
              animationState === 'default' ? 'Type a validation state to see animation' :
              animationState === 'success' ? 'Great! Input is valid' :
              animationState === 'error' ? 'Oh no! There was an error' :
              'Caution: Please check this input'
            }
            enableValidationAnimation
            fullWidth
          />
        </div>
      </Subsection>

      <Subsection title="Micro-Animation Styles">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <Input
            label="Grow Animation"
            placeholder="Focus to see animation"
            animationStyle="grow"
            helperText="Scales slightly on focus"
          />
          <Input
            label="Highlight Animation"
            placeholder="Focus to see animation"
            animationStyle="highlight"
            helperText="Shows a highlight ring on focus"
          />
          <Input
            label="Bounce Animation"
            placeholder="Focus to see animation"
            animationStyle="bounce"
            helperText="Subtle bounce on focus"
          />
          <Input
            label="No Animation"
            placeholder="No animation on focus"
            animationStyle="none"
            helperText="No micro-animations applied"
          />
        </div>
      </Subsection>

      <Subsection title="Special Behaviors">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <Input
            label="Clearable Input"
            placeholder="Type something to see clear button"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            clearable
            onClear={() => setInputValue('')}
            helperText="X button appears when text is entered"
          />
          <Input
            label="Full Width Input"
            placeholder="This input takes full width"
            fullWidth
            helperText="Expands to fill available space"
          />
          <Input
            label="Required Input"
            placeholder="This field is required"
            required
            helperText="Notice the red asterisk"
          />
          <Input
            label="Disabled Input"
            placeholder="This input is disabled"
            disabled
            defaultValue="Can't edit this"
            helperText="Input cannot be edited"
          />
        </div>
      </Subsection>

      <Subsection title="Other Input Types">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <Input
            label="Number Input"
            type="number"
            placeholder="Enter a number"
            min={0}
            max={100}
            helperText="Only accepts numbers"
          />
          <Input
            label="Date Input"
            type="date"
            helperText="Date picker"
          />
          <Input
            label="Search Input"
            type="search"
            placeholder="Search..."
            leftIcon={<FaSearch />}
            clearable
            helperText="Search with clear functionality"
          />
          <Input
            label="URL Input"
            type="url"
            placeholder="https://example.com"
            leftIcon={<FaLink />}
            helperText="Enter a valid URL"
          />
        </div>
      </Subsection>

      <div className="mt-8 p-4 bg-primary/10 rounded-md">
        <Typography variant="subtitle2" weight="medium" className="mb-2">Design Principles</Typography>
        <Typography variant="body2">
          <ul className="list-disc pl-5 space-y-1">
            <li>Clarity in copywriting: Labels and helper text provide clear guidance</li>
            <li>Purposeful visuals: Icons enhance meaning and communicate purpose</li>
            <li>Strategic color: Validation states use color to convey meaning</li>
            <li>User-centric: Animations provide feedback without being distracting</li>
            <li>Meaningful micro-interactions: Subtle animations indicate state changes</li>
          </ul>
        </Typography>
      </div>
    </div>
  );
}

// Colors showcase
function ColorsShowcase() {
  return (
    <>
      <p className="mb-2 text-text-muted">Current theme colors are applied. Toggle theme to see changes.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-primary text-white rounded">Primary</div>
        <div className="p-4 bg-secondary text-white rounded">Secondary</div>
        <div className="p-4 bg-bg-surface text-text-base rounded border border-border">Surface</div>
        <div className="p-4 bg-error text-white rounded">Error</div>
        <div className="p-4 bg-success text-white rounded">Success</div>
        <div className="p-4 bg-warning text-black rounded">Warning</div>
      </div>
    </>
  );
}

// Accordion showcase component
function AccordionShowcase() {
  return (
    <div className="p-6 bg-background rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-text-primary">Accordion</h2>

      <Subsection title="Default Accordion">
        <div className="w-full max-w-2xl">
          <Accordion
            items={[
              {
                title: "What is a design system?",
                children: "A design system is a collection of reusable components, guided by clear standards, that can be assembled together to build any number of applications."
              },
              {
                title: "Why use a design system?",
                children: "Design systems help teams build better products faster by making design reusable - reusability makes scale possible. This is why the most advanced tech companies and organizations use design systems."
              },
              {
                title: "How to get started?",
                children: "Start by identifying your core components, establish design tokens, create a component library, and document everything clearly for your team."
              }
            ]}
          />
        </div>
      </Subsection>

      <Subsection title="Accordion Variants">
        <div className="w-full max-w-2xl space-y-4">
          <Accordion
            variant="bordered"
            items={[
              {
                title: "Bordered Variant",
                children: "This accordion uses a bordered style with rounded corners and border highlights."
              },
              {
                title: "Multiple Items",
                children: "You can have multiple items in a bordered accordion."
              }
            ]}
          />

          <Accordion
            variant="filled"
            items={[
              {
                title: "Filled Variant",
                children: "This accordion uses a filled style with background colors for different states."
              },
              {
                title: "Interactive States",
                children: "Notice how the background changes on hover and when expanded."
              }
            ]}
          />

          <Accordion
            variant="minimal"
            items={[
              {
                title: "Minimal Variant",
                children: "A clean, minimal style with subtle borders and transitions."
              },
              {
                title: "Simple Design",
                children: "Perfect for content-heavy pages where you want to maintain focus."
              }
            ]}
          />
        </div>
      </Subsection>

      <Subsection title="Accordion with Icons">
        <div className="w-full max-w-2xl">
          <Accordion
            items={[
              {
                title: "Documentation",
                icon: <FaFileAlt className="text-primary" />,
                children: "Access our comprehensive documentation to learn more about our components."
              },
              {
                title: "Examples",
                icon: <FaCode className="text-primary" />,
                children: "Browse through our example implementations to see components in action."
              },
              {
                title: "Resources",
                icon: <FaBook className="text-primary" />,
                children: "Find additional resources, tutorials, and best practices."
              }
            ]}
          />
        </div>
      </Subsection>

      <Subsection title="Interactive Features">
        <div className="w-full max-w-2xl">
          <Accordion
            multiple
            collapsible
            items={[
              {
                title: "Multiple Open Items",
                children: "This accordion allows multiple items to be open at once."
              },
              {
                title: "Collapsible Items",
                children: "Items can be collapsed by clicking them again."
              },
              {
                title: "Disabled State",
                disabled: true,
                children: "This item is disabled and cannot be opened."
              }
            ]}
          />
        </div>
      </Subsection>
    </div>
  );
}

// Tabs showcase component
function TabsShowcase() {
  return (
    <div className="p-6 bg-background rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-text-primary">Tabs</h2>

      <Subsection title="Default Tabs">
        <div className="w-full max-w-2xl">
          <Tabs
            items={[
              {
                id: 'overview',
                label: 'Overview',
                content: 'This is the overview content. It provides a high-level summary of the information.'
              },
              {
                id: 'details',
                label: 'Details',
                content: 'Detailed information goes here. This tab contains more specific and comprehensive content.'
              },
              {
                id: 'settings',
                label: 'Settings',
                content: 'Configuration and settings options are displayed in this tab.'
              }
            ]}
          />
        </div>
      </Subsection>

      <Subsection title="Tab Variants">
        <div className="w-full max-w-2xl space-y-8">
          <Tabs
            variant="contained"
            items={[
              {
                id: 'contained1',
                label: 'Contained Style',
                content: 'This tab uses the contained variant with a background color.'
              },
              {
                id: 'contained2',
                label: 'Active State',
                content: 'Notice how the active tab has a different background color.'
              }
            ]}
          />

          <Tabs
            variant="pills"
            items={[
              {
                id: 'pills1',
                label: 'Pills Style',
                content: 'This tab uses the pills variant with rounded corners.'
              },
              {
                id: 'pills2',
                label: 'Rounded Design',
                content: 'The pills variant provides a more casual, modern look.'
              }
            ]}
          />

          <Tabs
            variant="buttons"
            items={[
              {
                id: 'buttons1',
                label: 'Buttons Style',
                content: 'This tab uses the buttons variant for a more interactive feel.'
              },
              {
                id: 'buttons2',
                label: 'Button-like',
                content: 'Each tab looks like a button, making the interaction more obvious.'
              }
            ]}
          />
        </div>
      </Subsection>

      <Subsection title="Tabs with Icons">
        <div className="w-full max-w-2xl">
          <Tabs
            items={[
              {
                id: 'home',
                label: 'Home',
                icon: <FaHome className="mr-2" />,
                content: 'Welcome to the home section.'
              },
              {
                id: 'profile',
                label: 'Profile',
                icon: <FaUser className="mr-2" />,
                content: 'View and edit your profile information.'
              },
              {
                id: 'messages',
                label: 'Messages',
                icon: <FaEnvelope className="mr-2" />,
                content: 'Check your messages and notifications.'
              }
            ]}
          />
        </div>
      </Subsection>

      <Subsection title="Interactive Features">
        <div className="w-full max-w-2xl">
          <Tabs
            items={[
              {
                id: 'enabled',
                label: 'Enabled Tab',
                content: 'This tab is enabled and can be clicked.'
              },
              {
                id: 'disabled',
                label: 'Disabled Tab',
                disabled: true,
                content: 'This tab is disabled and cannot be clicked.'
              }
            ]}
          />
        </div>
      </Subsection>

      <Subsection title="Tab Sizes">
        <div className="w-full max-w-2xl space-y-8">
          <Tabs
            size="sm"
            items={[
              {
                id: 'small1',
                label: 'Small Tabs',
                content: 'These tabs use the small size variant.'
              },
              {
                id: 'small2',
                label: 'Compact',
                content: 'Perfect for space-constrained interfaces.'
              }
            ]}
          />

          <Tabs
            size="lg"
            items={[
              {
                id: 'large1',
                label: 'Large Tabs',
                content: 'These tabs use the large size variant.'
              },
              {
                id: 'large2',
                label: 'Prominent',
                content: 'Great for main navigation or important sections.'
              }
            ]}
          />
        </div>
      </Subsection>
    </div>
  );
}

// Card showcase component
function CardShowcase() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="p-6 bg-background rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-text-primary">Cards</h2>

      <Subsection title="Professional Card Variants">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <Card
            variant="elevated"
            title="Elevated Card"
            description="Subtle shadow elevation creates depth without being distracting"
            onMouseEnter={() => setHoveredCard('elevated')}
            onMouseLeave={() => setHoveredCard(null)}
            className="transition-shadow duration-300"
          />
          <Card
            variant="outlined"
            title="Outlined Card"
            description="Clean border defines the content area with minimal visual weight"
            onMouseEnter={() => setHoveredCard('outlined')}
            onMouseLeave={() => setHoveredCard(null)}
            className="transition-all duration-300"
          />
        </div>
      </Subsection>

      <Subsection title="Interactive Business Cards">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <Card
            variant="elevated"
            title="Project Summary"
            subtitle="Q2 Performance Review"
            description="Analysis of key performance metrics and growth indicators for the second quarter"
            primaryAction={{
              label: "View Report",
              onClick: () => alert('Viewing report...'),
            }}
            secondaryAction={{
              label: "Share",
              onClick: () => alert('Sharing report...'),
            }}
            footer={
              <div className="flex justify-between items-center mt-4 text-sm text-text-muted">
                <div>Last updated: 2 days ago</div>
                <div>4 contributors</div>
              </div>
            }
            className="transition-all duration-300 hover:shadow-lg"
          />
          <Card
            variant="outlined"
            title="Financial Overview"
            subtitle="Annual Revenue"
            description="Comprehensive analysis of revenue streams, expenses, and profit margins for the fiscal year"
            media={
              <div className="w-full h-48 bg-bg-surface flex items-center justify-center border-b border-border">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">$2.4M</div>
                  <div className="text-sm text-text-muted">Annual Revenue</div>
                </div>
              </div>
            }
            primaryAction={{
              label: "Export Data",
              onClick: () => alert('Exporting data...'),
            }}
            className="transition-all duration-300 hover:border-primary/50"
          />
        </div>
      </Subsection>

      <Subsection title="Content-Focused Cards">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <Card
            variant="elevated"
            title="Team Member"
            subtitle="Product Design"
            media={
              <div className="w-full h-48 bg-bg-surface flex items-center justify-center border-b border-border">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <FaUser size={36} className="text-primary/60" />
                </div>
              </div>
            }
            description="Professional with 8+ years of experience in product design and user experience"
            footer={
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-text-muted" />
                  <span className="text-sm">Contact</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendar className="text-text-muted" />
                  <span className="text-sm">Schedule</span>
                </div>
              </div>
            }
            className="transition-all duration-300 hover:shadow-md"
          />
          <Card
            variant="filled"
            title="Research Report"
            subtitle="Market Analysis"
            description="In-depth analysis of market trends, competitor landscape, and growth opportunities"
            footer={
              <div className="flex items-center justify-between mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <FaFileAlt className="text-text-muted" />
                  <span>24 pages</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaDownload className="text-primary" />
                  <span className="text-primary">Download PDF</span>
                </div>
              </div>
            }
            className="transition-all duration-300 hover:bg-bg-surface/80"
          />
        </div>
      </Subsection>

      <Subsection title="Subtle Interaction Cards">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <Card
            variant="elevated"
            title="Interactive Data Card"
            description="Hover over this card to see subtle elevation change"
            className="transition-all duration-300 hover:shadow-md group"
            footer={
              <div className="mt-4 flex justify-end">
                <Button size="sm" className="opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  Learn More
                </Button>
              </div>
            }
          />
          <Card
            variant="outlined"
            title="Micro-interaction Card"
            description="Subtle border highlight on hover provides feedback without distraction"
            className="transition-all duration-300 hover:border-primary/30 group"
            footer={
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-text-muted">Updated today</div>
                <FaArrowRight className="text-primary opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </div>
            }
          />
        </div>
      </Subsection>
    </div>
  );
}

// Tooltip showcase component
function TooltipShowcase() {
  return (
    <div className="p-6 bg-background rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-text-primary">Tooltips</h2>

      <Subsection title="Professional Tooltips">
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col items-center gap-2">
            <Tooltip 
              content="Concise information tooltip"
              animationStyle="fade"
              variant="dark"
              className="backdrop-blur-sm shadow-lg !bg-bg-surface/95 dark:!bg-text-base/95 border border-border/50"
            >
              <Button variant="outline" leftIcon={FaInfo}>
                Information
              </Button>
            </Tooltip>
            <span className="text-sm text-text-muted">Simple Text</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Tooltip 
              content={
                <div className="flex items-center gap-2">
                  <FaCheck className="text-success" />
                  <span>Status indicator with icon</span>
                </div>
              }
              animationStyle="fade"
              variant="dark"
              className="backdrop-blur-sm shadow-lg !bg-bg-surface/95 dark:!bg-text-base/95 border border-border/50"
            >
              <Button variant="outline" leftIcon={FaShieldAlt}>
                Security
              </Button>
            </Tooltip>
            <span className="text-sm text-text-muted">With Icon</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Tooltip 
              content={
                <div className="flex flex-col gap-1">
                  <div className="font-medium">Structured Content</div>
                  <div className="text-sm">Additional details with proper hierarchy</div>
                </div>
              }
              animationStyle="fade"
              variant="dark"
              className="backdrop-blur-sm shadow-lg !bg-bg-surface/95 dark:!bg-text-base/95 border border-border/50"
            >
              <Button variant="outline" leftIcon={FaLayerGroup}>
                Details
              </Button>
            </Tooltip>
            <span className="text-sm text-text-muted">Structured</span>
          </div>
        </div>
      </Subsection>

      <Subsection title="Tooltip Positions">
        <div className="flex flex-wrap gap-6 justify-center">
          <div className="flex flex-col items-center gap-2">
            <Tooltip 
              content="Top tooltip position"
              position="top"
              variant="dark"
              className="backdrop-blur-sm shadow-lg !bg-bg-surface/95 dark:!bg-text-base/95 border border-border/50"
            >
              <Button size="sm" variant="outline">Top</Button>
            </Tooltip>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Tooltip 
              content="Right tooltip position"
              position="right"
              variant="dark"
              className="backdrop-blur-sm shadow-lg !bg-bg-surface/95 dark:!bg-text-base/95 border border-border/50"
            >
              <Button size="sm" variant="outline">Right</Button>
            </Tooltip>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Tooltip 
              content="Bottom tooltip position"
              position="bottom"
              variant="dark"
              className="backdrop-blur-sm shadow-lg !bg-bg-surface/95 dark:!bg-text-base/95 border border-border/50"
            >
              <Button size="sm" variant="outline">Bottom</Button>
            </Tooltip>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Tooltip 
              content="Left tooltip position"
              position="left"
              variant="dark"
              className="backdrop-blur-sm shadow-lg !bg-bg-surface/95 dark:!bg-text-base/95 border border-border/50"
            >
              <Button size="sm" variant="outline">Left</Button>
            </Tooltip>
          </div>
        </div>
      </Subsection>

      <Subsection title="Context-Aware Tooltips">
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col items-center gap-2">
            <Tooltip 
              content="Minimal contrast for light themes"
              variant="light"
              animationStyle="fade"
              className="backdrop-blur-sm shadow-lg !bg-bg-surface/95 border border-border/50"
            >
              <Button variant="ghost">Light Theme</Button>
            </Tooltip>
            <span className="text-sm text-text-muted">Light Variant</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Tooltip 
              content="High contrast for better readability"
              variant="dark"
              animationStyle="fade"
              className="backdrop-blur-sm shadow-lg !bg-text-base/95 border border-text-muted/20"
            >
              <Button variant="ghost">Dark Theme</Button>
            </Tooltip>
            <span className="text-sm text-text-muted">Dark Variant</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Tooltip 
              content="Brand-aligned messaging"
              variant="primary"
              animationStyle="fade"
              className="backdrop-blur-sm shadow-lg !bg-primary/95 border border-primary/30"
            >
              <Button variant="ghost">Brand Theme</Button>
            </Tooltip>
            <span className="text-sm text-text-muted">Primary Variant</span>
          </div>
        </div>
      </Subsection>

      <Subsection title="Interactive Tooltips">
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col items-center gap-2">
            <Tooltip 
              content={
                <div className="flex flex-col gap-2 max-w-xs">
                  <div className="font-medium">Project Status</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="text-sm">On track for delivery</span>
                  </div>
                  <div className="text-sm text-text-muted">Last updated: Today</div>
                </div>
              }
              trigger="click"
              interactive
              variant="dark"
              className="backdrop-blur-sm shadow-lg !bg-bg-surface/95 dark:!bg-text-base/95 border border-border/50"
            >
              <Button>Click for Details</Button>
            </Tooltip>
            <span className="text-sm text-text-muted">Click Trigger</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Tooltip 
              content={
                <div className="flex flex-col gap-2">
                  <div className="font-medium">Resource Usage</div>
                  <div className="w-full bg-bg-surface/50 rounded-full h-2 mt-1">
                    <div className="bg-primary h-2 rounded-full w-3/4"></div>
                  </div>
                  <div className="text-xs text-right">75% Complete</div>
                </div>
              }
              interactive
              variant="dark"
              className="backdrop-blur-sm shadow-lg !bg-bg-surface/95 dark:!bg-text-base/95 border border-border/50"
            >
              <Button>Hover for Stats</Button>
            </Tooltip>
            <span className="text-sm text-text-muted">Interactive Content</span>
          </div>
        </div>
      </Subsection>
    </div>
  );
}

// Modal showcase component
function ModalShowcase() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [modalSize, setModalSize] = useState<'sm' | 'md' | 'lg' | 'xl' | 'full'>('md');

  return (
    <div className="p-6 bg-background rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-text-primary">Modal</h2>

      <Subsection title="Modal Variants">
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => setIsOpen(true)}>
            Open Basic Modal
          </Button>
          <Button onClick={() => setIsFormOpen(true)} variant="outline">
            Open Form Modal
          </Button>
          <Button onClick={() => setIsConfirmOpen(true)} variant="outline" leftIcon={FaExclamationTriangle}>
            Open Confirmation
          </Button>
        </div>

        {/* Basic Modal */}
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Modal Title"
          primaryAction={{
            label: "Save Changes",
            onClick: () => {
              alert('Changes saved!');
              setIsOpen(false);
            }
          }}
          secondaryAction={{
            label: "Cancel",
            onClick: () => setIsOpen(false)
          }}
        >
          <Typography variant="body1">
            This is a basic modal dialog with a title, content area, and footer actions.
            It demonstrates the standard modal structure with primary and secondary actions.
          </Typography>
        </Modal>

        {/* Form Modal */}
        <Modal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          title="Contact Form"
          size="md"
          primaryAction={{
            label: "Submit",
            onClick: () => {
              alert(`Form submitted: ${name}, ${email}`);
              setIsFormOpen(false);
            },
            disabled: !name || !email
          }}
          secondaryAction={{
            label: "Cancel",
            onClick: () => setIsFormOpen(false)
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2 border border-border rounded-md bg-bg-surface"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-2 border border-border rounded-md bg-bg-surface"
                placeholder="Enter your email"
              />
            </div>
          </div>
        </Modal>

        {/* Confirmation Modal */}
        <Modal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          title="Confirm Deletion"
          size="sm"
          primaryAction={{
            label: "Delete",
            onClick: () => {
              alert('Item deleted!');
              setIsConfirmOpen(false);
            },
            variant: 'primary'
          }}
          secondaryAction={{
            label: "Cancel",
            onClick: () => setIsConfirmOpen(false)
          }}
        >
          <Typography variant="body1">
            Are you sure you want to delete this item? This action cannot be undone.
          </Typography>
        </Modal>
      </Subsection>

      <Subsection title="Modal Sizes">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {(['sm', 'md', 'lg', 'xl', 'full'] as const).map(size => (
            <Button 
              key={size} 
              variant="outline"
              onClick={() => {
                setModalSize(size);
                setIsOpen(true);
              }}
            >
              {size.toUpperCase()} Size
            </Button>
          ))}
        </div>

        {/* Size Demo Modal */}
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={`${modalSize.toUpperCase()} Size Modal`}
          size={modalSize}
          primaryAction={{
            label: "Close",
            onClick: () => setIsOpen(false)
          }}
        >
          <div className="space-y-4">
            <Typography variant="body1">
              This modal demonstrates the <strong>{modalSize.toUpperCase()}</strong> size variant.
            </Typography>
            
            <div className="p-4 bg-bg-surface-hover rounded-md">
              <Typography variant="body2">
                {modalSize === 'sm' && "Small modals are perfect for simple confirmations, alerts, or quick interactions."}
                {modalSize === 'md' && "Medium modals are versatile for forms, settings panels, or detailed information."}
                {modalSize === 'lg' && "Large modals provide ample space for complex forms, data visualization, or multi-step processes."}
                {modalSize === 'xl' && "Extra large modals are suitable for detailed content that requires significant screen real estate."}
                {modalSize === 'full' && "Full-width modals maximize available space for complex interfaces or immersive experiences."}
              </Typography>
            </div>
            
            {(modalSize === 'lg' || modalSize === 'xl' || modalSize === 'full') && (
              <div className="border border-border rounded-md p-4">
                <Typography variant="subtitle2" className="mb-2">Additional content for larger modals</Typography>
                <Typography variant="body2">
                  Larger modal sizes allow for more complex layouts and information hierarchies. They can contain 
                  multiple sections, tabs, or even nested components while maintaining readability and usability.
                </Typography>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-bg-surface rounded border border-border">
                    <Typography variant="body2">Section 1</Typography>
                  </div>
                  <div className="p-3 bg-bg-surface rounded border border-border">
                    <Typography variant="body2">Section 2</Typography>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal>
      </Subsection>

      <Subsection title="Modal Features">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-border rounded-md">
            <Typography variant="subtitle2" weight="semibold" className="mb-2">
              Accessibility
            </Typography>
            <Typography variant="body2">
              Modals manage focus trapping, restore focus on close, and support
              keyboard navigation with Escape key to close.
            </Typography>
          </div>
          <div className="p-4 border border-border rounded-md">
            <Typography variant="subtitle2" weight="semibold" className="mb-2">
              Customization
            </Typography>
            <Typography variant="body2">
              Modals can be customized with different sizes, positions, scrolling
              behaviors, and can have custom footers.
            </Typography>
          </div>
        </div>
      </Subsection>
    </div>
  );
}

// Nav showcase component
function NavShowcase() {
  const demoNavItems = [
    { 
      label: 'Home', 
      icon: <FaHome />, 
      active: true 
    },
    { 
      label: 'Products', 
      icon: <FaBoxOpen />,
      children: [
        { label: 'New Arrivals' },
        { label: 'Featured' },
        { label: 'Categories' }
      ]
    },
    { 
      label: 'Services', 
      icon: <FaRocket /> 
    },
    { 
      label: 'About', 
      icon: <FaInfo /> 
    },
    { 
      label: 'Contact', 
      icon: <FaEnvelope /> 
    }
  ];

  return (
    <div className="p-6 bg-background rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-text-primary">Navigation</h2>

      <Subsection title="Horizontal Navigation">
        <div className="border border-border rounded-md overflow-hidden mb-8">
          <Nav 
            items={demoNavItems}
            logo={<Typography variant="h5" weight="bold">Logo</Typography>}
            rightContent={
              <Button size="sm" leftIcon={FaUser}>Sign In</Button>
            }
            colorScheme="primary"
          />
        </div>

        <div className="border border-border rounded-md overflow-hidden">
          <Nav 
            items={demoNavItems}
            logo={<Typography variant="h5" weight="bold">Logo</Typography>}
            rightContent={
              <Button size="sm" leftIcon={FaUser}>Sign In</Button>
            }
            colorScheme="neutral"
          />
        </div>
      </Subsection>

      <Subsection title="Vertical Navigation">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-border rounded-md overflow-hidden">
            <Nav 
              items={demoNavItems}
              variant="vertical"
              colorScheme="neutral"
            />
          </div>
          <div className="border border-border rounded-md overflow-hidden">
            <Nav 
              items={demoNavItems.map(item => ({ ...item, icon: undefined }))}
              variant="vertical"
              colorScheme="primary"
            />
          </div>
        </div>
      </Subsection>

      <Subsection title="Navigation Features">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded-md">
            <Typography variant="subtitle2" weight="semibold" className="mb-2">
              Responsive Design
            </Typography>
            <Typography variant="body2">
              Navigation adapts to different screen sizes with mobile-friendly 
              hamburger menu on smaller devices.
            </Typography>
          </div>
          <div className="p-4 border border-border rounded-md">
            <Typography variant="subtitle2" weight="semibold" className="mb-2">
              Dropdown Menus
            </Typography>
            <Typography variant="body2">
              Support for multi-level dropdown menus with subtle animations
              for an enhanced user experience.
            </Typography>
          </div>
          <div className="p-4 border border-border rounded-md">
            <Typography variant="subtitle2" weight="semibold" className="mb-2">
              Theming Options
            </Typography>
            <Typography variant="body2">
              Multiple color schemes including primary, neutral, and transparent
              to match your site's design.
            </Typography>
          </div>
        </div>
      </Subsection>
    </div>
  );
}

// Table showcase component
function TableShowcase() {
  // Sample data for the table
  const [data, setData] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Robert Johnson', email: 'robert@example.com', role: 'Manager', status: 'Inactive' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'User', status: 'Active' },
    { id: 5, name: 'Michael Wilson', email: 'michael@example.com', role: 'Developer', status: 'Active' },
    { id: 6, name: 'Sarah Brown', email: 'sarah@example.com', role: 'Designer', status: 'Inactive' },
    { id: 7, name: 'David Miller', email: 'david@example.com', role: 'Developer', status: 'Active' },
    { id: 8, name: 'Jessica Taylor', email: 'jessica@example.com', role: 'Manager', status: 'Active' },
  ]);
  
  // Columns configuration
  const columns = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'role', header: 'Role', sortable: true },
    { 
      key: 'status', 
      header: 'Status', 
      sortable: true,
      accessor: (row: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.status === 'Active' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right' as const,
      accessor: (row: any) => (
        <div className="flex items-center justify-end gap-2">
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => alert(`Edit ${row.name}`)}
          >
            Edit
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => alert(`Delete ${row.name}`)}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];
  
  // State for selected rows
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div className="p-6 bg-background rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-text-primary">Data Table</h2>

      <Subsection title="Basic Table">
        <div className="border border-border rounded-md overflow-hidden">
          <Table 
            columns={columns}
            data={data.slice(0, 4)}
            keyExtractor={(row) => row.id.toString()}
          />
        </div>
      </Subsection>

      <Subsection title="Table Variants">
        <div className="space-y-6">
          <div>
            <Typography variant="subtitle2" className="mb-2">Striped Table</Typography>
            <div className="border border-border rounded-md overflow-hidden">
              <Table 
                columns={columns}
                data={data.slice(0, 4)}
                keyExtractor={(row) => row.id.toString()}
                variant="striped"
              />
            </div>
          </div>
          
          <div>
            <Typography variant="subtitle2" className="mb-2">Bordered Table</Typography>
            <div className="border border-border rounded-md overflow-hidden">
              <Table 
                columns={columns}
                data={data.slice(0, 4)}
                keyExtractor={(row) => row.id.toString()}
                variant="bordered"
              />
            </div>
          </div>
        </div>
      </Subsection>

      <Subsection title="Interactive Table">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => setIsLoading(prev => !prev)}
              leftIcon={FaSpinner}
            >
              {isLoading ? 'Stop Loading' : 'Show Loading'}
            </Button>
          </div>
          
          <div className="border border-border rounded-md overflow-hidden">
            <Table 
              columns={columns}
              data={data}
              keyExtractor={(row) => row.id.toString()}
              sortable
              pagination
              pageSize={5}
              selectable
              selectedRows={selectedRows}
              onRowSelect={(keys: (string | number)[]) => setSelectedRows(keys)}
              loading={isLoading}
            />
          </div>
        </div>
      </Subsection>

      <Subsection title="Table Features">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded-md">
            <Typography variant="subtitle2" weight="semibold" className="mb-2">
              Sorting
            </Typography>
            <Typography variant="body2">
              Tables support column sorting in ascending and descending order
              with visual indicators of sort direction.
            </Typography>
          </div>
          <div className="p-4 border border-border rounded-md">
            <Typography variant="subtitle2" weight="semibold" className="mb-2">
              Pagination
            </Typography>
            <Typography variant="body2">
              Built-in pagination with customizable page sizes and navigation
              for handling large datasets efficiently.
            </Typography>
          </div>
          <div className="p-4 border border-border rounded-md">
            <Typography variant="subtitle2" weight="semibold" className="mb-2">
              Selection
            </Typography>
            <Typography variant="body2">
              Row selection with checkboxes for bulk operations and visual
              indication of selected state.
            </Typography>
          </div>
        </div>
      </Subsection>
    </div>
  );
}

// Badge showcase component
function BadgeShowcase() {
  return (
    <div className="p-6 bg-background rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-text-primary">Badges</h2>

      <Subsection title="Badge Variants">
        <div className="flex flex-wrap gap-4">
          <Badge variant="solid" colorScheme="primary">Solid Primary</Badge>
          <Badge variant="outline" colorScheme="primary">Outline Primary</Badge>
          <Badge variant="subtle" colorScheme="primary">Subtle Primary</Badge>
        </div>
      </Subsection>

      <Subsection title="Badge Colors">
        <div className="flex flex-wrap gap-4">
          <Badge variant="solid" colorScheme="primary">Primary</Badge>
          <Badge variant="solid" colorScheme="secondary">Secondary</Badge>
          <Badge variant="solid" colorScheme="success">Success</Badge>
          <Badge variant="solid" colorScheme="error">Error</Badge>
          <Badge variant="solid" colorScheme="warning">Warning</Badge>
          <Badge variant="solid" colorScheme="info">Info</Badge>
          <Badge variant="solid" colorScheme="neutral">Neutral</Badge>
        </div>
      </Subsection>

      <Subsection title="Badge Sizes">
        <div className="flex flex-wrap gap-4 items-center">
          <Badge size="sm" variant="solid" colorScheme="primary">Small</Badge>
          <Badge size="md" variant="solid" colorScheme="primary">Medium</Badge>
          <Badge size="lg" variant="solid" colorScheme="primary">Large</Badge>
        </div>
      </Subsection>

      <Subsection title="Badge Shapes">
        <div className="flex flex-wrap gap-4">
          <Badge shape="rounded" variant="solid" colorScheme="primary">Rounded</Badge>
          <Badge shape="pill" variant="solid" colorScheme="primary">Pill</Badge>
        </div>
      </Subsection>

      <Subsection title="Badges with Icons">
        <div className="flex flex-wrap gap-4">
          <Badge variant="solid" colorScheme="success" icon={<FaCheck />}>Success</Badge>
          <Badge variant="solid" colorScheme="error" icon={<FaTimes />}>Error</Badge>
          <Badge variant="outline" colorScheme="warning" icon={<FaExclamationTriangle />}>Warning</Badge>
          <Badge variant="subtle" colorScheme="info" icon={<FaInfo />}>Info</Badge>
          <Badge variant="solid" colorScheme="primary" icon={<FaBell />} iconPosition="right">Notifications</Badge>
        </div>
      </Subsection>

      <Subsection title="Interactive Badges">
        <div className="flex flex-wrap gap-4">
          <Badge variant="solid" colorScheme="primary" onClick={() => alert('Badge clicked!')}>Click me</Badge>
          <Badge variant="outline" colorScheme="secondary" onClick={() => alert('Badge clicked!')}>Interactive</Badge>
        </div>
      </Subsection>

      <Subsection title="Animated Badges">
        <div className="flex flex-wrap gap-4">
          <Badge variant="solid" colorScheme="error" animate animationStyle="pulse">
            New
          </Badge>
          <Badge variant="solid" colorScheme="primary" animate animationStyle="bounce">
            <FaBell />
          </Badge>
        </div>
      </Subsection>

      <Subsection title="Use Cases">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border border-border rounded">
            <div className="flex items-center justify-between mb-3">
              <Typography variant="subtitle2">Profile Notifications</Typography>
              <Badge variant="solid" colorScheme="error" animate animationStyle="pulse">3</Badge>
            </div>
            <Typography variant="body2" colorScheme="muted">
              Use badges to show counts or status indicators.
            </Typography>
          </div>
          
          <div className="p-4 border border-border rounded">
            <div className="flex items-center gap-2 mb-3">
              <Typography variant="subtitle2">Project Status</Typography>
              <Badge variant="subtle" colorScheme="success" icon={<FaCheck />}>Active</Badge>
            </div>
            <Typography variant="body2" colorScheme="muted">
              Badges can indicate status with meaningful colors.
            </Typography>
          </div>
        </div>
      </Subsection>
    </div>
  );
}

// Checkbox showcase component
function CheckboxShowcase() {
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(true);
  const [isIndeterminate, setIsIndeterminate] = useState(true);

  return (
    <div className="p-6 bg-background rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-text-primary">Checkbox</h2>

      <Subsection title="Basic Checkboxes">
        <div className="flex flex-col space-y-3 max-w-md">
          <Checkbox 
            label="Unchecked checkbox" 
            checked={isChecked1}
            onChange={(e) => setIsChecked1(e.target.checked)}
          />
          <Checkbox 
            label="Checked checkbox" 
            checked={isChecked2}
            onChange={(e) => setIsChecked2(e.target.checked)}
          />
          <Checkbox 
            label="Indeterminate checkbox" 
            indeterminate={isIndeterminate}
            checked={false}
            onChange={() => setIsIndeterminate(false)}
          />
        </div>
      </Subsection>

      <Subsection title="Checkbox Sizes">
        <div className="flex flex-col space-y-3 max-w-md">
          <Checkbox label="Small checkbox" size="sm" />
          <Checkbox label="Medium checkbox" size="md" />
          <Checkbox label="Large checkbox" size="lg" />
        </div>
      </Subsection>

      <Subsection title="Checkbox Colors">
        <div className="flex flex-col space-y-3 max-w-md">
          <Checkbox label="Primary checkbox" colorScheme="primary" defaultChecked />
          <Checkbox label="Secondary checkbox" colorScheme="secondary" defaultChecked />
          <Checkbox label="Success checkbox" colorScheme="success" defaultChecked />
          <Checkbox label="Error checkbox" colorScheme="error" defaultChecked />
          <Checkbox label="Warning checkbox" colorScheme="warning" defaultChecked />
        </div>
      </Subsection>

      <Subsection title="Checkbox States">
        <div className="flex flex-col space-y-3 max-w-md">
          <Checkbox label="Disabled checkbox" disabled />
          <Checkbox label="Disabled checked checkbox" disabled defaultChecked />
          <Checkbox label="Required checkbox" required />
          <Checkbox label="Read-only checkbox" readOnly defaultChecked />
        </div>
      </Subsection>

      <Subsection title="Label Placement">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Checkbox label="Label on right (default)" labelPlacement="end" defaultChecked />
          <Checkbox label="Label on left" labelPlacement="start" defaultChecked />
          <Checkbox label="Label on top" labelPlacement="top" defaultChecked />
          <Checkbox label="Label on bottom" labelPlacement="bottom" defaultChecked />
        </div>
      </Subsection>

      <Subsection title="Use Cases">
        <div className="p-4 border border-border rounded-md">
          <Typography variant="subtitle2" className="mb-3">Settings Form</Typography>
          
          <div className="space-y-2">
            <Checkbox label="Enable notifications" defaultChecked />
            <Checkbox label="Subscribe to newsletter" />
            <Checkbox label="Remember me on this device" />
          </div>
        </div>
      </Subsection>
    </div>
  );
}

// Radio showcase component
function RadioShowcase() {
  const [selectedOption, setSelectedOption] = useState('option1');

  return (
    <div className="p-6 bg-background rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-text-primary">Radio Buttons</h2>

      <Subsection title="Basic Radio Group">
        <div className="flex flex-col space-y-3 max-w-md">
          <Radio 
            label="Option 1" 
            name="radioGroup1" 
            value="option1"
            checked={selectedOption === 'option1'}
            onChange={() => setSelectedOption('option1')}
          />
          <Radio 
            label="Option 2" 
            name="radioGroup1" 
            value="option2"
            checked={selectedOption === 'option2'}
            onChange={() => setSelectedOption('option2')}
          />
          <Radio 
            label="Option 3" 
            name="radioGroup1" 
            value="option3"
            checked={selectedOption === 'option3'}
            onChange={() => setSelectedOption('option3')}
          />
        </div>
      </Subsection>

      <Subsection title="Radio Sizes">
        <div className="flex flex-col space-y-3 max-w-md">
          <Radio label="Small radio" size="sm" name="radioSize" value="sm" />
          <Radio label="Medium radio" size="md" name="radioSize" value="md" />
          <Radio label="Large radio" size="lg" name="radioSize" value="lg" />
        </div>
      </Subsection>

      <Subsection title="Radio Colors">
        <div className="flex flex-col space-y-3 max-w-md">
          <Radio label="Primary radio" colorScheme="primary" name="radioColor" value="primary" defaultChecked />
          <Radio label="Secondary radio" colorScheme="secondary" name="radioColor" value="secondary" />
          <Radio label="Success radio" colorScheme="success" name="radioColor" value="success" />
          <Radio label="Error radio" colorScheme="error" name="radioColor" value="error" />
          <Radio label="Warning radio" colorScheme="warning" name="radioColor" value="warning" />
        </div>
      </Subsection>

      <Subsection title="Radio States">
        <div className="flex flex-col space-y-3 max-w-md">
          <Radio label="Disabled radio" disabled name="radioStates" value="disabled" />
          <Radio label="Disabled checked radio" disabled defaultChecked name="radioStates" value="disabledChecked" />
          <Radio label="Required radio" required name="radioStates" value="required" />
          <Radio label="Read-only radio" readOnly defaultChecked name="radioStates" value="readonly" />
        </div>
      </Subsection>

      <Subsection title="Label Placement">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Radio label="Label on right (default)" labelPlacement="end" name="radioPlacement" value="end" defaultChecked />
          <Radio label="Label on left" labelPlacement="start" name="radioPlacement" value="start" />
          <Radio label="Label on top" labelPlacement="top" name="radioPlacement" value="top" />
          <Radio label="Label on bottom" labelPlacement="bottom" name="radioPlacement" value="bottom" />
        </div>
      </Subsection>

      <Subsection title="Use Cases">
        <div className="p-4 border border-border rounded-md">
          <Typography variant="subtitle2" className="mb-3">Survey Form</Typography>
          
          <div className="space-y-4">
            <Typography variant="body2">How would you rate your experience?</Typography>
            <div className="space-y-2">
              <Radio label="Excellent" name="survey" value="excellent" />
              <Radio label="Good" name="survey" value="good" />
              <Radio label="Average" name="survey" value="average" />
              <Radio label="Poor" name="survey" value="poor" />
            </div>
          </div>
        </div>
      </Subsection>
    </div>
  );
}

// Switch showcase component
function SwitchShowcase() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="p-6 bg-background rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-text-primary">Switches</h2>

      <Subsection title="Basic Switches">
        <div className="flex flex-col space-y-3 max-w-md">
          <Switch 
            label="Off state" 
            checked={false}
            onChange={() => {}}
          />
          <Switch 
            label="On state" 
            checked={true}
            onChange={() => {}}
          />
          <Switch 
            label="Controlled switch" 
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
        </div>
      </Subsection>

      <Subsection title="Switch Sizes">
        <div className="flex flex-col space-y-3 max-w-md">
          <Switch label="Small switch" size="sm" />
          <Switch label="Medium switch" size="md" />
          <Switch label="Large switch" size="lg" />
        </div>
      </Subsection>

      <Subsection title="Switch Colors">
        <div className="flex flex-col space-y-3 max-w-md">
          <Switch label="Primary switch" colorScheme="primary" defaultChecked />
          <Switch label="Secondary switch" colorScheme="secondary" defaultChecked />
          <Switch label="Success switch" colorScheme="success" defaultChecked />
          <Switch label="Error switch" colorScheme="error" defaultChecked />
          <Switch label="Warning switch" colorScheme="warning" defaultChecked />
        </div>
      </Subsection>

      <Subsection title="Switch States">
        <div className="flex flex-col space-y-3 max-w-md">
          <Switch label="Disabled switch" disabled />
          <Switch label="Disabled checked switch" disabled defaultChecked />
          <Switch label="Required switch" required />
          <Switch label="Read-only switch" readOnly defaultChecked />
        </div>
      </Subsection>

      <Subsection title="Label Placement">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Switch label="Label on right (default)" labelPlacement="end" defaultChecked />
          <Switch label="Label on left" labelPlacement="start" defaultChecked />
          <Switch label="Label on top" labelPlacement="top" defaultChecked />
          <Switch label="Label on bottom" labelPlacement="bottom" defaultChecked />
        </div>
      </Subsection>

      <Subsection title="With Icons">
        <div className="flex flex-col space-y-3 max-w-md">
          <Switch 
            label="Dark mode" 
            checkedIcon={<FaSun className="text-yellow-300" />}
            uncheckedIcon={<FaMoon className="text-blue-400" />}
            defaultChecked
          />
          <Switch 
            label="Notifications" 
            thumbIcon={<FaBell size={10} />}
            defaultChecked
          />
        </div>
      </Subsection>

      <Subsection title="Use Cases">
        <div className="p-4 border border-border rounded-md">
          <Typography variant="subtitle2" className="mb-3">App Settings</Typography>
          
          <div className="space-y-3">
            <Switch label="Enable dark mode" defaultChecked />
            <Switch label="Push notifications" />
            <Switch label="Automatic updates" defaultChecked />
            <Switch label="Sync across devices" />
          </div>
        </div>
      </Subsection>
    </div>
  );
}

// Icon showcase component
function IconShowcase() {
  return (
    <div className="p-6 bg-background rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-text-primary">Icons</h2>

      <Subsection title="Icon Sizes">
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center">
            <Icon icon={<FaStar />} size="xs" />
            <Typography variant="caption" className="mt-2">XS</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon={<FaStar />} size="sm" />
            <Typography variant="caption" className="mt-2">SM</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon={<FaStar />} size="md" />
            <Typography variant="caption" className="mt-2">MD</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon={<FaStar />} size="lg" />
            <Typography variant="caption" className="mt-2">LG</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon={<FaStar />} size="xl" />
            <Typography variant="caption" className="mt-2">XL</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon={<FaStar />} size="2xl" />
            <Typography variant="caption" className="mt-2">2XL</Typography>
          </div>
        </div>
      </Subsection>

      <Subsection title="Icon Colors">
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col items-center">
            <Icon icon={<FaStar />} size="lg" colorScheme="primary" />
            <Typography variant="caption" className="mt-2">Primary</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon={<FaStar />} size="lg" colorScheme="secondary" />
            <Typography variant="caption" className="mt-2">Secondary</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon={<FaStar />} size="lg" colorScheme="success" />
            <Typography variant="caption" className="mt-2">Success</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon={<FaStar />} size="lg" colorScheme="error" />
            <Typography variant="caption" className="mt-2">Error</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon={<FaStar />} size="lg" colorScheme="warning" />
            <Typography variant="caption" className="mt-2">Warning</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon={<FaStar />} size="lg" colorScheme="info" />
            <Typography variant="caption" className="mt-2">Info</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon={<FaStar />} size="lg" colorScheme="muted" />
            <Typography variant="caption" className="mt-2">Muted</Typography>
          </div>
        </div>
      </Subsection>

      <Subsection title="Icon Animations">
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col items-center">
            <Icon icon={<FaSpinner />} size="lg" animation="spin" />
            <Typography variant="caption" className="mt-2">Spin</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon={<FaBell />} size="lg" animation="pulse" />
            <Typography variant="caption" className="mt-2">Pulse</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon={<FaArrowRight />} size="lg" animation="bounce" />
            <Typography variant="caption" className="mt-2">Bounce</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon={<FaExclamationTriangle />} size="lg" animation="shake" />
            <Typography variant="caption" className="mt-2">Shake</Typography>
          </div>
        </div>
      </Subsection>

      <Subsection title="Interactive Icons">
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col items-center">
            <Icon 
              icon={<FaHeart />} 
              size="lg" 
              colorScheme="error" 
              onClick={() => alert('Liked!')} 
            />
            <Typography variant="caption" className="mt-2">Clickable</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Icon 
              icon={<FaBell />} 
              size="lg" 
              colorScheme="primary" 
              onClick={() => alert('Notification clicked!')}
              title="Notifications"
            />
            <Typography variant="caption" className="mt-2">With Tooltip</Typography>
          </div>
        </div>
      </Subsection>

      <Subsection title="Common Use Cases">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border border-border rounded-md">
            <Typography variant="subtitle2" className="mb-3">Navigation</Typography>
            <div className="flex gap-4">
              <Icon icon={<FaHome />} colorScheme="primary" />
              <Icon icon={<FaUser />} colorScheme="muted" />
              <Icon icon={<FaEnvelope />} colorScheme="muted" />
              <Icon icon={<FaGlobe />} colorScheme="muted" />
              <Icon icon={<FaCog />} colorScheme="muted" />
            </div>
          </div>
          
          <div className="p-4 border border-border rounded-md">
            <Typography variant="subtitle2" className="mb-3">Status Indicators</Typography>
            <div className="flex gap-4">
              <Icon icon={<FaCheck />} colorScheme="success" />
              <Icon icon={<FaTimes />} colorScheme="error" />
              <Icon icon={<FaExclamationTriangle />} colorScheme="warning" />
              <Icon icon={<FaInfo />} colorScheme="info" />
              <Icon icon={<FaSpinner />} colorScheme="primary" animation="spin" />
            </div>
          </div>
        </div>
      </Subsection>
    </div>
  );
}

// Spinner showcase component
function SpinnerShowcase() {
  return (
    <div className="p-6 bg-background rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-text-primary">Spinners</h2>

      <Subsection title="Spinner Variants">
        <div className="flex flex-wrap gap-8 items-center">
          <div className="flex flex-col items-center">
            <Spinner variant="border" />
            <Typography variant="caption" className="mt-2">Border</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Spinner variant="dots" />
            <Typography variant="caption" className="mt-2">Dots</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Spinner variant="grid" />
            <Typography variant="caption" className="mt-2">Grid</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Spinner variant="pulse" />
            <Typography variant="caption" className="mt-2">Pulse</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Spinner variant="ring" />
            <Typography variant="caption" className="mt-2">Ring</Typography>
          </div>
        </div>
      </Subsection>

      <Subsection title="Spinner Sizes">
        <div className="flex flex-wrap gap-8 items-center">
          <div className="flex flex-col items-center">
            <Spinner size="xs" />
            <Typography variant="caption" className="mt-2">XS</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Spinner size="sm" />
            <Typography variant="caption" className="mt-2">SM</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Spinner size="md" />
            <Typography variant="caption" className="mt-2">MD</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Spinner size="lg" />
            <Typography variant="caption" className="mt-2">LG</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Spinner size="xl" />
            <Typography variant="caption" className="mt-2">XL</Typography>
          </div>
        </div>
      </Subsection>

      <Subsection title="Spinner Colors">
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col items-center">
            <Spinner colorScheme="primary" />
            <Typography variant="caption" className="mt-2">Primary</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Spinner colorScheme="secondary" />
            <Typography variant="caption" className="mt-2">Secondary</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Spinner colorScheme="success" />
            <Typography variant="caption" className="mt-2">Success</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Spinner colorScheme="error" />
            <Typography variant="caption" className="mt-2">Error</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Spinner colorScheme="warning" />
            <Typography variant="caption" className="mt-2">Warning</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Spinner colorScheme="info" />
            <Typography variant="caption" className="mt-2">Info</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Spinner colorScheme="muted" />
            <Typography variant="caption" className="mt-2">Muted</Typography>
          </div>
        </div>
      </Subsection>

      <Subsection title="Spinner Thickness">
        <div className="flex flex-wrap gap-8 items-center">
          <div className="flex flex-col items-center">
            <Spinner variant="border" thickness="thin" />
            <Typography variant="caption" className="mt-2">Thin</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Spinner variant="border" thickness="regular" />
            <Typography variant="caption" className="mt-2">Regular</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Spinner variant="border" thickness="thick" />
            <Typography variant="caption" className="mt-2">Thick</Typography>
          </div>
        </div>
      </Subsection>

      <Subsection title="Spinner Speed">
        <div className="flex flex-wrap gap-8 items-center">
          <div className="flex flex-col items-center">
            <Spinner speed="slow" />
            <Typography variant="caption" className="mt-2">Slow</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Spinner speed="medium" />
            <Typography variant="caption" className="mt-2">Medium</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Spinner speed="fast" />
            <Typography variant="caption" className="mt-2">Fast</Typography>
          </div>
        </div>
      </Subsection>

      <Subsection title="Use Cases">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border border-border rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <Spinner size="sm" />
              <Typography variant="subtitle2">Loading Data</Typography>
            </div>
            <Typography variant="body2" colorScheme="muted">
              Small spinners can be used inline with text.
            </Typography>
          </div>
          
          <div className="p-4 border border-border rounded-md flex flex-col items-center justify-center py-8">
            <Spinner size="lg" colorScheme="primary" />
            <Typography variant="body2" className="mt-3">Loading content...</Typography>
          </div>
          
          <div className="p-4 border border-border rounded-md">
            <Button variant="primary" className="w-full">
              <Spinner size="sm" colorScheme="inherit" className="mr-2" />
              Saving Changes
            </Button>
          </div>
          
          <div className="p-4 border border-border rounded-md flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="relative">
                <Spinner size="xl" colorScheme="primary" variant="ring" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Typography variant="h4">75%</Typography>
                </div>
              </div>
              <Typography variant="body2" className="mt-2">Upload Progress</Typography>
            </div>
          </div>
        </div>
      </Subsection>
    </div>
  );
}

// Dropdown showcase component
function DropdownShowcase() {
  const [selectedOption, setSelectedOption] = useState<any>(undefined);

  const dropdownItems = [
    { id: 1, label: 'Option 1', value: 'option1' },
    { id: 2, label: 'Option 2', value: 'option2' },
    { id: 3, label: 'Option 3', value: 'option3' },
    { id: 4, label: 'Option 4', value: 'option4' },
    { id: 5, label: 'Option 5', value: 'option5' },
  ];

  const colorOptions = [
    { id: 'red', label: 'Red', value: 'red', icon: <FaCircle className="text-red-500" /> },
    { id: 'green', label: 'Green', value: 'green', icon: <FaCircle className="text-green-500" /> },
    { id: 'blue', label: 'Blue', value: 'blue', icon: <FaCircle className="text-blue-500" /> },
    { id: 'yellow', label: 'Yellow', value: 'yellow', icon: <FaCircle className="text-yellow-500" /> },
    { id: 'purple', label: 'Purple', value: 'purple', icon: <FaCircle className="text-purple-500" /> },
  ];

  const userOptions = [
    { id: 'user1', label: 'John Doe', value: 'john', icon: <FaUser /> },
    { id: 'user2', label: 'Jane Smith', value: 'jane', icon: <FaUser /> },
    { id: 'user3', label: 'Bob Johnson', value: 'bob', icon: <FaUser /> },
    { id: 'user4', label: 'Sarah Williams', value: 'sarah', icon: <FaUser /> },
    { id: 'user5', label: 'Michael Brown', value: 'michael', icon: <FaUser /> },
  ];

  const statusOptions = [
    { id: 'active', label: 'Active', value: 'active', icon: <FaCheck className="text-success" /> },
    { id: 'pending', label: 'Pending', value: 'pending', icon: <FaExclamationTriangle className="text-warning" /> },
    { id: 'inactive', label: 'Inactive', value: 'inactive', icon: <FaTimes className="text-error" /> },
    { id: 'disabled', label: 'Disabled', value: 'disabled', icon: <FaLock />, disabled: true },
  ];

  return (
    <div className="p-6 bg-background rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-text-primary">Dropdown</h2>

      <Subsection title="Basic Dropdown">
        <div className="max-w-xs">
          <Dropdown 
            items={dropdownItems}
            selectedItem={selectedOption}
            onSelect={setSelectedOption}
            placeholder="Select an option"
          />
        </div>
      </Subsection>

      <Subsection title="Dropdown Variants">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Dropdown 
            items={dropdownItems}
            placeholder="Filled Dropdown"
            variant="filled"
          />
          <Dropdown 
            items={dropdownItems}
            placeholder="Outlined Dropdown"
            variant="outlined"
          />
          <Dropdown 
            items={dropdownItems}
            placeholder="Unstyled Dropdown"
            variant="unstyled"
          />
        </div>
      </Subsection>

      <Subsection title="Dropdown Sizes">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Dropdown 
            items={dropdownItems}
            placeholder="Small"
            size="sm"
          />
          <Dropdown 
            items={dropdownItems}
            placeholder="Medium"
            size="md"
          />
          <Dropdown 
            items={dropdownItems}
            placeholder="Large"
            size="lg"
          />
        </div>
      </Subsection>

      <Subsection title="Dropdown Colors">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Dropdown 
            items={dropdownItems}
            placeholder="Primary"
            colorScheme="primary"
          />
          <Dropdown 
            items={dropdownItems}
            placeholder="Secondary"
            colorScheme="secondary"
          />
          <Dropdown 
            items={dropdownItems}
            placeholder="Neutral"
            colorScheme="neutral"
          />
        </div>
      </Subsection>

      <Subsection title="Dropdown Placement">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <Dropdown 
              items={dropdownItems}
              placeholder="Bottom Start"
              placement="bottom-start"
            />
            <Dropdown 
              items={dropdownItems}
              placeholder="Bottom"
              placement="bottom"
            />
            <Dropdown 
              items={dropdownItems}
              placeholder="Bottom End"
              placement="bottom-end"
            />
          </div>
          <div className="flex flex-col gap-4">
            <Dropdown 
              items={dropdownItems}
              placeholder="Top Start"
              placement="top-start"
            />
            <Dropdown 
              items={dropdownItems}
              placeholder="Top"
              placement="top"
            />
            <Dropdown 
              items={dropdownItems}
              placeholder="Top End"
              placement="top-end"
            />
          </div>
        </div>
      </Subsection>

      <Subsection title="Dropdown with Icons">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Dropdown 
            items={colorOptions}
            placeholder="Select a color"
            icon={<FaPalette />}
          />
          <Dropdown 
            items={userOptions}
            placeholder="Select a user"
            icon={<FaUser />}
          />
        </div>
      </Subsection>

      <Subsection title="Searchable Dropdown">
        <div className="max-w-xs">
          <Dropdown 
            items={userOptions}
            placeholder="Search for a user"
            searchable
          />
        </div>
      </Subsection>

      <Subsection title="Dropdown States">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Dropdown 
            items={statusOptions}
            placeholder="Status options"
          />
          <Dropdown 
            items={dropdownItems}
            placeholder="Disabled dropdown"
            disabled
          />
          <Dropdown 
            items={dropdownItems}
            placeholder="Required field"
            required
          />
        </div>
      </Subsection>

      <Subsection title="Use Cases">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border border-border rounded-md">
            <Typography variant="subtitle2" className="mb-3">Form Field</Typography>
            <div className="space-y-2">
              <Typography variant="body2" className="mb-1">Status</Typography>
              <Dropdown 
                items={statusOptions}
                placeholder="Select status"
                fullWidth
              />
            </div>
          </div>
          
          <div className="p-4 border border-border rounded-md">
            <Typography variant="subtitle2" className="mb-3">Filter Selection</Typography>
            <div className="flex gap-2">
              <Dropdown 
                items={userOptions}
                placeholder="User"
                size="sm"
              />
              <Dropdown 
                items={statusOptions}
                placeholder="Status"
                size="sm"
              />
            </div>
          </div>
        </div>
      </Subsection>
    </div>
  );
}

// Design Principles showcase component
function DesignPrinciplesShowcase() {
  return (
    <div className="p-6 bg-background rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-text-primary">Design Principles</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="p-5 border border-border rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-start mb-3">
            <div className="p-2 rounded-md bg-primary/10 mr-3">
              <FaLayerGroup className="text-primary text-xl" />
            </div>
            <div>
              <Typography variant="subtitle1" className="mb-1">Consistency & Cohesion</Typography>
              <Typography variant="body2" colorScheme="muted">
                Our components share a common visual language and behavior patterns, creating a unified and intuitive experience across the entire interface.
              </Typography>
            </div>
          </div>
        </div>

        <div className="p-5 border border-border rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-start mb-3">
            <div className="p-2 rounded-md bg-primary/10 mr-3">
              <FaUniversalAccess className="text-primary text-xl" />
            </div>
            <div>
              <Typography variant="subtitle1" className="mb-1">Accessibility First</Typography>
              <Typography variant="body2" colorScheme="muted">
                Every component is designed to meet WCAG 2.1 AA standards with keyboard navigation, screen reader support, and appropriate contrast ratios.
              </Typography>
            </div>
          </div>
        </div>

        <div className="p-5 border border-border rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-start mb-3">
            <div className="p-2 rounded-md bg-primary/10 mr-3">
              <FaFeather className="text-primary text-xl" />
            </div>
            <div>
              <Typography variant="subtitle1" className="mb-1">Purposeful Animation</Typography>
              <Typography variant="body2" colorScheme="muted">
                Micro-interactions and animations enhance the user experience by providing feedback, guiding attention, and adding delight without sacrificing performance.
              </Typography>
            </div>
          </div>
        </div>

        <div className="p-5 border border-border rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-start mb-3">
            <div className="p-2 rounded-md bg-primary/10 mr-3">
              <FaCubes className="text-primary text-xl" />
            </div>
            <div>
              <Typography variant="subtitle1" className="mb-1">Composability</Typography>
              <Typography variant="body2" colorScheme="muted">
                Components are designed to work together seamlessly while maintaining their individual functionality, enabling complex interfaces to be built from simple building blocks.
              </Typography>
            </div>
          </div>
        </div>
      </div>

      <Subsection title="Core Design Values">
        <div className="space-y-6">
          <div className="border-l-4 border-primary pl-4 py-2">
            <Typography variant="subtitle1" className="mb-1">User-Centered Design</Typography>
            <Typography variant="body2">
              We prioritize the needs, expectations, and limitations of end-users throughout the design process, creating interfaces that are intuitive, efficient, and enjoyable to use.
            </Typography>
          </div>
          
          <div className="border-l-4 border-primary pl-4 py-2">
            <Typography variant="subtitle1" className="mb-1">Progressive Enhancement</Typography>
            <Typography variant="body2">
              Our components work in their basic form first, with enhanced functionality and visual richness added progressively as browser capabilities and user needs require.
            </Typography>
          </div>
          
          <div className="border-l-4 border-primary pl-4 py-2">
            <Typography variant="subtitle1" className="mb-1">Responsive & Adaptive</Typography>
            <Typography variant="body2">
              Components respond appropriately to different screen sizes, input methods, and user preferences, providing an optimal experience across devices.
            </Typography>
          </div>
        </div>
      </Subsection>

      <Subsection title="Micro-Interaction Principles">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded-md bg-bg-surface hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]">
            <Typography variant="subtitle2" weight="semibold" className="mb-2">
              Subtle Feedback
            </Typography>
            <Typography variant="body2">
              Animations provide feedback that's noticeable but not distracting, confirming user actions without disrupting flow.
            </Typography>
          </div>
          <div className="p-4 border border-border rounded-md bg-bg-surface hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]">
            <Typography variant="subtitle2" weight="semibold" className="mb-2">
              Meaningful Motion
            </Typography>
            <Typography variant="body2">
              Every animation serves a purpose, whether guiding attention, showing relationships, or indicating state changes.
            </Typography>
          </div>
          <div className="p-4 border border-border rounded-md bg-bg-surface hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]">
            <Typography variant="subtitle2" weight="semibold" className="mb-2">
              Natural Physics
            </Typography>
            <Typography variant="body2">
              Animations follow natural physics principles with appropriate easing, creating interactions that feel intuitive and lifelike.
            </Typography>
          </div>
        </div>
      </Subsection>

      <Subsection title="Visual Language">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 border border-border rounded-lg hover:shadow-md transition-shadow">
            <Typography variant="subtitle1" className="mb-2">Color System</Typography>
            <div className="flex gap-2 flex-wrap mb-3">
              <div className="p-3 rounded-md bg-primary text-white font-medium">Primary</div>
              <div className="p-3 rounded-md bg-secondary text-white font-medium">Secondary</div>
              <div className="p-3 rounded-md bg-success text-white font-medium">Success</div>
              <div className="p-3 rounded-md bg-error text-white font-medium">Error</div>
              <div className="p-3 rounded-md bg-warning text-black font-medium">Warning</div>
            </div>
            <Typography variant="body2">
              Our color system is designed for accessibility, meaning, and visual hierarchy, with semantic colors for states and actions.
            </Typography>
          </div>
          
          <div className="p-5 border border-border rounded-lg hover:shadow-md transition-shadow">
            <Typography variant="subtitle1" className="mb-2">Typography</Typography>
            <div className="space-y-2 mb-3">
              <Typography variant="h3">Heading</Typography>
              <Typography variant="body1">Body Text</Typography>
              <Typography variant="caption">Caption</Typography>
            </div>
            <Typography variant="body2">
              Our type system uses a clear hierarchy, appropriate spacing, and consistent styling to ensure readability and scannability.
            </Typography>
          </div>
          
          <div className="p-5 border border-border rounded-lg hover:shadow-md transition-shadow">
            <Typography variant="subtitle1" className="mb-2">Spacing & Layout</Typography>
            <div className="flex gap-2 mb-3">
              <div className="h-8 w-2 bg-primary/20 rounded"></div>
              <div className="h-8 w-4 bg-primary/30 rounded"></div>
              <div className="h-8 w-8 bg-primary/40 rounded"></div>
              <div className="h-8 w-12 bg-primary/50 rounded"></div>
              <div className="h-8 w-16 bg-primary/60 rounded"></div>
            </div>
            <Typography variant="body2">
              We use a consistent spacing scale and grid system to create balanced, harmonious layouts that guide the eye and create visual rhythm.
            </Typography>
          </div>
          
          <div className="p-5 border border-border rounded-lg hover:shadow-md transition-shadow">
            <Typography variant="subtitle1" className="mb-2">Shape & Elevation</Typography>
            <div className="flex gap-3 mb-3">
              <div className="h-16 w-16 bg-bg-surface rounded shadow-sm"></div>
              <div className="h-16 w-16 bg-bg-surface rounded-md shadow"></div>
              <div className="h-16 w-16 bg-bg-surface rounded-lg shadow-md"></div>
              <div className="h-16 w-16 bg-bg-surface rounded-xl shadow-lg"></div>
            </div>
            <Typography variant="body2">
              Our component shapes and elevation system creates a sense of depth and hierarchy while maintaining a clean, modern aesthetic.
            </Typography>
          </div>
        </div>
      </Subsection>
    </div>
  );
}

// Calendar showcase component
function CalendarShowcase() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: null, endDate: null });

  return (
    <div className="p-6 bg-background rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-text-primary">Calendar</h2>

      <Subsection title="Calendar Variants">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <Calendar 
              variant="filled" 
              value={selectedDate}
              onChange={setSelectedDate}
              animationStyle="fade"
            />
            <Typography variant="body2" className="mt-2 text-text-muted">Filled Variant</Typography>
          </div>
          
          <div className="flex flex-col items-center">
            <Calendar 
              variant="outlined" 
              value={selectedDate}
              onChange={setSelectedDate}
              animationStyle="slide"
            />
            <Typography variant="body2" className="mt-2 text-text-muted">Outlined Variant</Typography>
          </div>
          
          <div className="flex flex-col items-center">
            <Calendar 
              variant="minimal" 
              value={selectedDate}
              onChange={setSelectedDate}
              animationStyle="zoom"
            />
            <Typography variant="body2" className="mt-2 text-text-muted">Minimal Variant</Typography>
          </div>
        </div>
      </Subsection>

      <Subsection title="Calendar Sizes">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <Calendar 
              size="sm" 
              value={selectedDate}
              onChange={setSelectedDate}
            />
            <Typography variant="body2" className="mt-2 text-text-muted">Small Size</Typography>
          </div>
          
          <div className="flex flex-col items-center">
            <Calendar 
              size="md" 
              value={selectedDate}
              onChange={setSelectedDate}
            />
            <Typography variant="body2" className="mt-2 text-text-muted">Medium Size</Typography>
          </div>
          
          <div className="flex flex-col items-center">
            <Calendar 
              size="lg" 
              value={selectedDate}
              onChange={setSelectedDate}
            />
            <Typography variant="body2" className="mt-2 text-text-muted">Large Size</Typography>
          </div>
        </div>
      </Subsection>

      <Subsection title="Range Selection">
        <div className="flex flex-col items-center">
          <div className="max-w-lg">
            <Typography variant="body2" className="mb-4 text-text-muted">
              Click to select a start date, then click again to select an end date. The dates in between will be highlighted.
            </Typography>
            
            <Calendar 
              selectionMode="range"
              dateRange={dateRange}
              onRangeChange={(range: DateRange) => setDateRange(range)}
              colorScheme="primary"
              size="lg"
            />
          </div>
        </div>
      </Subsection>

      <Subsection title="Date Constraints">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <Calendar 
              minDate={new Date(new Date().setDate(new Date().getDate() - 5))}
              maxDate={new Date(new Date().setDate(new Date().getDate() + 5))}
              value={selectedDate}
              onChange={setSelectedDate}
            />
            <Typography variant="body2" className="mt-2 text-text-muted">
              Min & Max Date Constraints
            </Typography>
            <Typography variant="caption" className="text-text-muted">
              Only allows selecting dates within 5 days before and after today
            </Typography>
          </div>
          
          <div className="flex flex-col items-center">
            <Calendar 
              disabledDates={[
                new Date(new Date().setDate(new Date().getDate() + 2)),
                new Date(new Date().setDate(new Date().getDate() + 4)),
                new Date(new Date().setDate(new Date().getDate() + 6))
              ]}
              value={selectedDate}
              onChange={setSelectedDate}
              isDateHighlighted={(date: Date) => {
                // Highlight weekends
                return date.getDay() === 0 || date.getDay() === 6;
              }}
            />
            <Typography variant="body2" className="mt-2 text-text-muted">
              Disabled & Highlighted Dates
            </Typography>
            <Typography variant="caption" className="text-text-muted">
              Some dates are disabled, and weekends are highlighted
            </Typography>
          </div>
        </div>
      </Subsection>

      <Subsection title="Customization Options">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <Calendar 
              showOutsideDays={false}
              headerFormat="MMM yyyy"
              firstDayOfWeek={1} // Monday
              value={selectedDate}
              onChange={setSelectedDate}
            />
            <Typography variant="body2" className="mt-2 text-text-muted">
              Hidden Outside Days, Custom Header & Monday Start
            </Typography>
          </div>
          
          <div className="flex flex-col items-center">
            <Calendar 
              showHeader={false}
              showFooter={false}
              value={selectedDate}
              onChange={setSelectedDate}
              colorScheme="secondary"
            />
            <Typography variant="body2" className="mt-2 text-text-muted">
              No Header/Footer & Secondary Color
            </Typography>
          </div>
        </div>
      </Subsection>

      <div className="mt-8 p-4 bg-primary/10 rounded-md">
        <Typography variant="subtitle2" weight="medium" className="mb-2">Key Features</Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-border/50 rounded p-3 bg-bg-surface">
            <Typography variant="body2" weight="medium" className="mb-1">
              <FaCalendarAlt className="inline-block mr-1 text-primary" /> Range Selection
            </Typography>
            <Typography variant="caption">
              Support for selecting date ranges with intuitive highlighting and interactions
            </Typography>
          </div>
          
          <div className="border border-border/50 rounded p-3 bg-bg-surface">
            <Typography variant="body2" weight="medium" className="mb-1">
              <FaCheck className="inline-block mr-1 text-primary" /> Constraints & Validation
            </Typography>
            <Typography variant="caption">
              Set min/max dates, disable specific dates, or implement custom validation rules
            </Typography>
          </div>
          
          <div className="border border-border/50 rounded p-3 bg-bg-surface">
            <Typography variant="body2" weight="medium" className="mb-1">
              <FaFeather className="inline-block mr-1 text-primary" /> Smooth Animations
            </Typography>
            <Typography variant="caption">
              Multiple animation styles provide visual feedback and enhance the user experience
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

// Toast showcase component
function ToastShowcase() {
  const { addToast, removeAllToasts, updateToast } = useToast();
  const [position, setPosition] = useState<ToastPosition>('top-right');
  const [animationStyle, setAnimationStyle] = useState<ToastAnimationStyle>('slide');
  
  const showToast = (type: ToastType, title?: string) => {
    const toastTitles = {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Information',
      default: 'Notification'
    };
    
    const toastMessages = {
      success: 'Operation completed successfully.',
      error: 'An error occurred while processing your request.',
      warning: 'Please review the information before proceeding.',
      info: 'Here is some helpful information for you.',
      default: 'This is a generic notification.'
    };
    
    addToast({
      type,
      title: title || toastTitles[type],
      message: toastMessages[type],
      position,
      animationStyle,
      duration: 5000
    });
  };

  // Function to demonstrate toast for loading operations
  const showLoadingToast = () => {
    const toastId = addToast({
      type: 'info',
      title: 'Loading',
      message: 'Please wait while we process your request...',
      position,
      animationStyle,
      duration: Infinity // Won't auto-close
    });

    // Simulate an API call
    setTimeout(() => {
      // Update the toast with success message
      updateToast(toastId, {
        type: 'success',
        title: 'Success',
        message: 'Your data has been successfully loaded!',
        duration: 3000 // Will auto-close after 3s
      });
    }, 2000);
  };

  // Function to demonstrate a toast with actions
  const showActionToast = () => {
    addToast({
      type: 'warning',
      title: 'Unsaved Changes',
      message: 'You have unsaved changes. Would you like to save them?',
      position,
      animationStyle,
      duration: 10000,
      onClose: () => console.log('Toast closed')
    });
  };

  // Function to demonstrate a multi-step process with toasts
  const showMultiStepToast = () => {
    const steps = [
      { type: 'info', title: 'Step 1', message: 'Starting the process...' },
      { type: 'info', title: 'Step 2', message: 'Processing data...' },
      { type: 'info', title: 'Step 3', message: 'Finalizing...' },
      { type: 'success', title: 'Complete', message: 'All steps completed successfully!' }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        addToast({
          type: step.type as ToastType,
          title: step.title,
          message: step.message,
          position,
          animationStyle,
          duration: index === steps.length - 1 ? 5000 : 2000
        });
      }, index * 1500);
    });
  };
  
  return (
    <div className="p-6 bg-background rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-text-primary">Toast Notifications</h2>
      
      <Subsection title="Toast Types">
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => showToast('success')} variant="primary" leftIcon={FaCheck}>
            Success
          </Button>
          <Button onClick={() => showToast('error')} variant="danger" leftIcon={FaTimes}>
            Error
          </Button>
          <Button onClick={() => showToast('warning')} leftIcon={FaExclamationTriangle}>
            Warning
          </Button>
          <Button onClick={() => showToast('info')} variant="outline" leftIcon={FaInfo}>
            Info
          </Button>
          <Button onClick={() => showToast('default')} variant="ghost" leftIcon={FaBell}>
            Default
          </Button>
        </div>
      </Subsection>
      
      <Subsection title="Toast Positions">
        <div className="mb-4">
          <Typography variant="body2" className="mb-2">
            Select a position for the toast:
          </Typography>
          <div className="flex flex-wrap gap-3">
            {(['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'] as ToastPosition[]).map(pos => (
              <Button
                key={pos}
                variant={position === pos ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setPosition(pos)}
              >
                {pos.replace('-', ' ')}
              </Button>
            ))}
          </div>
        </div>
        
        <Button 
          onClick={() => showToast('info', `Position: ${position}`)} 
          leftIcon={FaInfo}
        >
          Show Toast at {position.replace('-', ' ')}
        </Button>
      </Subsection>
      
      <Subsection title="Animation Styles">
        <div className="mb-4">
          <Typography variant="body2" className="mb-2">
            Select an animation style:
          </Typography>
          <div className="flex flex-wrap gap-3">
            {(['fade', 'slide', 'zoom', 'flip'] as ToastAnimationStyle[]).map(style => (
              <Button
                key={style}
                variant={animationStyle === style ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setAnimationStyle(style)}
              >
                {style}
              </Button>
            ))}
          </div>
        </div>
        
        <Button 
          onClick={() => showToast('info', `Animation: ${animationStyle}`)} 
          leftIcon={FaInfo}
        >
          Show Toast with {animationStyle} animation
        </Button>
      </Subsection>
      
      <Subsection title="Advanced Use Cases">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-border rounded-md">
            <Typography variant="subtitle2" weight="medium" className="mb-2">Loading State</Typography>
            <Typography variant="body2" className="mb-3">
              Show a loading toast that updates on completion
            </Typography>
            <Button onClick={showLoadingToast} variant="primary" leftIcon={FaSpinner}>
              Start Loading
            </Button>
          </div>
          
          <div className="p-4 border border-border rounded-md">
            <Typography variant="subtitle2" weight="medium" className="mb-2">Action Notification</Typography>
            <Typography variant="body2" className="mb-3">
              Show a toast for user decisions with a longer timeout
            </Typography>
            <Button onClick={showActionToast} variant="primary" leftIcon={FaExclamationTriangle}>
              Show Action Toast
            </Button>
          </div>
          
          <div className="p-4 border border-border rounded-md">
            <Typography variant="subtitle2" weight="medium" className="mb-2">Multi-step Process</Typography>
            <Typography variant="body2" className="mb-3">
              Show a sequence of toasts representing process steps
            </Typography>
            <Button onClick={showMultiStepToast} variant="primary" leftIcon={FaList}>
              Start Process
            </Button>
          </div>
          
          <div className="p-4 border border-border rounded-md">
            <Typography variant="subtitle2" weight="medium" className="mb-2">Multiple Toasts</Typography>
            <Typography variant="body2" className="mb-3">
              Show multiple toasts of different types
            </Typography>
            <Button 
              onClick={() => {
                ['success', 'info', 'warning', 'error', 'default'].forEach((type, index) => {
                  setTimeout(() => {
                    showToast(type as ToastType, `Toast ${index + 1}`);
                  }, index * 300);
                });
              }} 
              variant="primary"
              leftIcon={FaLayerGroup}
            >
              Show Multiple Toasts
            </Button>
          </div>
        </div>
      </Subsection>
      
      <Subsection title="Toast Management">
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={removeAllToasts} 
            variant="outline"
            leftIcon={FaTimes}
          >
            Clear All Toasts
          </Button>
        </div>
      </Subsection>
      
      <div className="mt-6 p-4 bg-primary/10 rounded-md">
        <Typography variant="subtitle2" weight="medium" className="mb-2">Toast Best Practices</Typography>
        <Typography variant="body2">
          <ul className="list-disc pl-5 space-y-1">
            <li>Use toast notifications for non-critical information or feedback</li>
            <li>Keep messages short and actionable</li>
            <li>Use appropriate types: success for confirmations, error for failures, etc.</li>
            <li>Choose positions based on importance: top positions are more prominent</li>
            <li>Don't overwhelm users with too many notifications at once</li>
            <li>Use loading toasts for operations that take time, then update with results</li>
          </ul>
        </Typography>
      </div>
    </div>
  );
}

// DatePicker showcase component
function DatePickerShowcase() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: new Date(), endDate: null });
  
  return (
    <div className="p-6 bg-background rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-text-primary">DatePicker</h2>

      <Subsection title="Basic DatePicker">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
          <div>
            <DatePicker
              label="Select a date"
              value={selectedDate}
              onChange={setSelectedDate}
              helperText="Click to open the calendar"
            />
            <div className="mt-2">
              <Typography variant="body2" colorScheme="muted">
                Selected date: {selectedDate ? selectedDate.toLocaleDateString() : 'None'}
              </Typography>
            </div>
          </div>
          
          <div>
            <DatePicker
              label="Date with custom format"
              value={selectedDate}
              onChange={setSelectedDate}
              displayFormat="MM/dd/yyyy"
              valueFormat="MM/dd/yyyy"
              helperText="Displayed in MM/DD/YYYY format"
            />
          </div>
        </div>
      </Subsection>

      <Subsection title="DatePicker Variants">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <DatePicker
            label="Outlined Variant"
            variant="outlined"
            placeholder="Select date"
          />
          
          <DatePicker
            label="Filled Variant"
            variant="filled"
            placeholder="Select date"
          />
          
          <DatePicker
            label="Underlined Variant"
            variant="underlined"
            placeholder="Select date"
          />
        </div>
      </Subsection>

      <Subsection title="DatePicker Sizes">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <DatePicker
            label="Small Size"
            size="sm"
            calendarSize="sm"
            placeholder="Select date"
          />
          
          <DatePicker
            label="Medium Size"
            size="md"
            calendarSize="md"
            placeholder="Select date"
          />
          
          <DatePicker
            label="Large Size"
            size="lg"
            calendarSize="lg"
            placeholder="Select date"
          />
        </div>
      </Subsection>

      <Subsection title="Range DatePicker">
        <div className="max-w-xl">
          <DatePicker
            label="Select date range"
            isRangePicker
            dateRange={dateRange}
            onRangeChange={setDateRange}
            helperText="Select a start and end date"
          />
          <div className="mt-2">
            <Typography variant="body2" colorScheme="muted">
              Selected range: {dateRange.startDate ? dateRange.startDate.toLocaleDateString() : 'None'} 
              {' to '} 
              {dateRange.endDate ? dateRange.endDate.toLocaleDateString() : 'None'}
            </Typography>
          </div>
        </div>
      </Subsection>

      <Subsection title="With Constraints">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          <DatePicker
            label="With Min/Max Date"
            minDate={new Date(new Date().setDate(new Date().getDate() - 5))}
            maxDate={new Date(new Date().setDate(new Date().getDate() + 10))}
            helperText="Only dates within ±5 days from today are allowed"
          />
          
          <DatePicker
            label="Weekend Days Disabled"
            disabledDates={(date) => {
              const day = date.getDay();
              return day === 0 || day === 6; // Disable weekends
            }}
            helperText="Weekends are disabled"
          />
        </div>
      </Subsection>

      <Subsection title="Placement Options">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          <DatePicker
            label="Top Start Placement"
            placement="top-start"
            helperText="Calendar opens above the input, aligned to the left"
          />
          
          <DatePicker
            label="Bottom End Placement"
            placement="bottom-end"
            helperText="Calendar opens below the input, aligned to the right"
          />
        </div>
      </Subsection>

      <Subsection title="Animation Styles">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <DatePicker
            label="Fade Animation"
            animationStyle="fade"
            helperText="Calendar fades in/out"
          />
          
          <DatePicker
            label="Slide Animation"
            animationStyle="slide"
            helperText="Calendar slides in/out"
          />
          
          <DatePicker
            label="Zoom Animation"
            animationStyle="zoom"
            helperText="Calendar zooms in/out"
          />
        </div>
      </Subsection>

      <div className="mt-8 p-4 bg-primary/10 rounded-md">
        <Typography variant="subtitle2" weight="medium" className="mb-2">Key Features</Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-border/50 rounded p-3 bg-bg-surface">
            <Typography variant="body2" weight="medium" className="mb-1">
              <FaCalendarAlt className="inline-block mr-1 text-primary" /> Date Selection
            </Typography>
            <Typography variant="caption">
              Select dates via text input or interactive calendar popup
            </Typography>
          </div>
          
          <div className="border border-border/50 rounded p-3 bg-bg-surface">
            <Typography variant="body2" weight="medium" className="mb-1">
              <FaCheck className="inline-block mr-1 text-primary" /> Range Selection
            </Typography>
            <Typography variant="caption">
              Select date ranges with start and end dates for period selections
            </Typography>
          </div>
          
          <div className="border border-border/50 rounded p-3 bg-bg-surface">
            <Typography variant="body2" weight="medium" className="mb-1">
              <FaFeather className="inline-block mr-1 text-primary" /> Format Flexibility
            </Typography>
            <Typography variant="caption">
              Customizable date formats for display and storage needs
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component showcase page
const ComponentShowcasePage: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState('Button');
  
  // Find the active component from registry
  const currentComponent = componentRegistry.find(c => c.name === activeComponent) || componentRegistry[0];

  return (
    <ToastProvider defaultPosition="bottom-right">
      <div className="min-h-screen bg-bg-base text-text-base p-4 md:p-8 transition-colors duration-300">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary">Component Showcase</h1>
          <ThemeToggleButton />
        </header>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar navigation */}
          <div className="w-full md:w-64 flex-shrink-0">
            <ComponentNav 
              components={componentRegistry}
              activeComponent={activeComponent}
              onSelectComponent={setActiveComponent}
            />
          </div>

          {/* Main content area */}
          <main className="flex-grow">
            <Section title={currentComponent.name}>
              <div className="mb-4">
                <p className="text-text-muted">{currentComponent.description}</p>
                <div className="mt-1 text-sm text-text-muted">
                  Category: <span className="text-primary capitalize">{currentComponent.category}</span>
                </div>
              </div>
              <currentComponent.component />
            </Section>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
};

export default ComponentShowcasePage;