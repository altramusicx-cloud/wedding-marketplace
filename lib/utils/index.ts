// File: lib/utils/index.ts
export { cn } from './cn'
export { formatCurrency } from './format-currency'
export { formatDate, formatDateTime } from './format-date'
// ... lainnya
// From lib/utils.ts
// lib\utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

