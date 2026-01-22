// hooks/use-image-upload.ts
"use client"

import { useState, useCallback } from "react"
import { compressImage, validateImageFile } from "@/lib/utils/image-compressor"

interface UseImageUploadOptions {
    maxFiles?: number
    maxSizeMB?: number
    maxSizeKB?: number
    compressToWebP?: boolean
    onUploadComplete?: (files: File[]) => void
}

interface UploadedImage {
    file: File
    previewUrl: string
    compressedBlob?: Blob
    isCompressing?: boolean
    error?: string
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
    const {
        maxFiles = 10,
        maxSizeMB = 8,
        maxSizeKB = 120,
        compressToWebP = true,
        onUploadComplete
    } = options

    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [totalSize, setTotalSize] = useState(0)

    const handleFileSelect = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0) return

        const fileArray = Array.from(files)
        const remainingSlots = maxFiles - uploadedImages.length

        if (fileArray.length > remainingSlots) {
            throw new Error(`Maksimal ${maxFiles} gambar. Anda sudah memilih ${uploadedImages.length} gambar.`)
        }

        const newUploadedImages: UploadedImage[] = []

        // Validate and create preview for new files
        for (const file of fileArray.slice(0, remainingSlots)) {
            const validationError = validateImageFile(file, maxSizeMB)
            if (validationError) {
                throw new Error(`${file.name}: ${validationError}`)
            }

            newUploadedImages.push({
                file,
                previewUrl: URL.createObjectURL(file),
                isCompressing: true,
                error: undefined,
                compressedBlob: undefined
            })
        }

        // Add new images to state immediately (for preview)
        setUploadedImages(prev => [...prev, ...newUploadedImages])
        setIsProcessing(true)

        try {
            // Process compression
            const compressedResults = await Promise.allSettled(
                newUploadedImages.map(async (uploadedImage) => {
                    if (compressToWebP) {
                        const result = await compressImage(uploadedImage.file, {
                            maxSizeKB,
                            format: 'webp'
                        })
                        return result.blob
                    }
                    return uploadedImage.file
                })
            )

            // Update state with compression results
            setUploadedImages(prev => {
                const updated = [...prev]

                compressedResults.forEach((result, index) => {
                    const targetIndex = prev.length - newUploadedImages.length + index

                    if (result.status === 'fulfilled') {
                        updated[targetIndex] = {
                            ...updated[targetIndex],
                            compressedBlob: result.value,
                            isCompressing: false
                        }
                    } else {
                        updated[targetIndex] = {
                            ...updated[targetIndex],
                            error: 'Gagal mengompresi gambar',
                            isCompressing: false
                        }
                    }
                })

                // Calculate total size
                const totalSize = updated
                    .filter(img => img.compressedBlob)
                    .reduce((sum, img) => sum + (img.compressedBlob?.size || 0), 0)
                setTotalSize(totalSize)

                // Notify parent with compressed files
                const compressedFiles = updated
                    .filter(img => img.compressedBlob)
                    .map(img => new File([img.compressedBlob!], img.file.name, {
                        type: compressToWebP ? 'image/webp' : img.file.type
                    }))

                if (compressedFiles.length > 0 && onUploadComplete) {
                    onUploadComplete(compressedFiles)
                }

                return updated
            })

        } catch (error) {
            console.error('Error processing images:', error)
            throw error
        } finally {
            setIsProcessing(false)
        }
    }, [maxFiles, maxSizeMB, maxSizeKB, compressToWebP, uploadedImages.length, onUploadComplete])

    const removeImage = useCallback((index: number) => {
        setUploadedImages(prev => {
            const imageToRemove = prev[index]

            // Revoke object URL
            if (imageToRemove.previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(imageToRemove.previewUrl)
            }

            const newImages = prev.filter((_, i) => i !== index)

            // Update total size
            const newTotalSize = newImages
                .filter(img => img.compressedBlob)
                .reduce((sum, img) => sum + (img.compressedBlob?.size || 0), 0)
            setTotalSize(newTotalSize)

            // Notify parent with remaining files
            const remainingFiles = newImages
                .filter(img => img.compressedBlob)
                .map(img => new File([img.compressedBlob!], img.file.name, {
                    type: compressToWebP ? 'image/webp' : img.file.type
                }))

            if (onUploadComplete) {
                onUploadComplete(remainingFiles)
            }

            return newImages
        })
    }, [compressToWebP, onUploadComplete])

    const clearAllImages = useCallback(() => {
        // Revoke all object URLs
        uploadedImages.forEach(image => {
            if (image.previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(image.previewUrl)
            }
        })

        setUploadedImages([])
        setTotalSize(0)

        if (onUploadComplete) {
            onUploadComplete([])
        }
    }, [uploadedImages, onUploadComplete])

    const getCompressedFiles = useCallback(() => {
        return uploadedImages
            .filter(img => img.compressedBlob)
            .map(img => new File([img.compressedBlob!], img.file.name, {
                type: compressToWebP ? 'image/webp' : img.file.type
            }))
    }, [uploadedImages, compressToWebP])

    return {
        uploadedImages,
        isProcessing,
        totalSize,
        totalImages: uploadedImages.length,
        remainingSlots: maxFiles - uploadedImages.length,

        // Actions
        handleFileSelect,
        removeImage,
        clearAllImages,
        getCompressedFiles,

        // Status
        hasImages: uploadedImages.length > 0,
        allCompressed: uploadedImages.every(img => !img.isCompressing && img.compressedBlob),
        hasErrors: uploadedImages.some(img => img.error)
    }
}