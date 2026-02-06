// File: lib/constants/design-tokens.ts
// Shopee Style Design System - Tailwind v3 COMPATIBLE
// Created: $(Get-Date -Format 'yyyy-MM-dd HH:mm')

// ====== TAILWIND V3 COMPATIBLE TOKENS ======
// (Semua siap untuk di-import ke tailwind.config.js)

export const colors = {
    // PRIMARY - Shopee Red dengan shades (v3 format)
    primary: {
        50: '#ffe6e9',
        100: '#ffb8c0',
        200: '#ff8a97',
        300: '#ff5c6e',
        400: '#e82e45',
        500: '#d0011b',  // DEFAULT - Shopee Mall Red
        600: '#b00116',  // Hover state
        700: '#900112',
        800: '#70010e',
        900: '#50000a',
    },

    // NEUTRAL - Gray scale (v3 format)
    neutral: {
        50: '#fafafa',   // Card background
        100: '#f5f5f5',  // Background
        200: '#e0e0e0',  // Light borders
        300: '#bdbdbd',  // Borders
        400: '#9e9e9e',
        500: '#757575',  // Tertiary text
        600: '#616161',
        700: '#424242',  // Secondary text
        800: '#303030',
        900: '#212121',  // Primary text
    },

    // WHITE & BLACK
    white: '#ffffff',
    black: '#000000',

    // SEMANTIC COLORS (v3 format)
    success: {
        50: '#f0f9f0',
        500: '#4caf50',
        600: '#3d8b40',
    },
    warning: {
        50: '#fff8e1',
        500: '#ff9800',
        600: '#cc7a00',
    },
    error: {
        50: '#fdeaea',
        500: '#f44336',
        600: '#d32f2f',
    },
    info: {
        50: '#e8f4fd',
        500: '#2196f3',
        600: '#0b79d0',
    },
} as const

// TYPOGRAPHY - Simple format untuk v3
export const typography = {
    fontFamily: {
        sans: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif'
        ].join(', '),
        mono: [
            'ui-monospace',
            'SFMono-Regular',
            'Menlo',
            'Monaco',
            'Consolas',
            '"Liberation Mono"',
            '"Courier New"',
            'monospace'
        ].join(', '),
    },

    // Font sizes dalam rem (compatible dengan v3 text-sm, text-base, dll)
    fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],     // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
        '5xl': ['3rem', { lineHeight: '1' }],           // 48px
    },

    fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },

    // Line height utilities
    lineHeight: {
        'none': '1',
        'tight': '1.25',
        'snug': '1.375',
        'normal': '1.5',
        'relaxed': '1.625',
        'loose': '2',
    },

    // Letter spacing
    letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
    },
} as const

// SPACING - 4px base (0.25rem) - Tailwind default
export const spacing = {
    '0': '0',
    '0.5': '0.125rem', // 2px
    '1': '0.25rem',    // 4px
    '1.5': '0.375rem', // 6px
    '2': '0.5rem',     // 8px
    '2.5': '0.625rem', // 10px
    '3': '0.75rem',    // 12px
    '3.5': '0.875rem', // 14px
    '4': '1rem',       // 16px
    '5': '1.25rem',    // 20px
    '6': '1.5rem',     // 24px
    '7': '1.75rem',    // 28px
    '8': '2rem',       // 32px
    '9': '2.25rem',    // 36px
    '10': '2.5rem',    // 40px
    '11': '2.75rem',   // 44px
    '12': '3rem',      // 48px
    '14': '3.5rem',    // 56px
    '16': '4rem',      // 64px
    '20': '5rem',      // 80px
    '24': '6rem',      // 96px
    '28': '7rem',      // 112px
    '32': '8rem',      // 128px
    '36': '9rem',      // 144px
    '40': '10rem',     // 160px
    '44': '11rem',     // 176px
    '48': '12rem',     // 192px
    '52': '13rem',     // 208px
    '56': '14rem',     // 224px
    '60': '15rem',     // 240px
    '64': '16rem',     // 256px
    '72': '18rem',     // 288px
    '80': '20rem',     // 320px
    '96': '24rem',     // 384px
} as const

// BORDER RADIUS - Tailwind v3 format
export const borderRadius = {
    'sm': '0.125rem',   // 2px
    'DEFAULT': '0.25rem', // 4px
    'md': '0.375rem',   // 6px
    'lg': '0.5rem',     // 8px
    'xl': '0.75rem',    // 12px
    '2xl': '1rem',      // 16px
    '3xl': '1.5rem',    // 24px
    'full': '9999px',
} as const

// BOX SHADOW - Tailwind v3 format
export const boxShadow = {
    'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    // Custom Shopee card shadow
    'card': '0 1px 4px 0 rgba(0, 0, 0, 0.08), 0 1px 6px 0 rgba(0, 0, 0, 0.04)',
    // Hover effect untuk card
    'card-hover': '0 4px 12px 0 rgba(0, 0, 0, 0.12), 0 2px 8px 0 rgba(0, 0, 0, 0.08)',
} as const

// OPACITY - Tailwind v3 format
export const opacity = {
    '0': '0',
    '5': '0.05',
    '10': '0.1',
    '20': '0.2',
    '25': '0.25',
    '30': '0.3',
    '40': '0.4',
    '50': '0.5',
    '60': '0.6',
    '70': '0.7',
    '75': '0.75',
    '80': '0.8',
    '90': '0.9',
    '95': '0.95',
    '100': '1',
} as const

// ====== DESIGN SYSTEM EXPORT ======
export const designTokens = {
    colors,
    typography,
    spacing,
    borderRadius,
    boxShadow,
    opacity,
} as const

// ====== UTILITY FUNCTIONS ======
/**
 * Generate CSS custom properties from tokens
 */
export function generateCSSVariables(): Record<string, string> {
    const vars: Record<string, string> = {}

    // Colors
    Object.entries(colors).forEach(([category, shades]) => {
        if (typeof shades === 'object' && category !== 'white' && category !== 'black') {
            Object.entries(shades).forEach(([shade, value]) => {
                vars[`--color-${category}-${shade}`] = value
            })
        } else if (typeof shades === 'string') {
            vars[`--color-${category}`] = shades
        }
    })

    // Spacing
    Object.entries(spacing).forEach(([key, value]) => {
        vars[`--spacing-${key}`] = value
    })

    // Border radius
    Object.entries(borderRadius).forEach(([key, value]) => {
        if (key !== 'DEFAULT') {
            vars[`--radius-${key}`] = value
        } else {
            vars['--radius-default'] = value
        }
    })

    return vars
}

/**
 * Utility untuk menggabungkan class names (like clsx)
 */
export const cn = (...classes: (string | boolean | undefined | null)[]) => {
    return classes.filter(Boolean).join(' ')
}

// ====== TYPE EXPORTS ======
export type ColorPalette = typeof colors
export type TypographyTokens = typeof typography
export type SpacingScale = typeof spacing
export type BorderRadiusTokens = typeof borderRadius
export type BoxShadowTokens = typeof boxShadow
export type DesignTokens = typeof designTokens