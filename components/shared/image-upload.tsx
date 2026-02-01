"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Upload, X, Loader2, Image as ImageIcon, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { compressImage, validateImageFile } from "@/lib/utils/image-compressor"
import Image from 'next/image'
import { motion, AnimatePresence } from "framer-motion"

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

    const makeSignature = useCallback((file: File): string => {
        return `${file.name}|${file.size}|${file.lastModified}`
    }, [])

    const existingUploadedImages = existingImages.map(img => ({
        file: new File([], "existing-image"),
        previewUrl: img.url,
        isCompressing: false,
        error: undefined,
        compressedBlob: undefined,
        signature: `existing-${img.id || img.url}`
    }))

    const allImages = [...existingUploadedImages, ...uploadedImages]

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
        } else {
            onFilesChange([])
        }
    }, [uploadedImages, onFilesChange, compressToWebP])

    const handleFileSelect = async (files: FileList | null) => {
        if (!files || files.length === 0) return

        const fileArray = Array.from(files)
        const remainingSlots = maxFiles - allImages.length

        if (fileArray.length > remainingSlots) {
            alert(`Maksimal ${maxFiles} gambar. Anda sudah memilih ${allImages.length} gambar.`)
            return
        }

        const newUploadedImages: UploadedImage[] = []

        for (const file of fileArray.slice(0, remainingSlots)) {
            const signature = makeSignature(file)
            const isDuplicate = allImages.some(img => img.signature === signature)

            if (isDuplicate) {
                alert(`"${file.name}" sudah diupload sebelumnya.`)
                continue
            }

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

        setUploadedImages(prev => [...prev, ...newUploadedImages])
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

    const removeImage = useCallback((indexToRemove: number) => {
        if (indexToRemove < 0 || indexToRemove >= uploadedImages.length) return

        const imageToRemove = uploadedImages[indexToRemove]
        if (imageToRemove.previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(imageToRemove.previewUrl)
        }

        setUploadedImages(prev => [
            ...prev.slice(0, indexToRemove),
            ...prev.slice(indexToRemove + 1)
        ])

        if (indexToRemove === selectedThumbnailIndex - existingUploadedImages.length) {
            if (onThumbnailSelect) onThumbnailSelect(0)
        }
    }, [uploadedImages, selectedThumbnailIndex, existingUploadedImages.length, onThumbnailSelect])

    const removeAllImages = useCallback(() => {
        uploadedImages.forEach(img => {
            if (img.previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(img.previewUrl)
            }
        })

        setUploadedImages([])
        if (onThumbnailSelect && existingUploadedImages.length > 0) {
            onThumbnailSelect(0)
        }
    }, [uploadedImages, existingUploadedImages.length, onThumbnailSelect])

    const handleClickUpload = () => {
        fileInputRef.current?.click()
    }

    const handleImageClick = (index: number) => {
        console.log('🎯 [ImageUpload] Image clicked for thumbnail:', index)
        if (onThumbnailSelect) onThumbnailSelect(index)
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
                                onClick={removeAllImages}
                                disabled={isProcessing}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                                Hapus Semua Gambar
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        <AnimatePresence mode="popLayout">
                            {allImages.map((image, index) => {
                                const isSelectedThumbnail = index === selectedThumbnailIndex
                                const isExisting = index < existingUploadedImages.length
                                const uploadedImageIndex = index - existingUploadedImages.length

                                return (
                                    <motion.div
                                        key={image.signature}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                        transition={{
                                            duration: 0.25,
                                            ease: "easeOut",
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 22
                                        }}
                                        className={cn(
                                            "group relative aspect-square min-h-[120px] rounded-lg overflow-hidden border transition-all",
                                            image.error
                                                ? "border-red-300 bg-red-50"
                                                : isExisting
                                                    ? "border-gray-200"
                                                    : "border-gray-300",
                                            isSelectedThumbnail && "ring-2 ring-blue-500 ring-offset-1"
                                        )}
                                    >
                                        {/* Thumbnail Badge */}
                                        {isSelectedThumbnail && (
                                            <div className="absolute top-1 left-1 z-[60] bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                <Star className="h-3 w-3" />
                                                <span>Thumbnail</span>
                                            </div>
                                        )}

                                        {/* Gambar - Clickable untuk thumbnail */}
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => {
                                                console.log('🟢 Klik gambar index:', index)
                                                handleImageClick(index)
                                            }}
                                            onKeyDown={(e) => e.key === "Enter" && handleImageClick(index)}
                                            className="w-full h-full bg-gray-100 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-inset"
                                        >
                                            {image.previewUrl ? (
                                                <Image
                                                    src={image.previewUrl}
                                                    alt={`Preview ${index + 1}`}
                                                    width={200}
                                                    height={200}
                                                    className="w-full h-full object-cover"
                                                    unoptimized={true}
                                                />
                                            ) : (
                                                <ImageIcon className="h-8 w-8 text-gray-400" />
                                            )}
                                        </div>

                                        {/* Tombol Hapus */}
                                        {!isExisting && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    e.preventDefault()
                                                    console.log('🗑️ Remove button clicked for uploaded image index:', uploadedImageIndex)
                                                    removeImage(uploadedImageIndex)
                                                }}
                                                disabled={isProcessing}
                                                className="absolute top-1 right-1 z-[9999] bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors disabled:opacity-50 shadow-md pointer-events-auto"
                                                aria-label="Hapus gambar"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        )}

                                        {/* Status Indicator */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 z-[40]">
                                            {image.isCompressing ? (
                                                <div className="flex items-center gap-1 text-xs text-white">
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                    <span>Mengompresi...</span>
                                                </div>
                                            ) : image.error ? (
                                                <p className="text-xs text-red-200 truncate">{image.error}</p>
                                            ) : isExisting ? (
                                                <p className="text-xs text-white/80 truncate">Existing</p>
                                            ) : (
                                                <p className="text-xs text-white/80 truncate">
                                                    {image.compressedBlob
                                                        ? `${Math.round(image.compressedBlob.size / 1024)}KB`
                                                        : "Belum dikompresi"}
                                                </p>
                                            )}
                                        </div>

                                        {/* 🟢 FIXED: Overlay Hover Instruction */}
                                        {!isExisting && (
                                            <div className="absolute inset-0 z-[50] pointer-events-none">
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center">
                                                    <p className="text-white text-xs font-medium mb-1 select-none">
                                                        Klik untuk thumbnail
                                                    </p>
                                                    <p className="text-white/80 text-xs select-none">
                                                        ✕ untuk hapus
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Instruction */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                            <span className="font-medium">💡 Petunjuk:</span>
                        </p>
                        <ul className="text-xs text-gray-600 mt-1 space-y-1">
                            <li>• <span className="font-medium">Klik gambar</span> → pilih sebagai thumbnail</li>
                            <li>• <span className="font-medium">Klik tombol ✕ merah</span> di pojok kanan atas → hapus gambar</li>
                            <li>• <span className="font-medium">"Hapus Semua Gambar"</span> → hapus semua gambar baru</li>
                            <li>• Gambar dengan label "Existing" tidak bisa dihapus</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
}