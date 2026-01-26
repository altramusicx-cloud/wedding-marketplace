// components/shared/logout-button.tsx - Safe logout button
"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface LogoutButtonProps {
  className?: string
  variant?: 'default' | 'destructive' | 'outline'
}

export function LogoutButton({ className = '', variant = 'default' }: LogoutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      
      // Call logout API
      const response = await fetch('/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (response.ok) {
        // Force refresh and redirect
        window.location.href = '/login'
      } else {
        console.error('Logout failed')
        router.refresh()
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const variantClasses = {
    default: 'text-gray-700 hover:bg-gray-100',
    destructive: 'text-red-600 hover:bg-red-50',
    outline: 'border border-gray-300 hover:bg-gray-50'
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${variantClasses[variant]} ${className} ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  )
}
