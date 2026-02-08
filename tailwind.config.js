// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#d0011b",
          dark: "#b00116",
          light: "#ffe6e9",
        },
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
        success: "#4caf50",
        warning: "#ff9800",
        error: "#f44336",
        info: "#2196f3",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", '"Helvetica Neue"', "Arial", "sans-serif"],
      },
      fontSize: {
        "micro": ["0.625rem", { lineHeight: "1rem" }],
        "caption": ["0.6875rem", { lineHeight: "1rem" }],
        "small": ["0.75rem", { lineHeight: "1rem" }],
        "base": ["0.875rem", { lineHeight: "1.25rem" }],
        "large": ["1rem", { lineHeight: "1.5rem" }],
        "xl": ["1.125rem", { lineHeight: "1.5rem" }],
        "2xl": ["1.25rem", { lineHeight: "1.75rem" }],
        "3xl": ["1.5rem", { lineHeight: "2rem" }],
      },
      spacing: {
        "0": "0",
        "1": "0.25rem",
        "2": "0.5rem",
        "3": "0.75rem",
        "4": "1rem",
        "5": "1.25rem",
        "6": "1.5rem",
        "8": "2rem",
        "10": "2.5rem",
        "12": "3rem",
        "16": "4rem",
      },
      borderRadius: {
        "sm": "0.125rem",
        "DEFAULT": "0.25rem",
        "md": "0.375rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px",
      },
      boxShadow: {
        "card": "0 1px 4px 0 rgba(0, 0, 0, 0.08), 0 1px 6px 0 rgba(0, 0, 0, 0.04)",
        "card-hover": "0 4px 12px 0 rgba(0, 0, 0, 0.12), 0 2px 8px 0 rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
}
