export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

export function formatCurrencyRange(
    from?: number,
    to?: number,
    unit?: string
): string {
    if (!from && !to) return 'Hubungi untuk harga'

    if (from && to) {
        return `${formatCurrency(from)} - ${formatCurrency(to)} ${unit ? `/${unit}` : ''}`
    }

    if (from) {
        return `${formatCurrency(from)} ${unit ? `/${unit}` : ''}`
    }

    return `${formatCurrency(to!)} ${unit ? `/${unit}` : ''}`
}