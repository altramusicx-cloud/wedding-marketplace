// File: lib/utils/debounce.ts

/**
 * Pure debounce function untuk menunda eksekusi fungsi
 * @param func Fungsi yang akan di-debounce
 * @param wait Waktu tunggu dalam milidetik
 * @param immediate Jika true, eksekusi langsung di awal
 */
export function debounce<F extends (...args: any[]) => any>(
    func: F,
    wait: number,
    immediate = false
): (...args: Parameters<F>) => void {
    let timeout: NodeJS.Timeout | null = null

    return function executedFunction(...args: Parameters<F>) {
        const later = () => {
            timeout = null
            if (!immediate) func(...args)
        }

        const callNow = immediate && !timeout

        if (timeout) {
            clearTimeout(timeout)
        }

        timeout = setTimeout(later, wait)

        if (callNow) {
            func(...args)
        }
    }
}