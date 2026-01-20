// File: lib/constants/categories.ts
export const CATEGORIES = [
    { id: 'venue', name: 'Venue', icon: '🏛️', count: 24 },
    { id: 'photographer', name: 'Fotografer', icon: '📸', count: 18 },
    { id: 'catering', name: 'Katering', icon: '🍽️', count: 32 },
    { id: 'decoration', name: 'Dekorasi', icon: '🎨', count: 15 },
    { id: 'dress', name: 'Gaun & Busana', icon: '👗', count: 12 },
    { id: 'makeup', name: 'Makeup Artist', icon: '💄', count: 8 },
    { id: 'music', name: 'Musik & Hiburan', icon: '🎵', count: 5 },
    { id: 'invitation', name: 'Undangan', icon: '✉️', count: 7 },
] as const

export const SORT_OPTIONS = [
    { id: 'newest', label: 'Terbaru' },
    { id: 'featured', label: 'Unggulan' },
    { id: 'price_low', label: 'Harga: Rendah ke Tinggi' },
    { id: 'price_high', label: 'Harga: Tinggi ke Rendah' },
] as const