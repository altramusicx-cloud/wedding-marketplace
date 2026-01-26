// File: lib/constants/design-tokens.ts

// Wedding Theme Colors (sesuai globals.css)
export const colors = {
    // Primary Colors
    blush: {
        DEFAULT: '#F7CAC9',
        light: '#FCE4E3',
        dark: '#E8B6B6',
    },
    sage: {
        DEFAULT: '#9DC183',
        light: '#C5E0B4',
        dark: '#7DA466',
    },
    ivory: '#FFF8F0',
    charcoal: '#2C2C2C',

    // Accent Colors
    dustyRose: '#D4A5A5',
    sageLight: '#C5E0B4',
    blushLight: '#FCE4E3',

    // Functional Colors
    success: '#88B04B',
    warning: '#FFB347',
    error: '#FF6B6B',
    info: '#6C63FF',

    // WhatsApp Colors
    whatsapp: '#25D366',
    whatsappDark: '#128C7E',

    // Neutrals (Gray Scale)
    gray: {
        50: '#FAFAFA',
        100: '#F5F5F5',
        200: '#E5E5E5',
        300: '#D4D4D4',
        400: '#A3A3A3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
    }
} as const

// Typography
export const typography = {
    fontFamilies: {
        heading: "var(--font-serif)",
        body: "var(--font-sans)",
      },,
    fontSizes: {
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        base: '1rem',     // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem',  // 36px
        '5xl': '3rem',     // 48px
    },
    fontWeights: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
    lineHeights: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
    },
} as const

// Spacing (8px grid system)
export const spacing = {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
} as const

// Border Radius
export const borderRadius = {
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
} as const

// Shadows
export const shadows = {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
} as const

// Transitions
export const transitions = {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const

// Breakpoints
export const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
} as const

// Wedding Marketplace Specific Tokens
export const weddingTokens = {
    // Product categories dengan warna
    categories: {
        venue: { color: colors.blush.DEFAULT, icon: 'ðŸ›ï¸' },
        photographer: { color: colors.sage.DEFAULT, icon: 'ðŸ“¸' },
        catering: { color: colors.dustyRose, icon: 'ðŸ½ï¸' },
        decoration: { color: colors.info, icon: 'ðŸŽ¨' },
        dress: { color: colors.blush.light, icon: 'ðŸ‘°' },
        makeup: { color: colors.warning, icon: 'ðŸ’„' },
    },

    // Price units display
    priceUnits: {
        paket: '/paket',
        'per jam': '/jam',
        'per orang': '/orang',
        'per hari': '/hari',
        'per acara': '/acara',
    },

    // Status colors
    statusColors: {
        pending: colors.warning,
        approved: colors.success,
        rejected: colors.error,
        draft: colors.gray[400],
    },
} as const

// Export semua tokens
export const designTokens = {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    transitions,
    breakpoints,
    wedding: weddingTokens,
} as const

// Type exports
export type ColorPalette = typeof colors
export type TypographyTokens = typeof typography
export type SpacingTokens = typeof spacing
