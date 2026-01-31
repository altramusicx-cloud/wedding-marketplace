// File: utils/upload-image.ts
import { createClient } from '@/lib/supabase/client'

export interface UploadResult {
    url: string
    path: string
    size: number
}

/**
 * Upload single image to Supabase Storage
 */
export async function uploadImage(
    file: File,
    options: {
        bucket?: string
        folder?: string
        productId?: string
        fileName?: string
    } = {}
): Promise<UploadResult> {
    const supabase = createClient()

    const {
        bucket = 'product-images',
        folder = 'temp',
        productId = 'unknown',
        fileName
    } = options

    // Generate filename if not provided
    const finalFileName = fileName || `${productId}-${Date.now()}-${Math.random().toString(36).substring(7)}.${file.type.split('/')[1] || 'webp'}`

    // Determine folder path
    const folderPath = folder === 'temp' ? 'temp' : `${folder}/${productId}`
    const filePath = `${folderPath}/${finalFileName}`

    const { error: uploadError, data } = await supabase
        .storage
        .from(bucket)
        .upload(filePath, file, {
            cacheControl: '31536000', // 1 year cache
            upsert: false,
            contentType: file.type
        })

    if (uploadError) {
        console.error('Upload error:', uploadError)
        throw new Error(`Gagal upload gambar: ${uploadError.message}`)
    }

    // Get public URL
    const { data: urlData } = supabase
        .storage
        .from(bucket)
        .getPublicUrl(filePath)

    return {
        url: urlData.publicUrl,
        path: filePath,
        size: file.size
    }
}

/**
 * Upload multiple images to Supabase Storage
 */
export async function uploadImages(
    files: File[],
    options: {
        bucket?: string
        folder?: string
        productId?: string
    } = {}
): Promise<UploadResult[]> {
    const uploadPromises = files.map((file, index) =>
        uploadImage(file, {
            ...options,
            fileName: `${options.productId || 'image'}-${index}-${Date.now()}.${file.type.split('/')[1] || 'webp'}`
        })
    )

    return Promise.all(uploadPromises)
}

/**
 * Move temporary images to permanent location after product creation
 */
export async function moveImagesToPermanentLocation(
    tempUrls: string[],
    productId: string,
    bucket: string = 'product-images'
): Promise<string[]> {
    const supabase = createClient()

    const permanentUrls: string[] = []

    for (const tempUrl of tempUrls) {
        try {
            // Extract filename from URL
            const tempPath = extractPathFromUrl(tempUrl, bucket)
            const fileName = tempPath.split('/').pop() || `image-${Date.now()}.webp`
            const newPath = `products/${productId}/${fileName}`

            // Copy file to permanent location
            const { error: copyError } = await supabase
                .storage
                .from(bucket)
                .copy(tempPath, newPath)

            if (copyError) {
                console.error('Copy error:', copyError)
                // Fallback: keep original URL
                permanentUrls.push(tempUrl)
                continue
            }

            // Get new public URL
            const { data: urlData } = supabase
                .storage
                .from(bucket)
                .getPublicUrl(newPath)

            permanentUrls.push(urlData.publicUrl)

            // Optionally delete temp file (uncomment if needed)
            // await supabase.storage.from(bucket).remove([tempPath])

        } catch (error) {
            console.error('Error moving image:', error)
            permanentUrls.push(tempUrl) // Keep original as fallback
        }
    }

    return permanentUrls
}

/**
 * Extract file path from Supabase Storage URL
 */
function extractPathFromUrl(url: string, bucket: string): string {
    try {
        const urlObj = new URL(url)
        // URL pattern: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
        const pathParts = urlObj.pathname.split(`/storage/v1/object/public/${bucket}/`)
        return pathParts[1] || ''
    } catch {
        return ''
    }
}

/**
 * Delete images from storage
 */
export async function deleteImages(
    paths: string[],
    bucket: string = 'product-images'
): Promise<void> {
    const supabase = createClient()

    const { error } = await supabase
        .storage
        .from(bucket)
        .remove(paths)

    if (error) {
        console.error('Delete error:', error)
        throw new Error('Gagal menghapus gambar')
    }
}