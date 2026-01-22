// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          DEFAULT: '#F8C3CD',
          light: '#FCE4E3',
        },
        sage: {
          DEFAULT: '#8B7355',
          light: '#C5E0B4',
        },
        ivory: '#F8F3F0',
        charcoal: '#333333',
        whatsapp: {
          DEFAULT: '#25D366',
          dark: '#128C7E',
        },
      },
      fontFamily: {
        heading: ['var(--font-playfair)', 'serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};