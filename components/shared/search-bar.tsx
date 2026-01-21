// File: components/shared/search-bar.tsx (DESKTOP VERSION)
'use client'

import { Search, Filter, X, Clock, TrendingUp, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useSearch } from '@/hooks/use-search'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export function SearchBar() {
    const router = useRouter()
    const containerRef = useRef<HTMLDivElement>(null)

    const {
        query,
        results,
        isLoading,
        recentSearches,
        isDropdownOpen,
        setQuery,
        clearSearch,
        openDropdown,
        closeDropdown,
        addRecentSearch,
        clearRecentSearches,
        navigateToSearchPage
    } = useSearch({
        maxResults: 5,
        enableRecentSearches: true
    })

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                closeDropdown()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [closeDropdown])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            addRecentSearch(query)
            router.push(`/categories?search=${encodeURIComponent(query.trim())}`)
            closeDropdown()
        }
    }

    const handleQuickSearch = (searchTerm: string) => {
        setQuery(searchTerm)
        addRecentSearch(searchTerm)
        router.push(`/categories?search=${encodeURIComponent(searchTerm)}&category=${searchTerm.toLowerCase()}`)
        closeDropdown()
    }

    const popularSearches = [
        { term: 'Venue Samarinda', category: 'venue', count: 24 },
        { term: 'Photographer', category: 'photographer', count: 18 },
        { term: 'Catering Murah', category: 'catering', count: 32 },
        { term: 'Wedding Dress', category: 'dress', count: 15 },
    ]

    return (
        <div className="w-full relative" ref={containerRef}>
            <form onSubmit={handleSubmit} className="w-full">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="search"
                            placeholder="Cari venue, photographer, catering, makeup artist..."
                            className="pl-10 pr-10 py-6 text-base"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value)
                                if (e.target.value.trim().length >= 2) {
                                    openDropdown()
                                }
                            }}
                            onFocus={() => {
                                if (query.trim().length >= 2 || recentSearches.length > 0) {
                                    openDropdown()
                                }
                            }}
                        />

                        {/* Clear button */}
                        {query && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            className="gap-2"
                            onClick={() => router.push('/categories')}
                        >
                            <Filter className="h-4 w-4" />
                            Filter
                        </Button>

                        <Button
                            type="submit"
                            size="lg"
                            className="bg-blush hover:bg-blush-dark text-white gap-2"
                        >
                            <Search className="h-4 w-4" />
                            Cari
                        </Button>
                    </div>
                </div>

                {/* Live Search Dropdown */}
                {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-[480px] overflow-hidden">
                        <div className="divide-y divide-gray-100">
                            {/* Recent Searches */}
                            {recentSearches.length > 0 && results.length === 0 && !isLoading && (
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <Clock className="h-4 w-4" />
                                            Pencarian Terbaru
                                        </div>
                                        <button
                                            onClick={clearRecentSearches}
                                            className="text-xs text-gray-500 hover:text-gray-700"
                                        >
                                            Hapus semua
                                        </button>
                                    </div>
                                    <div className="space-y-1">
                                        {recentSearches.map((searchTerm, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setQuery(searchTerm)
                                                    navigateToSearchPage()
                                                }}
                                                className="w-full text-left p-2 rounded-lg hover:bg-gray-50 flex items-center justify-between group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Clock className="h-4 w-4 text-gray-400" />
                                                    <span className="text-gray-700">{searchTerm}</span>
                                                </div>
                                                <Search className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Search Results */}
                            {results.length > 0 && (
                                <div className="p-4">
                                    <div className="mb-3 text-sm font-medium text-gray-700">
                                        Hasil Pencarian
                                    </div>
                                    <div className="space-y-2">
                                        {results.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={`/vendor/${product.id}`}
                                                onClick={closeDropdown}
                                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 group"
                                            >
                                                {product.thumbnail_url ? (
                                                    <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
                                                        <Image
                                                            src={product.thumbnail_url || '/placeholder-image.jpg'}
                                                            alt={product.name}
                                                            width={48}
                                                            height={48}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                                        <Search className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-gray-900 truncate">
                                                        {product.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 flex items-center gap-2">
                                                        <span className="capitalize">{product.category}</span>
                                                        <span>•</span>
                                                        <span>{product.location}</span>
                                                    </div>
                                                </div>
                                                {product.price_from && (
                                                    <div className="text-sm font-semibold text-blush">
                                                        Rp {product.price_from.toLocaleString('id-ID')}
                                                    </div>
                                                )}
                                            </Link>
                                        ))}
                                    </div>
                                    {query.trim() && (
                                        <button
                                            onClick={navigateToSearchPage}
                                            className="w-full mt-3 p-2 text-center text-blush hover:bg-blush-light rounded-lg font-medium"
                                        >
                                            Lihat semua hasil untuk "{query}"
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Loading State */}
                            {isLoading && (
                                <div className="p-8 flex items-center justify-center">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Mencari...
                                    </div>
                                </div>
                            )}

                            {/* Empty Results */}
                            {!isLoading && results.length === 0 && query.trim().length >= 2 && (
                                <div className="p-8 text-center">
                                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                    <div className="text-gray-700 font-medium mb-1">
                                        Tidak ditemukan
                                    </div>
                                    <p className="text-gray-500 text-sm">
                                        Coba dengan kata kunci lain
                                    </p>
                                </div>
                            )}

                            {/* Popular Searches */}
                            <div className="p-4 bg-gray-50">
                                <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700">
                                    <TrendingUp className="h-4 w-4" />
                                    Pencarian Populer
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {popularSearches.map((item) => (
                                        <button
                                            key={item.term}
                                            type="button"
                                            onClick={() => handleQuickSearch(item.term)}
                                            className={cn(
                                                "text-xs px-3 py-1.5 rounded-full transition-colors",
                                                "bg-white border border-gray-200 hover:border-blush hover:text-blush",
                                                "flex items-center gap-1"
                                            )}
                                        >
                                            {item.term}
                                            <span className="text-xs text-gray-400">
                                                ({item.count})
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </form>

            {/* Quick Search Chips (always visible) */}
            <div className="flex flex-wrap gap-2 mt-3">
                {popularSearches.map((item) => (
                    <button
                        key={item.term}
                        type="button"
                        onClick={() => handleQuickSearch(item.term)}
                        className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        {item.term}
                    </button>
                ))}
            </div>
        </div>
    )
}