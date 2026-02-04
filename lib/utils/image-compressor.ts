// lib\utils\image-compressor.ts
export interface CompressionOptions {
    maxWidth?: number
    maxHeight?: number
    quality?: number
    maxSizeKB?: number
    format?: 'webp' | 'jpeg' | 'png'
}

export interface CompressionResult {
    blob: Blob
    originalSize: number
    compressedSize: number
    width: number
    height: number
}

export async function compressImage(
    file: File,
    options: CompressionOptions = {}
): Promise<CompressionResult> {
    const {
        maxWidth = 1200,
        maxHeight = 1200,
        quality = 0.7,  // Lower quality for smaller size
        maxSizeKB = 120,
        format = 'webp'
    } = options

    console.log(`🔧 [COMPRESSOR] Starting compression: ${file.name} ${file.size}`)

    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onload = (event) => {
            const img = new Image()
            img.src = event.target?.result as string

            img.onload = () => {
                const canvas = document.createElement('canvas')
                let width = img.width
                let height = img.height

                // Resize if too large
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height)
                    width = Math.floor(width * ratio)
                    height = Math.floor(height * ratio)
                }

                canvas.width = width
                canvas.height = height

                const ctx = canvas.getContext('2d')
                if (!ctx) {
                    reject(new Error('Canvas context not available'))
                    return
                }

                ctx.drawImage(img, 0, 0, width, height)

                // Quality adjustment loop
                const attemptCompression = (currentQuality: number, attempt: number) => {
                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                reject(new Error('Failed to create blob'))
                                return
                            }

                            const sizeKB = blob.size / 1024
                            console.log(`🔧 [COMPRESSOR] Attempt ${attempt}: ${sizeKB.toFixed(1)}KB at quality ${currentQuality}`)

                            if (sizeKB <= maxSizeKB || currentQuality <= 0.3) {
                                // Success or minimum quality reached
                                console.log(`✅ [COMPRESSOR] Final: ${sizeKB.toFixed(1)}KB (target: ${maxSizeKB}KB)`)
                                resolve({
                                    blob,
                                    originalSize: file.size,
                                    compressedSize: blob.size,
                                    width,
                                    height
                                })
                            } else if (attempt < 5) {
                                // Try lower quality
                                const newQuality = Math.max(0.3, currentQuality - 0.1)
                                attemptCompression(newQuality, attempt + 1)
                            } else {
                                // Last resort - use minimum quality
                                canvas.toBlob(
                                    (finalBlob) => {
                                        if (finalBlob) {
                                            const finalSizeKB = finalBlob.size / 1024
                                            console.log(`⚠️ [COMPRESSOR] Using minimum quality: ${finalSizeKB.toFixed(1)}KB`)
                                            resolve({
                                                blob: finalBlob,
                                                originalSize: file.size,
                                                compressedSize: finalBlob.size,
                                                width,
                                                height
                                            })
                                        }
                                    },
                                    `image/${format}`,
                                    0.3
                                )
                            }
                        },
                        `image/${format}`,
                        currentQuality
                    )
                }

                // Start compression attempts
                attemptCompression(quality, 1)
            }

            img.onerror = () => {
                reject(new Error('Failed to load image'))
            }
        }

        reader.onerror = () => {
            reject(new Error('Failed to read file'))
        }
    })
}

// Helper function
export function validateImageFile(file: File, maxSizeMB: number): string | null {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

    if (!validTypes.includes(file.type)) {
        return 'Format file tidak didukung. Gunakan JPEG, PNG, atau WebP.'
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
        return `File terlalu besar. Maksimal ${maxSizeMB}MB.`
    }

    return null
}