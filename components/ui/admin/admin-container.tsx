// components/ui/admin/admin-container.tsx
import { ReactNode } from 'react'

interface AdminContainerProps {
  children: ReactNode
  className?: string
}

export function AdminContainer({ children, className = '' }: AdminContainerProps) {
  return (
    <div className={`bg-gray-50 min-h-screen ${className}`}>
      {children}
    </div>
  )
}
