// File: lib/utils/image-compressor.ts
interface CompressionOptions {
    maxWidth?: number
    maxHeight?: number
    quality?: number
    maxSizeKB?: number
    format?: 'webp' | 'jpeg'
}

interface CompressionResult {
    blob: Blob
    originalSize: number
    compressedSize: number
    width: number
    height: number
    format: string
}

export async function compressImage(
    file: File,
    options: CompressionOptions = {}
): Promise<CompressionResult> {

    console.log('🔧 [COMPRESSOR] Starting compression:', file.name, file.size)
    const {
        maxWidth = 1200,    // ↑ dari 800 (+50%)
        maxHeight = 1200,   // ↑ dari 800 (+50%)
        quality = 0.8,     // ↑ dari 0.6 (+25%)
        maxSizeKB = 120,
        format = 'webp'
    } = options

    return new Promise((resolve, reject) => {
        // Create image element
        const img = new Image()
        const url = URL.createObjectURL(file)

        img.onload = () => {
            URL.revokeObjectURL(url)

            // Calculate new dimensions while maintaining aspect ratio
            let width = img.width
            let height = img.height

            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height)
                width = Math.floor(width * ratio)
                height = Math.floor(height * ratio)
            }

            // Create canvas for compression
            const canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height

            const ctx = canvas.getContext('2d')
            if (!ctx) {
                reject(new Error('Canvas context not available'))
                return
            }

            // Draw image to canvas
            ctx.drawImage(img, 0, 0, width, height)

            // Compress to target format
            canvas.toBlob(
                async (blob) => {
                    if (!blob) {
                        reject(new Error('Failed to compress image'))
                        return
                    }

                    console.log('🔧 [COMPRESSOR] Compression success:', {
                        original: file.size,
                        compressed: blob.size,
                        type: blob.type
                    })

                    // If still too large, reduce quality further
                    let finalBlob = blob
                    let finalQuality = quality

                    // Convert to KB
                    const sizeKB = blob.size / 1024

                    if (sizeKB > maxSizeKB) {
                        // Calculate needed quality reduction
                        const targetRatio = maxSizeKB / sizeKB
                        finalQuality = Math.max(0.4, quality * targetRatio)

                        // Re-compress with lower quality
                        canvas.toBlob(
                            (reducedBlob) => {
                                if (!reducedBlob) {
                                    resolve({
                                        blob: blob,
                                        originalSize: file.size,
                                        compressedSize: finalBlob.size,
                                        width,
                                        height,
                                        format
                                    })
                                    return
                                }

                                resolve({
                                    blob: reducedBlob,
                                    originalSize: file.size,
                                    compressedSize: reducedBlob.size,
                                    width,
                                    height,
                                    format
                                })
                            },
                            `image/${format}`,
                            finalQuality
                        )
                    } else {
                        resolve({
                            blob: finalBlob,
                            originalSize: file.size,
                            compressedSize: finalBlob.size,
                            width,
                            height,
                            format
                        })
                    }
                },
                `image/${format}`,
                quality
            )
        }

        img.onerror = () => {
            URL.revokeObjectURL(url)
            reject(new Error('Failed to load image'))
        }

        img.src = url
    })
}

// Helper function untuk validasi file
export function validateImageFile(file: File, maxSizeMB: number = 8): string | null {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

    if (!validTypes.includes(file.type)) {
        return 'Format file tidak didukung. Gunakan JPEG, PNG, atau WebP.'
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
        return `File terlalu besar. Maksimal ${maxSizeMB}MB.`
    }

    return null
}

// Batch compression untuk multiple images
export async function compressImages(
    files: File[],
    options?: CompressionOptions
): Promise<CompressionResult[]> {
    const promises = files.map(file => compressImage(file, options))
    return Promise.all(promises)
}