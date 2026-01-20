// File: hooks/use-search.ts
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useDebounce } from '@/hooks/use-debounce'
import { useRouter } from 'next/navigation'
import { buildSafeIlikeQuery } from '@/lib/utils/safe-search' // NEW IMPORT

interface SearchResult {
    id: string
    name: string
    slug: string
    category: string
    location: string
    thumbnail_url?: string
    price_from?: number
    price_to?: number
}

interface UseSearchProps {
    maxResults?: number
    enableRecentSearches?: boolean
}

interface UseSearchReturn {
    // State
    query: string
    results: SearchResult[]
    isLoading: boolean
    error: string | null
    recentSearches: string[]
    isDropdownOpen: boolean

    // Actions
    setQuery: (query: string) => void
    search: (searchQuery: string) => Promise<void>
    clearSearch: () => void
    openDropdown: () => void
    closeDropdown: () => void
    addRecentSearch: (query: string) => void
    clearRecentSearches: () => void
    navigateToSearchPage: () => void
}

const STORAGE_KEY = 'wedding-marketplace-recent-searches'

export function useSearch({
    maxResults = 5,
    enableRecentSearches = true
}: UseSearchProps = {}): UseSearchReturn {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [recentSearches, setRecentSearches] = useState<string[]>([])
    const [isClient, setIsClient] = useState(false)

    const debouncedQuery = useDebounce(query, 300)
    const supabase = createClient()
    const router = useRouter()
    const initialLoadRef = useRef(false)

    // Set isClient to true on mount
    useEffect(() => {
        setIsClient(true)
    }, [])

    // Load recent searches from localStorage
    useEffect(() => {
        if (!enableRecentSearches || !isClient) return

        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            if (saved) {
                const parsed = JSON.parse(saved)
                if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
                    setRecentSearches(parsed.slice(0, 5)) // Max 5 items
                }
            }
        } catch (err) {
            console.error('Error loading recent searches:', err)
            // Clear corrupted data
            localStorage.removeItem(STORAGE_KEY)
        }
    }, [enableRecentSearches, isClient])

    // Save recent searches to localStorage
    useEffect(() => {
        if (!enableRecentSearches || !isClient || recentSearches.length === 0) return

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSearches))
        } catch (err) {
            console.error('Error saving recent searches:', err)
        }
    }, [recentSearches, enableRecentSearches, isClient])

    // Perform search when debounced query changes
    useEffect(() => {
        if (debouncedQuery.trim().length >= 2) {
            performSearch(debouncedQuery)
            if (!initialLoadRef.current) {
                initialLoadRef.current = true
            }
        } else {
            setResults([])
            setIsLoading(false)
        }
    }, [debouncedQuery])

    const performSearch = useCallback(async (searchQuery: string) => {
        if (searchQuery.trim().length < 2) {
            setResults([])
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            // SAFE SEARCH QUERY - FIXED SQL INJECTION VULNERABILITY
            const safeQuery = buildSafeIlikeQuery(searchQuery, [
                'name',
                'description',
                'category',
                'location'
            ])

            const { data, error: searchError } = await supabase
                .from('products')
                .select(`
          id,
          name,
          slug,
          category,
          location,
          thumbnail_url,
          price_from,
          price_to
        `)
                .eq('status', 'approved')
                .eq('is_active', true)
                .or(safeQuery) // USING SAFE QUERY
                .order('created_at', { ascending: false })
                .limit(maxResults)

            if (searchError) throw searchError

            setResults(data || [])
        } catch (err) {
            console.error('Search error:', err)
            setError('Gagal melakukan pencarian. Silakan coba lagi.')
            setResults([])
        } finally {
            setIsLoading(false)
        }
    }, [supabase, maxResults])

    const addRecentSearch = useCallback((searchQuery: string) => {
        if (!searchQuery.trim() || !enableRecentSearches || !isClient) return

        const trimmedQuery = searchQuery.trim()

        setRecentSearches(prev => {
            // Remove duplicate (case insensitive) and keep only last 5 searches
            const filtered = prev.filter(q =>
                q.toLowerCase() !== trimmedQuery.toLowerCase()
            )
            return [trimmedQuery, ...filtered].slice(0, 5)
        })
    }, [enableRecentSearches, isClient])

    const clearRecentSearches = useCallback(() => {
        setRecentSearches([])
        if (isClient) {
            localStorage.removeItem(STORAGE_KEY)
        }
    }, [isClient])

    const navigateToSearchPage = useCallback(() => {
        if (query.trim()) {
            addRecentSearch(query)
            router.push(`/categories?search=${encodeURIComponent(query.trim())}`)
            setIsDropdownOpen(false)
            setQuery('') // Clear search after navigation
        }
    }, [query, router, addRecentSearch])

    const clearSearch = useCallback(() => {
        setQuery('')
        setResults([])
        setIsDropdownOpen(false)
    }, [])

    return {
        // State
        query,
        results,
        isLoading,
        error,
        recentSearches: isClient ? recentSearches : [], // Return empty array during SSR
        isDropdownOpen,

        // Actions
        setQuery,
        search: performSearch,
        clearSearch,
        openDropdown: () => setIsDropdownOpen(true),
        closeDropdown: () => setIsDropdownOpen(false),
        addRecentSearch,
        clearRecentSearches,
        navigateToSearchPage
    }
}