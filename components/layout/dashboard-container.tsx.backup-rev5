// File: components/layout/dashboard-container.tsx
import { cn } from "@/lib/utils"
import { TOUCH_TARGET } from "@/lib/utils/touch-target"

interface DashboardContainerProps {
    children: React.ReactNode
    className?: string
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'  // sesuai roadmap
    as?: 'div' | 'section' | 'main'
    showSafeArea?: boolean  // untuk mobile bottom nav
}

export function DashboardContainer({
    children,
    className,
    size = 'lg',
    as: Component = 'div',
    showSafeArea = true
}: DashboardContainerProps) {
    const sizeClasses = {
        sm: 'max-w-3xl',
        md: 'max-w-4xl',
        lg: 'max-w-6xl',
        xl: 'max-w-7xl',  // DEFAULT dari roadmap
        full: 'max-w-full',
    }

    return (
        <Component
            className={cn(
                "mx-auto w-full px-4 sm:px-6 lg:px-8",  // EXACT dari roadmap
                sizeClasses[size],
                showSafeArea && "pb-safe",  // Mobile safe area untuk bottom nav
                className
            )}
            // Apply touch target guidelines (optional)
            style={{ minHeight: 'calc(100vh - 64px)' }} // Adjust based on header height
        >
            {children}
        </Component>
    )
}

// Variant khusus untuk halaman dashboard
export function DashboardPageContainer({
    children,
    className
}: {
    children: React.ReactNode;
    className?: string
}) {
    return (
        <DashboardContainer size="xl" className={cn("py-6 md:py-8", className)}>
            {children}
        </DashboardContainer>
    )
}

// Variant untuk section dalam dashboard
export function DashboardSection({
    children,
    className,
    background = 'white'
}: {
    children: React.ReactNode;
    className?: string;
    background?: 'white' | 'gray' | 'primary';
}) {
    const backgroundClasses = {
        white: 'bg-white',
        gray: 'bg-neutral-50',
        primary: 'bg-primary/5',
    }

    return (
        <section className={cn(
            backgroundClasses[background],
            "rounded-lg border border-neutral-200",
            className
        )}>
            <DashboardContainer size="full" showSafeArea={false}>
                {children}
            </DashboardContainer>
        </section>
    )
}