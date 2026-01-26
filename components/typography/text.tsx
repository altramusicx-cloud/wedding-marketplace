// components/typography/text.tsx
import { cn } from '@/lib/utils/cn'

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'body-large' | 'body' | 'body-small' | 'caption' | 'label'
  children: React.ReactNode
}

export function Text({
  variant = 'body',
  className,
  children,
  ...props
}: TextProps) {
  const variantClasses = {
    'body-large': 'text-body-large',
    'body': 'text-body',
    'body-small': 'text-body-small',
    'caption': 'text-caption',
    'label': 'text-shopee-label',
  }
  
  return (
    <p
      className={cn(variantClasses[variant], className)}
      {...props}
    >
      {children}
    </p>
  )
}
