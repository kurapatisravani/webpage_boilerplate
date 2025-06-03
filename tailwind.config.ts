// tailwind.config.ts (optional, if needed for advanced config or if Vite plugin utilizes it)
import type { Config } from 'tailwindcss'

export default {
  content: [ // Automatic content detection is better in v4, but explicit paths are safe
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Your theme extensions will go here if using JS config
      // For v4, prefer defining theme variables directly in your CSS (see Phase 2)
    },
  },
  plugins: [],
} satisfies Config