// File: lib/utils/format-date.ts
export function formatDate(dateString: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string {
    const date = new Date(dateString)

    if (format === 'short') {
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
        // Contoh: "12 Jan 2024"
    }

    if (format === 'long') {
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
        // Contoh: "Jumat, 12 Januari 2024"
    }

    // Relative time (e.g., "2 days ago")
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
        return 'Hari ini'
    } else if (diffInDays === 1) {
        return 'Kemarin'
    } else if (diffInDays < 7) {
        return `${diffInDays} hari yang lalu`
    } else if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7)
        return `${weeks} minggu yang lalu`
    } else {
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }
}

// Format untuk waktu juga
export function formatDateTime(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
    // Contoh: "12 Jan 2024, 14:30"
}