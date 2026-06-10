/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // VisoDesign colors
        'viso-bg-primary': '#0d1117',
        'viso-bg-secondary': '#161b22',
        'viso-bg-tertiary': '#21262d',
        'viso-accent': '#3ddc84',
        'viso-accent-dim': '#2ea043',
        'viso-gold': '#ffd700',
        'viso-red': '#f85149',
        'viso-orange': '#ff9800',
        'text-primary': '#f0f6fc',
        'text-secondary': '#8b949e',
        'text-muted': '#6e7681',
      },
      backgroundColor: {
        glass: 'rgba(13, 17, 23, 0.75)',
      },
      borderColor: {
        glass: 'rgba(48, 54, 61, 0.6)',
      },
      boxShadow: {
        glow: '0 0 20px rgba(61, 220, 132, 0.4)',
      }
    },
  },
  plugins: [],
}
