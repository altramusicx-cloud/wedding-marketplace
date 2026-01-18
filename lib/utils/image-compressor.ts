// File: lib/utils/image-compressor.ts
interface CompressionOptions {
    maxWidth?: number      // Default: 1200px
    maxHeight?: number     // Default: 1200px  
    quality?: number       // Default: 0.8 (80%)
    maxSizeKB?: number     // Default: 120
    format?: 'webp' | 'jpeg' | 'png' // Default: 'webp'
}

export async function compressImage(
    file: File,
    options: CompressionOptions = {}
): Promise<{
    blob: Blob
    originalSize: number
    compressedSize: number
    width: number
    height: number
    format: string
}> {
    const {
        maxWidth = 1200,
        maxHeight = 1200,
        quality = 0.8,
        maxSizeKB = 120,
        format = 'webp'
    } = options

    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            const img = new Image()

            img.onload = () => {
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

                // Draw image on canvas
                ctx.drawImage(img, 0, 0, width, height)

                // Compress to target format
                const mimeType = `image/${format}`

                canvas.toBlob(
                    async (blob) => {
                        if (!blob) {
                            reject(new Error('Failed to compress image'))
                            return
                        }

                        // If still too large, reduce quality further
                        let finalBlob = blob
                        let finalSize = blob.size
                        let finalQuality = quality

                        if (finalSize > maxSizeKB * 1024) {
                            // Calculate needed quality reduction
                            const sizeRatio = (maxSizeKB * 1024) / finalSize
                            finalQuality = Math.max(0.3, quality * Math.sqrt(sizeRatio))

                            canvas.toBlob(
                                (reducedBlob) => {
                                    if (!reducedBlob) {
                                        resolve({
                                            blob: finalBlob,
                                            originalSize: file.size,
                                            compressedSize: finalSize,
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
                                mimeType,
                                finalQuality
                            )
                        } else {
                            resolve({
                                blob: finalBlob,
                                originalSize: file.size,
                                compressedSize: finalSize,
                                width,
                                height,
                                format
                            })
                        }
                    },
                    mimeType,
                    quality
                )
            }

            img.onerror = () => reject(new Error('Failed to load image'))
            img.src = e.target?.result as string
        }

        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
    })
}

// Batch compression for multiple images
export async function compressImages(
    files: File[],
    options: CompressionOptions = {}
): Promise<Array<{
    blob: Blob
    originalSize: number
    compressedSize: number
    width: number
    height: number
    format: string
    name: string
}>> {
    const results = []

    for (const file of files) {
        try {
            const compressed = await compressImage(file, options)
            results.push({
                ...compressed,
                name: file.name
            })
        } catch (error) {
            console.error(`Failed to compress ${file.name}:`, error)
            // Return original file as fallback
            results.push({
                blob: file,
                originalSize: file.size,
                compressedSize: file.size,
                width: 0,
                height: 0,
                format: file.type.split('/')[1] || 'jpeg',
                name: file.name
            })
        }
    }

    return results
}

// Utility to convert Blob to File
export function blobToFile(blob: Blob, fileName: string): File {
    return new File([blob], fileName, {
        type: blob.type,
        lastModified: Date.now()
    })
}

// Calculate compression ratio
export function getCompressionRatio(originalSize: number, compressedSize: number): number {
    return Math.round((1 - compressedSize / originalSize) * 100)
}