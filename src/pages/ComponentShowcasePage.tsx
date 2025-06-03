// src/pages/ComponentShowcasePage.tsx
import React from 'react';
import { Button } from '../components/atoms/Button/Button';
import { ThemeToggleButton } from '../components/ThemeToggleButton'; // Assuming you created this

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-12 p-6 bg-bg-surface rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold mb-6 text-text-base border-b border-border pb-2">{title}</h2>
    <div className="space-y-4">{children}</div>
  </section>
);

const ComponentShowcasePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-base text-text-base p-4 md:p-8 transition-colors duration-300">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Component Showcase</h1>
        <ThemeToggleButton />
      </header>

      <main>
        <Section title="Buttons">
          <div className="flex flex-wrap gap-4 items-start">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button isLoading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="flex flex-wrap gap-4 items-start mt-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium (Default)</Button>
            <Button size="lg">Large</Button>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2 text-text-muted">With Icons</h3>
            <div className="flex flex-wrap gap-4 items-start">
              <Button leftIcon={<span>⭐</span>}>Left Icon</Button>
              <Button rightIcon={<span>➡️</span>}>Right Icon</Button>
            </div>
          </div>
        </Section>

        <Section title="Colors & Themes (Demonstration)">
          <p className="mb-2 text-text-muted">Current theme colors are applied. Toggle theme to see changes.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-primary text-white rounded">Primary</div>
            <div className="p-4 bg-secondary text-white rounded">Secondary</div>
            <div className="p-4 bg-bg-surface text-text-base rounded border border-border">Surface</div>
            <div className="p-4 bg-error text-white rounded">Error</div>
            <div className="p-4 bg-success text-white rounded">Success</div>
            <div className="p-4 bg-warning text-black rounded">Warning</div> {/* Note: text-black for contrast on yellow */}
          </div>
        </Section>

        {/* Add more sections for other components (Inputs, Cards, Modals, etc.) */}
        {/* <Section title="Inputs">...</Section> */}
        {/* <Section title="Cards">...</Section> */}
      </main>
    </div>
  );
};

export default ComponentShowcasePage;