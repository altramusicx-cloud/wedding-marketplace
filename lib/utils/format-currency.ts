// File: lib/utils/format-currency.ts
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount)
}

// Contoh: formatCurrency(25000000) → "Rp 25.000.000"