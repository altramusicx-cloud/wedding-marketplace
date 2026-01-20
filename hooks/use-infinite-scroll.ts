// File: hooks/use-infinite-scroll.ts
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface UseInfiniteScrollProps {
    initialProducts: any[]
    category?: string | null
    searchTerm?: string | null
}

interface UseInfiniteScrollReturn {
    products: any[]
    isLoading: boolean
    isLoadingMore: boolean
    hasMore: boolean
    error: string | null
    loadMore: () => Promise<void>
    retry: () => void
    observerRef: (node: HTMLDivElement | null) => void
}

export function useInfiniteScroll({
    initialProducts,
    category = null,
    searchTerm = null
}: UseInfiniteScrollProps): UseInfiniteScrollReturn {
    const [products, setProducts] = useState<any[]>(initialProducts)
    const [page, setPage] = useState(1)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const observerRef = useRef<IntersectionObserver | null>(null)
    const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null)

    const supabase = createClient()

    // Reset products when initialProducts changes (category/search filter)
    useEffect(() => {
        setProducts(initialProducts)
        setPage(1)
        setHasMore(true)
        setError(null)
    }, [initialProducts, category, searchTerm])

    const fetchMoreProducts = useCallback(async () => {
        if (isLoadingMore || !hasMore) return

        setIsLoadingMore(true)
        setError(null)

        try {
            const nextPage = page + 1
            const limit = 12
            const offset = (nextPage - 1) * limit

            // Build query berdasarkan blueprint pattern dari page.tsx
            let query = supabase
                .from('products')
                .select(`
          id, 
          name, 
          slug, 
          description, 
          category, 
          location,
          price_from, 
          price_to, 
          price_unit, 
          thumbnail_url, 
          created_at,
          profiles:vendor_id (full_name, avatar_url)
        `)
                .eq('status', 'approved')
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1)

            // Apply filters jika ada
            if (category) {
                query = query.eq('category', category)
            }

            if (searchTerm) {
                query = query.or(
                    `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`
                )
            }

            const { data, error: fetchError } = await query

            if (fetchError) throw fetchError

            if (data && data.length > 0) {
                setProducts(prev => [...prev, ...data])
                setPage(nextPage)

                // Jika dapat kurang dari limit, berarti tidak ada data lagi
                if (data.length < limit) {
                    setHasMore(false)
                }
            } else {
                setHasMore(false)
            }
        } catch (err) {
            console.error('Error fetching more products:', err)
            setError('Gagal memuat produk tambahan. Silakan coba lagi.')
        } finally {
            setIsLoadingMore(false)
        }
    }, [page, isLoadingMore, hasMore, category, searchTerm, supabase])

    // Intersection Observer untuk auto-load
    const observerRefCallback = useCallback((node: HTMLDivElement | null) => {
        if (observerRef.current) {
            observerRef.current.disconnect()
        }

        if (!node || !hasMore || isLoadingMore) return

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
                    fetchMoreProducts()
                }
            },
            {
                rootMargin: '100px', // Load 100px sebelum mencapai bottom
                threshold: 0.1
            }
        )

        observerRef.current.observe(node)
        loadMoreTriggerRef.current = node
    }, [hasMore, isLoadingMore, fetchMoreProducts])

    // Cleanup observer
    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect()
            }
        }
    }, [])

    const retry = () => {
        setError(null)
        fetchMoreProducts()
    }

    return {
        products,
        isLoading: false, // initial load sudah dari server
        isLoadingMore,
        hasMore,
        error,
        loadMore: fetchMoreProducts,
        retry,
        observerRef: observerRefCallback
    }
}