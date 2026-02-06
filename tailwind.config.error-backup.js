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
    fontSize: {
      "micro": ["0.625rem", { lineHeight: "1rem" }], // 10px - EXACT dari roadmap
      "xs": ["0.75rem", { lineHeight: "1rem" }],     // 12px
      "sm": ["0.875rem", { lineHeight: "1.25rem" }], // 14px
      "base": ["1rem", { lineHeight: "1.5rem" }],    // 16px
      "lg": ["1.125rem", { lineHeight: "1.75rem" }], // 18px
      "xl": ["1.25rem", { lineHeight: "1.75rem" }],  // 20px
      "2xl": ["1.5rem", { lineHeight: "2rem" }],     // 24px
      "3xl": ["1.875rem", { lineHeight: "2.25rem" }], // 30px
      "4xl": ["2.25rem", { lineHeight: "2.5rem" }],   // 36px
      "5xl": ["3rem", { lineHeight: "1" }],           // 48px
    },
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


