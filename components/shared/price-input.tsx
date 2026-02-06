// components\shared\price-input.tsx
"use client"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface PriceInputProps {
  value: number | null
  onChange: (value: number | null) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function PriceInput({
  value,
  onChange,
  placeholder = "0",
  className,
  disabled = false
}: PriceInputProps) {
  const [displayValue, setDisplayValue] = useState("")

  // Format number ke string dengan thousand separators
  const formatToDisplay = (num: number | null): string => {
    if (!num && num !== 0) return ''
    return num.toLocaleString('id-ID')
  }

  // Parse string ke number (hapus semua non-digit)
  const parseToNumber = (str: string): number | null => {
    const raw = str.replace(/[^\d]/g, '')
    return raw ? parseInt(raw, 10) : null
  }

  // Update display value ketika value prop berubah
  useEffect(() => {
    setDisplayValue(formatToDisplay(value))
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    // Allow only numbers and thousand separators formatting
    const newDisplay = inputValue.replace(/[^\d,.]/g, '')
    setDisplayValue(newDisplay)

    // Parse ke number untuk parent component
    const parsed = parseToNumber(newDisplay)
    onChange(parsed)
  }

  const handleBlur = () => {
    // Format dengan thousand separators saat blur
    const parsed = parseToNumber(displayValue)
    if (parsed !== null) {
      setDisplayValue(formatToDisplay(parsed))
    } else {
      setDisplayValue('')
    }
  }

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm font-medium">
        Rp
      </span>
      <Input
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={cn("pl-10 h-10", className)}
        type="text"
        inputMode="numeric"
        disabled={disabled}
      />
    </div>
  )
}
