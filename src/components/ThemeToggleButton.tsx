// src/components/ThemeToggleButton.tsx
import React from 'react';
import { useTheme } from '../contexts/ThemeContext'; // Adjust path

export const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded bg-bg-surface text-text-base hover:bg-primary/10 dark:bg-bg-surface dark:text-text-base dark:hover:bg-primary/20 transition-colors"
      aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
    >
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
};