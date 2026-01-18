// components/home/category-grid.tsx
import { Card, CardContent } from '@/components/ui/card'
import {
    Camera,
    Home,
    Utensils,
    Palette,
    Shirt,
    Music,
    Car,
    Cake
} from 'lucide-react'
import Link from 'next/link'

const categories = [
    {
        id: 'venue',
        name: 'Venue',
        icon: Home,
        color: 'bg-blush/20 text-blush',
        description: 'Gedung, ballroom, outdoor venue'
    },
    {
        id: 'photographer',
        name: 'Photographer',
        icon: Camera,
        color: 'bg-sage/20 text-sage',
        description: 'Foto & video pernikahan'
    },
    {
        id: 'catering',
        name: 'Catering',
        icon: Utensils,
        color: 'bg-amber-500/20 text-amber-600',
        description: 'Makanan & minuman'
    },
    {
        id: 'decoration',
        name: 'Dekorasi',
        icon: Palette,
        color: 'bg-purple-500/20 text-purple-600',
        description: 'Dekorasi venue & bunga'
    },
    {
        id: 'dress',
        name: 'Wedding Dress',
        icon: Shirt,
        color: 'bg-pink-500/20 text-pink-600',
        description: 'Gaun & jas pengantin'
    },
    {
        id: 'entertainment',
        name: 'Entertainment',
        icon: Music,
        color: 'bg-blue-500/20 text-blue-600',
        description: 'Band, MC, hiburan'
    },
    {
        id: 'transportation',
        name: 'Transportasi',
        icon: Car,
        color: 'bg-green-500/20 text-green-600',
        description: 'Mobil pengantin, shuttle'
    },
    {
        id: 'cake',
        name: 'Kue Pengantin',
        icon: Cake,
        color: 'bg-rose-500/20 text-rose-600',
        description: 'Kue & dessert table'
    },
]

interface CategoryGridProps {
    categoryCounts?: Record<string, number>
}

export function CategoryGrid({ categoryCounts = {} }: CategoryGridProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => {
                const Icon = category.icon
                const count = categoryCounts[category.id] || 0

                return (
                    <Link
                        key={category.id}
                        href={`/categories/${category.id}`}
                        className="group"
                    >
                        <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-gray-200">
                            <CardContent className="p-4 flex flex-col items-center text-center">
                                <div className={`${category.color} p-3 rounded-full mb-3 group-hover:scale-110 transition-transform`}>
                                    <Icon className="h-6 w-6" />
                                </div>

                                <h3 className="font-semibold text-gray-800 mb-1">{category.name}</h3>

                                {count > 0 && (
                                    <div className="text-xs text-gray-500 mb-2">
                                        {count} produk
                                    </div>
                                )}

                                <p className="text-xs text-gray-600 line-clamp-2">
                                    {category.description}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                )
            })}
        </div>
    )
}