// File: components/shared/filter-modal.tsx
'use client'

import { Filter, X, MapPin, DollarSign, Sparkles, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'

// Temporary categories - nanti import dari constants
const CATEGORIES = [
    { id: 'venue', name: 'Venue', icon: '🏛️' },
    { id: 'photographer', name: 'Fotografer', icon: '📸' },
    { id: 'catering', name: 'Katering', icon: '🍽️' },
    { id: 'decoration', name: 'Dekorasi', icon: '🎨' },
    { id: 'dress', name: 'Wedding Dress', icon: '👗' },
    { id: 'makeup', name: 'Makeup Artist', icon: '💄' },
    { id: 'music', name: 'Musik & Hiburan', icon: '🎵' },
    { id: 'invitation', name: 'Undangan', icon: '✉️' },
]

interface FilterModalProps {
    isOpen: boolean
    onClose: () => void
}

export function FilterModal({ isOpen, onClose }: FilterModalProps) {
    const router = useRouter()
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [location, setLocation] = useState('')
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')

    if (!isOpen) return null

    const toggleCategory = (categoryId: string) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        )
    }

    const applyFilters = () => {
        const params = new URLSearchParams()

        if (selectedCategories.length > 0) {
            params.append('categories', selectedCategories.join(','))
        }

        if (location.trim()) {
            params.append('location', location.trim())
        }

        if (minPrice.trim()) {
            params.append('min_price', minPrice.trim())
        }

        if (maxPrice.trim()) {
            params.append('max_price', maxPrice.trim())
        }

        router.push(`/categories?${params.toString()}`)
        onClose()
    }

    const resetFilters = () => {
        setSelectedCategories([])
        setLocation('')
        setMinPrice('')
        setMaxPrice('')
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="min-h-full bg-white flex flex-col">
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Filter className="h-5 w-5 text-blush" />
                                <h2 className="text-lg font-semibold text-charcoal">
                                    Filter & Sort
                                </h2>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="h-9 w-9"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-4 py-6">
                        {/* Categories Section */}
                        <div className="mb-8">
                            <h3 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                                <Sparkles className="h-4 w-4" />
                                Kategori
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                {CATEGORIES.map((category) => {
                                    const isSelected = selectedCategories.includes(category.id)
                                    return (
                                        <button
                                            key={category.id}
                                            type="button"
                                            onClick={() => toggleCategory(category.id)}
                                            className={cn(
                                                "flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
                                                isSelected
                                                    ? "border-blush bg-blush-light"
                                                    : "border-gray-200 hover:border-blush hover:bg-blush/5"
                                            )}
                                        >
                                            <span className="text-2xl mb-1">{category.icon}</span>
                                            <span className="text-xs font-medium text-gray-700 mb-1">
                                                {category.name}
                                            </span>
                                            {isSelected && (
                                                <Check className="h-3 w-3 text-blush" />
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Location Section */}
                        <div className="mb-8">
                            <h3 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Lokasi
                            </h3>
                            <Input
                                placeholder="Cari kota/kecamatan..."
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="rounded-lg"
                            />
                        </div>

                        {/* Price Range */}
                        <div className="mb-8">
                            <h3 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                Rentang Harga
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">
                                        Minimal
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            Rp
                                        </span>
                                        <Input
                                            placeholder="0"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value.replace(/\D/g, ''))}
                                            className="pl-10 rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">
                                        Maksimal
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            Rp
                                        </span>
                                        <Input
                                            placeholder="100.000.000"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ''))}
                                            className="pl-10 rounded-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Popular Filters */}
                        <div className="mb-8">
                            <h3 className="font-medium text-gray-700 mb-4">
                                Filter Populer
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    'Featured',
                                    'Promo',
                                    'New Vendor',
                                    'Available Now',
                                    'Free Consultation',
                                ].map((filter) => (
                                    <button
                                        key={filter}
                                        type="button"
                                        className="px-3 py-1.5 border border-gray-200 rounded-full text-sm hover:border-blush hover:bg-blush-light transition-colors"
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={resetFilters}
                                className="flex-1 border-gray-300"
                            >
                                Reset
                            </Button>
                            <Button
                                onClick={applyFilters}
                                className="flex-1 bg-blush hover:bg-blush-dark text-white"
                            >
                                Terapkan Filter
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}