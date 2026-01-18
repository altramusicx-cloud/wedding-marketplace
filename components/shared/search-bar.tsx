// components/shared/search-bar.tsx
'use client'

import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('')
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/categories?search=${encodeURIComponent(searchQuery.trim())}`)
        }
    }

    return (
        <form onSubmit={handleSearch} className="w-full">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        type="search"
                        placeholder="Cari venue, photographer, catering..."
                        className="pl-10 pr-4 py-6 text-base"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
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

            <div className="flex flex-wrap gap-2 mt-3">
                <button
                    type="button"
                    onClick={() => router.push('/categories?category=venue')}
                    className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full"
                >
                    Venue Samarinda
                </button>
                <button
                    type="button"
                    onClick={() => router.push('/categories?category=photographer')}
                    className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full"
                >
                    Photographer
                </button>
                <button
                    type="button"
                    onClick={() => router.push('/categories?category=catering')}
                    className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full"
                >
                    Catering Murah
                </button>
                <button
                    type="button"
                    onClick={() => router.push('/categories?category=dress')}
                    className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full"
                >
                    Wedding Dress
                </button>
            </div>
        </form>
    )
}