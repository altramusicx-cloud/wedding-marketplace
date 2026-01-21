// File: lib/utils/touch-target.ts

/**
 * Touch Target Guidelines (WCAG 2.5.5)
 * - Minimum: 44x44px (iOS & Android standard)
 * - Optimal: 48x48px
 * - Spacing: 8px minimum between targets
 */

export const TOUCH_TARGET = {
    // Minimum sizes
    MIN_SIZE: 44, // 44px minimum (iOS guideline)
    OPTIMAL_SIZE: 48, // 48px optimal

    // Spacing
    MIN_SPACING: 8, // 8px minimum between targets
    COMFORTABLE_SPACING: 12, // 12px comfortable spacing

    // Tailwind classes for common touch targets
    CLASSES: {
        // Buttons
        button: 'min-h-[44px] min-w-[44px]',
        buttonLarge: 'min-h-[48px] min-w-[48px]',

        // Icons in buttons
        iconButton: 'h-11 w-11', // 44px
        iconButtonLarge: 'h-12 w-12', // 48px

        // Tap area (invisible padding)
        tapArea: 'p-3', // 12px padding = 44px total with 20px icon

        // Links/Cards
        card: 'min-h-[44px]',
        link: 'min-h-[44px] inline-flex items-center',

        // Spacing between touch targets
        spacing: 'gap-3', // 12px gap
    }
} as const

// Helper function untuk check apakah element punya touch target yang cukup
export function isTouchTargetValid(width: number, height: number): boolean {
    return width >= TOUCH_TARGET.MIN_SIZE && height >= TOUCH_TARGET.MIN_SIZE
}

// Helper untuk generate touch-friendly padding
export function getTouchPadding(iconSize: number): string {
    const neededPadding = Math.max(0, (TOUCH_TARGET.MIN_SIZE - iconSize) / 2)
    const paddingRem = neededPadding / 4 // Convert to rem (Tailwind scale)

    if (paddingRem <= 0.5) return 'p-2' // 8px
    if (paddingRem <= 0.75) return 'p-3' // 12px
    if (paddingRem <= 1) return 'p-4' // 16px
    return 'p-5' // 20px
}