// File: lib/utils/safe-search.ts
/**
 * Escape string untuk ILIKE query PostgreSQL
 * Mencegah SQL injection
 */
export function escapeLike(str: string): string {
    return str.replace(/[%_\\]/g, '\\$&')
}

/**
 * Build safe ILIKE query untuk Supabase
 */
export function buildSafeIlikeQuery(
    searchTerm: string,
    fields: string[]
): string {
    const safeTerm = escapeLike(searchTerm)
    return fields.map(field => `${field}.ilike.%${safeTerm}%`).join(',')
}