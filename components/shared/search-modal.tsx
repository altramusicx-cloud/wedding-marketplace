// File: components/shared/search-modal.tsx (MOBILE VERSION)
'use client'

import { Search, X, Clock, TrendingUp, Loader2, MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useSearch } from '@/hooks/use-search'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface SearchModalProps {
    isOpen: boolean
    onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const router = useRouter()

    const {
        query,
        results,
        isLoading,
        recentSearches,
        setQuery,
        clearSearch,
        addRecentSearch,
        clearRecentSearches,
        navigateToSearchPage
    } = useSearch({
        maxResults: 8, // Lebih banyak untuk mobile
        enableRecentSearches: true
    })

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden' // Prevent scrolling
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen) {
            const input = document.getElementById('mobile-search-input')
            setTimeout(() => input?.focus(), 100)
        }
    }, [isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            addRecentSearch(query)
            router.push(`/categories?search=${encodeURIComponent(query.trim())}`)
            onClose()
        }
    }

    const handleQuickSearch = (searchTerm: string) => {
        setQuery(searchTerm)
        addRecentSearch(searchTerm)
        router.push(`/categories?search=${encodeURIComponent(searchTerm)}&category=${searchTerm.toLowerCase()}`)
        onClose()
    }

    const popularSearches = [
        { term: 'Venue Samarinda', category: 'venue', icon: '🏛️' },
        { term: 'Photographer', category: 'photographer', icon: '📸' },
        { term: 'Catering Murah', category: 'catering', icon: '🍽️' },
        { term: 'Wedding Dress', category: 'dress', icon: '👗' },
        { term: 'Makeup Artist', category: 'makeup', icon: '💄' },
        { term: 'Dekorasi', category: 'decoration', icon: '🎨' },
    ]

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="min-h-full bg-white">
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
                        <div className="flex items-center gap-3">
                            {/* Search Input */}
                            <form onSubmit={handleSubmit} className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Input
                                        id="mobile-search-input"
                                        type="search"
                                        placeholder="Cari venue, photographer, catering..."
                                        className="pl-10 pr-10 py-4 text-base w-full rounded-xl"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        autoComplete="off"
                                    />

                                    {/* Clear button */}
                                    {query && (
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            </form>

                            {/* Close button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="h-10 w-10"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-4 py-3">
                        {/* Recent Searches */}
                        {recentSearches.length > 0 && results.length === 0 && !isLoading && (
                            <div className="mb-6">
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
                                            className="w-full text-left p-3 rounded-xl hover:bg-gray-50 flex items-center justify-between group border border-gray-100"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Clock className="h-4 w-4 text-gray-400" />
                                                <span className="text-gray-700">{searchTerm}</span>
                                            </div>
                                            <Search className="h-4 w-4 text-gray-400" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Search Results */}
                        {results.length > 0 && (
                            <div className="mb-6">
                                <div className="mb-3 text-sm font-medium text-gray-700">
                                    Hasil Pencarian
                                </div>
                                <div className="space-y-2">
                                    {results.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/vendor/${product.id}`}
                                            onClick={onClose}
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 group border border-gray-100"
                                        >
                                            {product.thumbnail_url ? (
                                                <div className="h-14 w-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                    <img
                                                        src={`${product.thumbnail_url}?w=56&h=56&fit=crop`}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="h-14 w-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                    <Search className="h-6 w-6 text-gray-400" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-gray-900 truncate">
                                                    {product.name}
                                                </div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                    <MapPin className="h-3 w-3 flex-shrink-0" />
                                                    <span className="truncate">{product.location}</span>
                                                </div>
                                                <div className="mt-1">
                                                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full capitalize">
                                                        {product.category}
                                                    </span>
                                                </div>
                                            </div>
                                            {product.price_from && (
                                                <div className="text-sm font-semibold text-blush flex-shrink-0">
                                                    Rp {product.price_from.toLocaleString('id-ID')}
                                                </div>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                                {query.trim() && (
                                    <button
                                        onClick={navigateToSearchPage}
                                        className="w-full mt-3 p-3 text-center bg-blush text-white rounded-xl font-medium"
                                    >
                                        Lihat semua hasil untuk "{query}"
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Loading State */}
                        {isLoading && (
                            <div className="py-8 flex items-center justify-center">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                    Mencari...
                                </div>
                            </div>
                        )}

                        {/* Empty Results */}
                        {!isLoading && results.length === 0 && query.trim().length >= 2 && (
                            <div className="py-8 text-center">
                                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <div className="text-gray-700 font-medium mb-2 text-lg">
                                    Tidak ditemukan
                                </div>
                                <p className="text-gray-500">
                                    Coba dengan kata kunci lain
                                </p>
                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={() => router.push('/categories')}
                                >
                                    Jelajahi Semua Kategori
                                </Button>
                            </div>
                        )}

                        {/* Popular Searches */}
                        <div className="pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-700">
                                <TrendingUp className="h-4 w-4" />
                                Pencarian Populer
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {popularSearches.map((item) => (
                                    <button
                                        key={item.term}
                                        type="button"
                                        onClick={() => handleQuickSearch(item.term)}
                                        className={cn(
                                            "p-3 rounded-xl border border-gray-200 hover:border-blush hover:bg-blush-light",
                                            "flex flex-col items-start text-left transition-colors"
                                        )}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-lg">{item.icon}</span>
                                            <span className="font-medium text-gray-900">{item.term}</span>
                                        </div>
                                        <span className="text-xs text-gray-500 capitalize">
                                            {item.category}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Browse Categories */}
                        <div className="mt-6">
                            <div className="mb-3 text-sm font-medium text-gray-700">
                                Jelajahi Kategori
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { name: 'Venue', icon: '🏛️', href: '/categories/venue' },
                                    { name: 'Photographer', icon: '📸', href: '/categories/photographer' },
                                    { name: 'Catering', icon: '🍽️', href: '/categories/catering' },
                                    { name: 'Dekorasi', icon: '🎨', href: '/categories/decoration' },
                                    { name: 'Gaun & Busana', icon: '👗', href: '/categories/dress' },
                                    { name: 'Makeup Artist', icon: '💄', href: '/categories/makeup' },
                                ].map((category) => (
                                    <Link
                                        key={category.name}
                                        href={category.href}
                                        onClick={onClose}
                                        className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 flex flex-col items-center justify-center text-center"
                                    >
                                        <span className="text-2xl mb-1">{category.icon}</span>
                                        <span className="text-sm font-medium text-gray-700">{category.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}