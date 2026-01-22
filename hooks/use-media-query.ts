// File: hooks/use-media-query.ts
'use client'

import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        if (typeof window === 'undefined') return

        const media = window.matchMedia(query)

        // Initial check
        if (media.matches !== matches) {
            // Use requestAnimationFrame to avoid synchronous state update
            requestAnimationFrame(() => {
                setMatches(media.matches)
            })
        }

        const handler = (event: MediaQueryListEvent) => {
            setMatches(event.matches)
        }

        // Modern browsers
        if (media.addEventListener) {
            media.addEventListener('change', handler)
            return () => media.removeEventListener('change', handler)
        }
        // Legacy browsers
        else {
            media.addListener(handler)
            return () => media.removeListener(handler)
        }
    }, [query])

    return matches
}