import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  icon: ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  className?: string
}

export default function StatsCard({
  title,
  value,
  change,
  icon,
  variant = 'default',
  className
}: StatsCardProps) {
  const variantStyles = {
    default: 'border-gray-200',
    primary: 'border-primary/20 bg-primary/5',
    success: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    danger: 'border-red-200 bg-red-50'
  }

  const iconStyles = {
    default: 'bg-gray-100 text-gray-600',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
    danger: 'bg-red-100 text-red-600'
  }

  const changeStyles = {
    default: 'text-gray-600',
    primary: 'text-primary',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600'
  }

  return (
    <div className={cn(
      "border rounded-lg p-4 transition-all hover:shadow-sm",
      variantStyles[variant],
      className
    )}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={cn("text-xs font-medium mt-1", changeStyles[variant])}>
              {change}
            </p>
          )}
        </div>
        <div className={cn("p-2 rounded-lg", iconStyles[variant])}>
          {icon}
        </div>
      </div>
    </div>
  )
}
