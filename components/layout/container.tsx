// File: components/layout/container.tsx
import { cn } from "@/lib/utils"

interface ContainerProps {
    children: React.ReactNode
    className?: string
    size?: "sm" | "md" | "lg" | "xl" | "full"
    as?: "div" | "section" | "article" | "main"
}

export function Container({
    children,
    className,
    size = "lg",
    as: Component = "div",
}: ContainerProps) {
    const sizeClasses = {
        sm: "max-w-3xl",
        md: "max-w-4xl",
        lg: "max-w-6xl",
        xl: "max-w-7xl",
        full: "max-w-full",
    }

    return (
        <Component
            className={cn(
                "mx-auto w-full px-4 sm:px-6 lg:px-8",
                sizeClasses[size],
                className
            )}
        >
            {children}
        </Component>
    )
}

// Variant khusus untuk halaman
export function PageContainer({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <Container size="xl" className={cn("py-6 md:py-8", className)}>
            {children}
        </Container>
    )
}

// Variant untuk section dengan background
export function SectionContainer({
    children,
    className,
    background = "white"
}: {
    children: React.ReactNode;
    className?: string;
    background?: "white" | "gray" | "blush" | "ivory";
}) {
    const backgroundClasses = {
        white: "bg-white",
        gray: "bg-gray-50",
        blush: "bg-blush/10",
        ivory: "bg-ivory",
    }

    return (
        <section className={cn(backgroundClasses[background], className)}>
            <Container>{children}</Container>
        </section>
    )
}