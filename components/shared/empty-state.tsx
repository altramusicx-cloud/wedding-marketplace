// components/shared/empty-state.tsx
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Package,
    Search,
    Users,
    Image,
    MessageSquare,
    ShoppingBag,
    Home,
    PlusCircle,
    RefreshCw
} from "lucide-react"

interface EmptyStateProps {
    title?: string
    description?: string
    icon?: React.ReactNode
    action?: {
        label: string
        onClick: () => void
        variant?: "default" | "outline" | "ghost"
    }
    secondaryAction?: {
        label: string
        onClick: () => void
        variant?: "default" | "outline" | "ghost"
    }
    className?: string
    variant?: "default" | "search" | "products" | "users" | "messages" | "home"
}

const variantConfig = {
    default: {
        icon: <Package className="h-12 w-12 text-gray-400" />,
        title: "No data available",
        description: "There's nothing to display here yet."
    },
    search: {
        icon: <Search className="h-12 w-12 text-gray-400" />,
        title: "No results found",
        description: "Try adjusting your search or filter to find what you're looking for."
    },
    products: {
        icon: <ShoppingBag className="h-12 w-12 text-gray-400" />,
        title: "No products yet",
        description: "Get started by adding your first product to the marketplace."
    },
    users: {
        icon: <Users className="h-12 w-12 text-gray-400" />,
        title: "No users found",
        description: "There are no users to display at the moment."
    },
    messages: {
        icon: <MessageSquare className="h-12 w-12 text-gray-400" />,
        title: "No messages yet",
        description: "Your conversations will appear here."
    },
    home: {
        icon: <Home className="h-12 w-12 text-gray-400" />,
        title: "Welcome to the marketplace",
        description: "Start by browsing products or creating your own listing."
    }
}

export function EmptyState({
    title,
    description,
    icon,
    action,
    secondaryAction,
    className,
    variant = "default"
}: EmptyStateProps) {
    const config = variantConfig[variant]

    return (
        <div className={cn(
            "flex flex-col items-center justify-center py-12 px-4 text-center",
            className
        )}>
            <div className="mb-4">
                {icon || config.icon}
            </div>

            <h3 className="text-lg font-semibold text-charcoal mb-2">
                {title || config.title}
            </h3>

            <p className="text-gray-600 max-w-md mb-6">
                {description || config.description}
            </p>

            {(action || secondaryAction) && (
                <div className="flex gap-3">
                    {action && (
                        <Button
                            onClick={action.onClick}
                            variant={action.variant || "default"}
                            className={action.variant === "default" ? "bg-blush hover:bg-blush/90" : ""}
                        >
                            {action.label === "Add New" && <PlusCircle className="mr-2 h-4 w-4" />}
                            {action.label === "Refresh" && <RefreshCw className="mr-2 h-4 w-4" />}
                            {action.label}
                        </Button>
                    )}

                    {secondaryAction && (
                        <Button
                            onClick={secondaryAction.onClick}
                            variant={secondaryAction.variant || "outline"}
                        >
                            {secondaryAction.label}
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}

// Pre-configured empty states for common use cases
export function EmptyProductsState({
    onCreateClick,
    className
}: {
    onCreateClick: () => void
    className?: string
}) {
    return (
        <EmptyState
            variant="products"
            action={{
                label: "Add New Product",
                onClick: onCreateClick,
                variant: "default"
            }}
            className={className}
        />
    )
}

export function EmptySearchState({
    onClearFilters,
    className
}: {
    onClearFilters: () => void
    className?: string
}) {
    return (
        <EmptyState
            variant="search"
            action={{
                label: "Clear Filters",
                onClick: onClearFilters,
                variant: "outline"
            }}
            className={className}
        />
    )
}

export function EmptyMessagesState({
    className
}: {
    className?: string
}) {
    return (
        <EmptyState
            variant="messages"
            className={className}
        />
    )
}