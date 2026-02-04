// lib\utils\upload-image.ts
import { createClient } from '@/lib/supabase/client'
import { compressImage } from '@/lib/utils/image-compressor'

export interface UploadOptions {
    bucket?: string
    folder?: string
    productId?: string
}

export interface UploadResult {
    url: string
    path: string
    originalSize?: number
    compressedSize?: number
    format?: string
}

export async function uploadImages(
    files: File[],
    options: UploadOptions = {}
): Promise<UploadResult[]> {
    console.log('🚀 [UPLOAD START] ================')
    console.log('Files to upload:', files.length)
    console.log('First file:', files[0]?.name, files[0]?.size)
    console.log('Options:', options)
    console.log('=================================')
    console.log('🚀 [UPLOAD] Starting upload of', files.length, 'files')

    const results: UploadResult[] = []
    const supabase = createClient()

    for (const [index, file] of files.entries()) {
        try {
            console.log(`📤 [UPLOAD ${index + 1}/${files.length}] Processing: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`)

            // 1. Compress image
            const compressedResult = await compressImage(file, {
                maxSizeKB: 120,
                format: 'webp',
                quality: 0.7
            })

            console.log(`✅ [COMPRESS] ${file.name}: ${(file.size / 1024).toFixed(1)}KB → ${(compressedResult.compressedSize / 1024).toFixed(1)}KB`)

            // 2. Create compressed file
            const compressedFile = new File(
                [compressedResult.blob],
                `${Date.now()}-${file.name.replace(/\.[^/.]+$/, '')}.webp`,
                { type: 'image/webp' }
            )

            // 3. Generate unique filename
            const fileExt = 'webp'
            const fileName = `${options.productId || 'temp'}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
            const filePath = `${options.folder || 'products'}/${fileName}`

            console.log(`⬆️ [UPLOADING] To: ${filePath}`)

            // 4. Upload with timeout
            const uploadPromise = supabase.storage
                .from(options.bucket || 'product-images')
                .upload(filePath, compressedFile)

            // 30 second timeout
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error(`Upload timeout after 30s: ${file.name}`)), 30000)
            )

            const { data, error } = await Promise.race([uploadPromise, timeoutPromise]) as any

            if (error) {
                console.error(`❌ [UPLOAD ERROR] ${file.name}:`, error)
                throw error
            }

            // 5. Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(options.bucket || 'product-images')
                .getPublicUrl(filePath)

            console.log(`✅ [UPLOAD SUCCESS] ${file.name}: ${publicUrl}`)

            results.push({
                url: publicUrl,
                path: filePath,
                originalSize: compressedResult.originalSize,
                compressedSize: compressedResult.compressedSize,
                format: 'webp'
            })

        } catch (error: any) {
            console.error(`🔥 [UPLOAD FAILED] ${file.name}:`, {
                message: error.message,
                stack: error.stack
            })
            throw new Error(`Gagal upload ${file.name}: ${error.message}`)
        }
    }

    console.log('🎉 [UPLOAD COMPLETE] All files uploaded:', results.length)
    return results
}

export async function deleteImages(
    imageUrls: string[],
    options: UploadOptions = {}
): Promise<void> {
    const supabase = createClient()

    console.log('🗑️ [DELETE] Starting deletion of', imageUrls.length, 'images')

    for (const url of imageUrls) {
        try {
            // Extract file path from URL
            const urlObj = new URL(url)
            const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)/)

            if (!pathMatch) {
                console.warn('⚠️ [DELETE] Cannot parse path from URL:', url)
                continue
            }

            const filePath = decodeURIComponent(pathMatch[1])
            console.log(`🗑️ [DELETE] Removing: ${filePath}`)

            const { error } = await supabase.storage
                .from(options.bucket || 'product-images')
                .remove([filePath])

            if (error) {
                console.error(`❌ [DELETE ERROR] ${filePath}:`, error)
            } else {
                console.log(`✅ [DELETE SUCCESS] ${filePath}`)
            }

        } catch (error: any) {
            console.error(`🔥 [DELETE FAILED] ${url}:`, error.message)
        }
    }

    console.log('🗑️ [DELETE COMPLETE]')
}
