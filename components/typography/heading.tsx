// components/typography/heading.tsx
import { cn } from '@/lib/utils/cn'

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  size?: 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  children: React.ReactNode
}

export function Heading({
  as: Component = 'h1',
  size,
  className,
  children,
  ...props
}: HeadingProps) {
  const sizeClass = size || Component
  
  const sizeClasses = {
    display: 'text-display',
    h1: 'text-3xl md:text-4xl font-bold',
    h2: 'text-2xl md:text-3xl font-bold', 
    h3: 'text-xl md:text-2xl font-semibold',
    h4: 'text-lg md:text-xl font-semibold',
    h5: 'text-base md:text-lg font-semibold',
    h6: 'text-sm md:text-base font-semibold',
  }
  
  return (
    <Component
      className={cn(
        'text-charcoal leading-tight',
        sizeClasses[sizeClass],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
