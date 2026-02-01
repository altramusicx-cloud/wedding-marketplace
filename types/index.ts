// types/index.ts - Centralized type exports
// Export semua types
export * from './product'
export * from './user'
export * from './vendor'
export * from './api'

// Strict type utilities
export type Strict<T> = {
  [P in keyof T]-?: T[P] extends object ? Strict<T[P]> : T[P]
}

export type WithId<T> = T & { id: string }
export type Nullable<T> = T | null
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
