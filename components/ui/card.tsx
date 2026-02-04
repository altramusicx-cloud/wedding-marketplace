import * as React from "react"
import { cn } from "@/lib/utils"

type DivProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLDivElement>
>

export const Card = React.forwardRef<HTMLDivElement, DivProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
Card.displayName = "Card"

export function CardHeader({ className, children, ...props }: DivProps) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

type HeadingProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLHeadingElement>
>

export function CardTitle({ className, children, ...props }: HeadingProps) {
  return (
    <h3  // ❗️ GANTI dari <div> jadi <h3>
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    >
      {children}
    </h3>
  )
}

type ParagraphProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLParagraphElement>
>

export function CardDescription({ className, children, ...props }: ParagraphProps) {
  return (
    <p  // ❗️ GANTI dari <div> jadi <p>
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    >
      {children}
    </p>
  )
}

export function CardAction({ className, children, ...props }: DivProps) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardContent({ className, children, ...props }: DivProps) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }: DivProps) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    >
      {children}
    </div>
  )
}












