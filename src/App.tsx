// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Header, Footer } from './components/organisms';
import ComponentShowcasePage from './pages/ComponentShowcasePage';

// Home page placeholder
const HomePage = () => {
  return (
    <motion.div 
      className="container mx-auto px-4 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Welcome to our Design System
        </motion.h1>
        
        <motion.p 
          className="text-xl text-text-muted mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          A beautiful, modern, and customizable design system built with React and Tailwind CSS.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex justify-center gap-4 flex-wrap"
        >
          <Link 
            to="/components" 
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors duration-300 inline-flex items-center"
          >
            <span className="mr-2">✨</span>
            Explore Components
          </Link>
          
          <a 
            href="https://github.com/yourusername/design-system" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-3 bg-bg-surface hover:bg-bg-muted border border-border text-text font-medium rounded-lg transition-colors duration-300 inline-flex items-center"
          >
            <span className="mr-2">⭐</span>
            Star on GitHub
          </a>
        </motion.div>
        
        <motion.div 
          className="mt-16 p-8 bg-bg-surface rounded-xl shadow-lg border border-border"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
          <p className="text-text-muted mb-6">
            Start building beautiful, accessible, and responsive UIs with our design system.
            Check out the component showcase to see what's available.
          </p>
          
          <div className="bg-bg-muted p-4 rounded-lg text-left overflow-hidden">
            <pre className="text-sm overflow-x-auto">
              <code className="text-text-muted">
                npm install your-design-system<br/>
                # or<br/>
                yarn add your-design-system
              </code>
            </pre>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Page transition wrapper
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ 
          type: "tween", 
          ease: "easeInOut", 
          duration: 0.25 
        }}
        className="flex flex-col min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// App component with routing
function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  
  // Update currentPath when location changes
  const AppContent = () => {
    const location = useLocation();
    
    useEffect(() => {
      setCurrentPath(location.pathname);
    }, [location]);
    
    // Navigation items for the header
    const navItems = [
      { label: 'Home', href: '/', isActive: location.pathname === '/' },
      { label: 'Component Showcase', href: '/components', isActive: location.pathname === '/components' }
    ];
    
    const handleNavItemClick = (item: { label: string; href: string; isActive?: boolean }) => {
      // Navigation happens via React Router's Link components
    };
    
    return (
      <div className="flex flex-col min-h-screen bg-bg text-text">
        <Header 
          logoText="DesignSys" 
          navItems={navItems}
          onNavItemClick={handleNavItemClick}
          useGlassEffect={true}
          isSticky={true}
        />
        
        <main className="flex-grow">
          <PageTransition>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/components" element={<ComponentShowcasePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PageTransition>
        </main>
        
        <Footer 
          companyName="DesignSys"
          socialLinks={[
            { platform: 'twitter', url: 'https://twitter.com', label: 'Twitter' },
            { platform: 'github', url: 'https://github.com', label: 'GitHub' },
            { platform: 'linkedin', url: 'https://linkedin.com', label: 'LinkedIn' }
          ]}
        />
      </div>
    );
  };

  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;