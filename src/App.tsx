// src/App.tsx
import ComponentShowcasePage from './pages/ComponentShowcasePage';
import { useTheme } from './contexts/ThemeContext';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-bg text-text">
      <nav className="p-4 bg-bg-surface border-b border-border">
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded font-medium bg-primary text-text-inverted hover:bg-primary-light transition-colors"
        >
          Toggle Theme ({theme})
        </button>
      </nav>
      
      <main className="p-8">
        <div className="bg-bg-surface border border-border p-4 rounded mb-4">
          <h1 className="text-2xl font-bold mb-4">Theme Test</h1>
          <p className="text-text-muted">This text should change color with the theme.</p>
        </div>

        <div className="space-x-4">
          <button className="px-4 py-2 rounded font-medium bg-primary text-text-inverted hover:bg-primary-light transition-colors">
            Primary Button
          </button>
          <button className="px-4 py-2 rounded font-medium bg-secondary text-text-inverted hover:bg-secondary-light transition-colors">
            Secondary Button
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-bg-surface border border-border p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Primary Colors</h2>
            <div className="space-y-2">
              <div className="p-2 rounded bg-primary text-text-inverted">Primary</div>
              <div className="p-2 rounded bg-primary-light text-text-inverted">Primary Light</div>
              <div className="p-2 rounded bg-primary-dark text-text-inverted">Primary Dark</div>
            </div>
          </div>

          <div className="bg-bg-surface border border-border p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Background Colors</h2>
            <div className="space-y-2">
              <div className="p-2 rounded bg-bg border border-border">Background</div>
              <div className="p-2 rounded bg-bg-surface border border-border">Surface</div>
              <div className="p-2 rounded bg-bg-muted border border-border">Muted</div>
            </div>
          </div>
        </div>
      </main>

      <ComponentShowcasePage />
    </div>
  );
}

export default App;