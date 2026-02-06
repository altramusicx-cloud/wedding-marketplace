/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ROADMAP DAY 1.3: Update colors ONLY
      colors: {
        // PRIMARY COLORS - Shopee Mall Red
        primary: {
          DEFAULT: "#d0011b",  // EXACT Shopee Red
          dark: "#b00116",     // Hover state
          light: "#ffe6e9",    // Light background
        },
        
        // NEUTRAL PALETTE
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e0e0e0",
          300: "#bdbdbd",
          400: "#9e9e9e",
          500: "#757575",
          600: "#616161",
          700: "#424242",
          800: "#303030",
          900: "#212121",
        },
        
        // Functional colors
        success: "#4caf50",
        warning: "#ff9800",
        error: "#f44336",
        info: "#2196f3",
      },
      
      // Font family
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif"
        ],
      },
    },
  },
  plugins: [],
}
