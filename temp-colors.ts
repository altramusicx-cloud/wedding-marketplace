// === WEDDINGS.ID DESIGN TOKENS ===
// Updated: $(Get-Date -Format 'yyyy-MM-dd HH:mm')
// Based on reference HTML with Shopee Mall Red (#d0011b)

export const colors = {
    // PRIMARY COLORS (Shopee Mall Red from reference)
    primary: {
        DEFAULT: '#d0011b',      // EXACT: Shopee Mall Red
        dark: '#b00116',         // EXACT: Hover state  
        light: '#ffe6e9',        // EXACT: Light background
    },
    
    // GOLD ACCENT (for category badges from reference)
    gold: {
        DEFAULT: '#c5a368',      // EXACT: .card-category color
        dark: '#a88747',         // EXACT: Dark gold variant
    },
    
    // NEUTRAL PALETTE (EXACT from reference CSS variables)
    neutral: {
        900: '#212121',  // EXACT: --neutral-900 (Primary text)
        700: '#424242',  // EXACT: --neutral-700 (Secondary text)
        500: '#757575',  // EXACT: --neutral-500 (Tertiary text)
        300: '#bdbdbd',  // EXACT: --neutral-300 (Borders, dividers)
        200: '#e0e0e0',  // EXACT: --neutral-200 (Light borders)
        100: '#f5f5f5',  // EXACT: --neutral-100 (Background)
        50: '#fafafa',   // EXACT: --neutral-50 (Cards background)
        white: '#ffffff',
    },

    // Wedding theme colors (keep for backward compatibility)
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

    // Functional Colors (updated to match reference)
    success: '#4caf50',          // EXACT: --success (#4caf50)
    warning: '#ff9800',          // EXACT: --warning (rating stars)
    error: '#f44336',            // EXACT: --error
    info: '#2196f3',             // EXACT: --info

    // WhatsApp Colors (keep)
    whatsapp: '#25D366',
    whatsappDark: '#128C7E',

    // Gray Scale (deprecated, use neutral instead)
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
