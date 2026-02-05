/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        shopee: ["var(--font-shopee)"],
        sans: ["var(--font-shopee)"],
        serif: ["var(--font-shopee)"], /* Shopee tidak pakai serif */
      },
      colors: {
        // === PRIMARY COLORS (Shopee Mall Red) ===
        primary: {
          DEFAULT: '#d0011b',      // EXACT from reference HTML
          dark: '#b00116',         // EXACT: Hover state
          light: '#ffe6e9',        // EXACT: Light background
        },

        // === GOLD ACCENT (for category badges) ===
        gold: {
          DEFAULT: '#c5a368',      // EXACT from reference (.card-category)
          dark: '#a88747',         // EXACT: Dark variant
        },

        // === NEUTRAL PALETTE (EXACT from reference) ===
        neutral: {
          50: '#fafafa',           // EXACT: --neutral-50
          100: '#f5f5f5',          // EXACT: --neutral-100
          200: '#e0e0e0',          // EXACT: --neutral-200
          300: '#bdbdbd',          // EXACT: --neutral-300
          500: '#757575',          // EXACT: --neutral-500
          700: '#424242',          // EXACT: --neutral-700
          900: '#212121',          // EXACT: --neutral-900
        },

        // Functional colors (from reference)
        success: '#4caf50',        // EXACT: --success
        warning: '#ff9800',        // EXACT: --warning (rating stars)
        danger: '#f44336',         // EXACT: --error (renamed for consistency)
        info: '#2196f3',           // EXACT: --info

        // Wedding Theme (keep for backward compatibility)
        blush: {
          DEFAULT: '#F7CAC9',
          light: '#FCE4E3',
        },
        sage: '#9DC183',
        ivory: '#FFF8F0',
        charcoal: '#2C2C2C',
      },

      // Spacing System (8px grid)
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
      },

      // Border Radius
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '6px',
        'md': '6px',
        'lg': '8px',
      },

      // Box Shadow
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      },

      // Font Sizes
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '30px',
      },

      // Layout
      width: {
        'sidebar': '240px',
      },
    },
  },
  plugins: [],
}