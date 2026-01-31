// components\shared\image-upload.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { Upload, X, Loader2, Image as ImageIcon, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { compressImage, validateImageFile } from "@/lib/utils/image-compressor"
import Image from 'next/image'

export interface UploadedImage {
    file: File
    previewUrl: string
    compressedBlob?: Blob
    isCompressing?: boolean
    error?: string
    signature: string
}

interface ImageUploadProps {
    selectedThumbnailIndex?: number
    onThumbnailSelect?: (index: number) => void
    maxFiles?: number
    maxSizeMB?: number
    maxSizeKB?: number
    onFilesChange: (files: File[]) => void
    existingImages?: Array<{ url: string; id?: string }>
    compressToWebP?: boolean
    className?: string
}

export function ImageUpload({
    selectedThumbnailIndex = 0,
    onThumbnailSelect,
    maxFiles = 10,
    maxSizeMB = 8,
    maxSizeKB = 120,
    onFilesChange,
    existingImages = [],
    compressToWebP = true,
    className
}: ImageUploadProps) {
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Helper untuk membuat signature file
    const makeSignature = (file: File): string => {
        return `${file.name}|${file.size}|${file.lastModified}`
    }

    // Convert existing images
    const existingUploadedImages = existingImages.map(img => ({
        file: new File([], "existing-image"),
        previewUrl: img.url,
        isCompressing: false,
        error: undefined,
        compressedBlob: undefined,
        signature: `existing-${img.id || img.url}`
    }))

    const allImages = [...existingUploadedImages, ...uploadedImages]

    // Notify parent about current files
    useEffect(() => {
        if (uploadedImages.length > 0) {
            const compressedFiles = uploadedImages
                .filter(img => img.compressedBlob && !img.error)
                .map(img => new File([img.compressedBlob!], img.file.name, {
                    type: compressToWebP ? 'image/webp' : img.file.type
                }))

            if (compressedFiles.length > 0) {
                onFilesChange(compressedFiles)
            }
        }
    }, [uploadedImages, onFilesChange, compressToWebP])

    const handleFileSelect = async (files: FileList | null) => {
        if (!files || files.length === 0) return

        const fileArray = Array.from(files)
        console.log('🟡 [ImageUpload] New files selected:', fileArray.length)

        // Check remaining slots
        const remainingSlots = maxFiles - allImages.length
        if (fileArray.length > remainingSlots) {
            alert(`Maksimal ${maxFiles} gambar. Anda sudah memilih ${allImages.length} gambar.`)
            return
        }

        const newUploadedImages: UploadedImage[] = []

        // Filter duplicates dan validate
        for (const file of fileArray.slice(0, remainingSlots)) {
            // Check duplicate
            const signature = makeSignature(file)
            const isDuplicate = allImages.some(img => img.signature === signature)

            if (isDuplicate) {
                alert(`"${file.name}" sudah diupload sebelumnya.`)
                continue
            }

            // Validate
            const validationError = validateImageFile(file, maxSizeMB)
            if (validationError) {
                alert(`${file.name}: ${validationError}`)
                continue
            }

            newUploadedImages.push({
                file,
                previewUrl: URL.createObjectURL(file),
                isCompressing: true,
                error: undefined,
                compressedBlob: undefined,
                signature
            })
        }

        if (newUploadedImages.length === 0) return

        console.log('🟡 [ImageUpload] Adding new images:', newUploadedImages.length)

        // Add to state
        setUploadedImages(prev => [...prev, ...newUploadedImages])

        // Process compression
        setIsProcessing(true)
        try {
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

            // Update with compressed blobs
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

                return updated
            })

        } catch (error) {
            console.error('Error processing images:', error)
        } finally {
            setIsProcessing(false)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        handleFileSelect(e.dataTransfer.files)
    }

    const removeImage = (index: number) => {
        const imageToRemove = uploadedImages[index]

        // Revoke object URL
        if (imageToRemove.previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(imageToRemove.previewUrl)
        }

        setUploadedImages(prev => {
            const newImages = prev.filter((_, i) => i !== index)
            return newImages
        })
    }

    const handleClickUpload = () => {
        fileInputRef.current?.click()
    }

    // 🎯 FIX: INI FUNCTION YANG PASTI DIPANGGIL SAAT KLIK GAMBAR
    const handleImageClick = (index: number) => {
        console.log('🎯 [ImageUpload] Image clicked for thumbnail:', index)
        if (onThumbnailSelect) {
            onThumbnailSelect(index)
        }
    }

    return (
        <div className={className}>
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
            />

            {/* Upload Area */}
            {allImages.length < maxFiles && (
                <div
                    className={cn(
                        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                        isDragging
                            ? "border-blush bg-blush/10"
                            : "border-gray-300 hover:border-blush hover:bg-gray-50"
                    )}
                    onClick={handleClickUpload}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="space-y-3">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
                            {isProcessing ? (
                                <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
                            ) : (
                                <Upload className="h-6 w-6 text-gray-400" />
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">
                                {isProcessing ? "Mengompresi gambar..." : "Drag & drop gambar atau klik untuk upload"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Maksimal {maxFiles} gambar, masing-masing maksimal {maxSizeMB}MB
                                {compressToWebP && `, akan dikompresi ke ≤${maxSizeKB}KB format WebP`}
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isProcessing}
                        >
                            Pilih Gambar
                        </Button>
                    </div>
                </div>
            )}

            {/* Image Preview Grid */}
            {allImages.length > 0 && (
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-medium text-gray-700">
                            {allImages.length} / {maxFiles} gambar
                            {isProcessing && " (Mengompresi...)"}
                        </p>
                        {uploadedImages.length > 0 && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    uploadedImages.forEach(img => {
                                        if (img.previewUrl.startsWith('blob:')) {
                                            URL.revokeObjectURL(img.previewUrl)
                                        }
                                    })
                                    setUploadedImages([])
                                }}
                                disabled={isProcessing}
                            >
                                Hapus Semua
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {allImages.map((image, index) => {
                            const isSelectedThumbnail = index === selectedThumbnailIndex
                            const isExisting = index < existingUploadedImages.length

                            return (
                                <div
                                    key={index}
                                    className={cn(
                                        "relative aspect-square rounded-lg overflow-hidden border cursor-pointer transition-all group",
                                        image.error
                                            ? "border-red-300 bg-red-50"
                                            : isExisting
                                                ? "border-gray-200"
                                                : "border-gray-300",
                                        isSelectedThumbnail && "ring-2 ring-blue-500 ring-offset-2"
                                    )}
                                    // 🎯 INI YANG PENTING: onClick handler harus ada di sini!
                                    onClick={() => handleImageClick(index)}
                                >
                                    {/* Thumbnail Badge */}
                                    {isSelectedThumbnail && (
                                        <div className="absolute top-1 left-1 z-10 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                            <Star className="h-3 w-3" />
                                            <span>Thumbnail</span>
                                        </div>
                                    )}

                                    {/* Image Preview */}
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        {image.previewUrl ? (
                                            <Image
                                                src={image.previewUrl}
                                                alt={`Preview ${index + 1}`}
                                                width={200}
                                                height={200}
                                                className="w-full h-full object-cover"
                                                unoptimized={true} // Untuk blob URL
                                            />
                                        ) : (
                                            <ImageIcon className="h-8 w-8 text-gray-400" />
                                        )}
                                    </div>

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="absolute top-2 right-2">
                                            {!isExisting && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        removeImage(index - existingUploadedImages.length)
                                                    }}
                                                    disabled={isProcessing}
                                                    className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors disabled:opacity-50"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Status Indicator */}
                                        <div className="absolute bottom-2 left-2 right-2">
                                            {image.isCompressing ? (
                                                <div className="flex items-center gap-1 text-xs text-white">
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                    <span>Mengompresi...</span>
                                                </div>
                                            ) : image.error ? (
                                                <p className="text-xs text-red-200 truncate">{image.error}</p>
                                            ) : isExisting ? (
                                                <p className="text-xs text-white/80 truncate">Sudah diupload</p>
                                            ) : (
                                                <p className="text-xs text-white/80 truncate">
                                                    {image.compressedBlob
                                                        ? `${Math.round(image.compressedBlob.size / 1024)}KB`
                                                        : "Belum dikompresi"}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Click Instruction */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                        <p className="text-white text-sm font-medium">Klik untuk thumbnail</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Thumbnail Instruction */}
                    <p className="text-sm text-gray-600 mt-4">
                        💡 <strong>Klik gambar</strong> untuk memilih sebagai thumbnail
                    </p>
                </div>
            )}
        </div>
    )
}