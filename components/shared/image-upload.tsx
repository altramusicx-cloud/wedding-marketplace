// File: components/shared/image-upload.tsx
"use client"

import { useState, useCallback } from "react"
import { Upload, X, Check, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { compressImages, blobToFile, getCompressionRatio } from "@/lib/utils/image-compressor"

interface ImageUploadProps {
    maxFiles?: number           // Default: 10
    minFiles?: number           // Default: 2
    maxSizeMB?: number          // Default: 2 (before compression)
    maxSizeKB?: number          // Default: 120 (after compression)
    onFilesChange: (files: File[]) => void
    existingImages?: Array<{ url: string; id?: string }>
    compressToWebP?: boolean    // Default: true
    className?: string
}

export function ImageUpload({
    maxFiles = 10,
    minFiles = 2,
    maxSizeMB = 2,
    maxSizeKB = 120,
    onFilesChange,
    existingImages = [],
    compressToWebP = true,
    className
}: ImageUploadProps) {
    const [files, setFiles] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const [isCompressing, setIsCompressing] = useState(false)
    const [compressionProgress, setCompressionProgress] = useState(0)
    const [errors, setErrors] = useState<string[]>([])

    const totalImages = existingImages.length + files.length

    // Generate preview URL
    const createPreview = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = (e) => resolve(e.target?.result as string)
            reader.readAsDataURL(file)
        })
    }

    // Handle file selection
    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files || [])
        setErrors([])

        // Validate file count
        if (totalImages + selectedFiles.length > maxFiles) {
            setErrors([`Maksimal ${maxFiles} gambar. Anda sudah memiliki ${totalImages} gambar.`])
            return
        }

        // Validate file size before compression
        const oversizedFiles = selectedFiles.filter(file => file.size > maxSizeMB * 1024 * 1024)
        if (oversizedFiles.length > 0) {
            setErrors([`Beberapa file melebihi ${maxSizeMB}MB. Silakan pilih file yang lebih kecil.`])
            return
        }

        setIsCompressing(true)
        setCompressionProgress(0)

        try {
            // Compress images
            const compressionResults = await compressImages(selectedFiles, {
                maxSizeKB,
                format: compressToWebP ? 'webp' : 'jpeg'
            })

            setCompressionProgress(50)

            // Convert compressed blobs to files
            const compressedFiles = compressionResults.map((result, index) => {
                const originalName = selectedFiles[index].name
                const extension = compressToWebP ? 'webp' : originalName.split('.').pop() || 'jpg'
                const newName = originalName.replace(/\.[^/.]+$/, '') + `.${extension}`

                return blobToFile(result.blob, newName)
            })

            setCompressionProgress(75)

            // Create previews
            const newPreviews = await Promise.all(
                compressedFiles.map(file => createPreview(file))
            )

            // Update state
            const updatedFiles = [...files, ...compressedFiles]
            const updatedPreviews = [...previews, ...newPreviews]

            setFiles(updatedFiles)
            setPreviews(updatedPreviews)
            onFilesChange(updatedFiles)

            // Show compression stats
            if (compressionResults.length > 0) {
                const firstResult = compressionResults[0]
                const ratio = getCompressionRatio(firstResult.originalSize, firstResult.compressedSize)
                if (ratio > 0) {
                    console.log(`Gambar dikompresi: ${ratio}% lebih kecil`)
                }
            }

        } catch (error) {
            console.error('Compression failed:', error)
            setErrors(['Gagal mengkompresi gambar. Silakan coba lagi.'])
        } finally {
            setIsCompressing(false)
            setCompressionProgress(0)
            event.target.value = '' // Reset input
        }
    }

    const removeFile = (index: number) => {
        const updatedFiles = files.filter((_, i) => i !== index)
        const updatedPreviews = previews.filter((_, i) => i !== index)

        setFiles(updatedFiles)
        setPreviews(updatedPreviews)
        onFilesChange(updatedFiles)
    }

    const removeExistingImage = (index: number) => {
        // Note: In a real app, you'd make an API call to delete from server
        console.log('Remove existing image:', existingImages[index])
    }

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        const droppedFiles = Array.from(e.dataTransfer.files).filter(file =>
            file.type.startsWith('image/')
        )

        if (droppedFiles.length > 0) {
            const inputEvent = {
                target: { files: e.dataTransfer.files }
            } as React.ChangeEvent<HTMLInputElement>
            handleFileSelect(inputEvent)
        }
    }, [])

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
    }, [])

    return (
        <div className={className}>
            {/* Upload Area */}
            <div
                className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                    "border-gray-300 hover:border-blush bg-gray-50/50 hover:bg-blush/5",
                    isCompressing && "opacity-50 cursor-not-allowed"
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />

                <div className="space-y-2 mb-4">
                    <p className="text-lg font-medium">Upload Gambar Produk</p>
                    <p className="text-sm text-gray-600">
                        Tarik & drop gambar atau klik untuk memilih
                    </p>
                    <p className="text-xs text-gray-500">
                        Maksimal {maxFiles} gambar • Setiap gambar maksimal {maxSizeMB}MB •
                        Akan dikompresi menjadi {maxSizeKB}KB WebP
                    </p>
                </div>

                {/* Compression Progress */}
                {isCompressing && (
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Mengkompresi gambar...
                        </div>
                        <Progress value={compressionProgress} className="h-2" />
                    </div>
                )}

                {/* Upload Button */}
                <Button
                    type="button"
                    variant="outline"
                    className="relative"
                    disabled={isCompressing || totalImages >= maxFiles}
                >
                    {isCompressing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Memproses...
                        </>
                    ) : (
                        'Pilih Gambar'
                    )}
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={isCompressing || totalImages >= maxFiles}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </Button>

                {/* Error Messages */}
                {errors.length > 0 && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        {errors.map((error, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Existing Images */}
            {existingImages.length > 0 && (
                <div className="mt-6">
                    <h4 className="font-medium mb-3">Gambar yang sudah ada ({existingImages.length})</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {existingImages.map((image, index) => (
                            <div key={image.id || index} className="relative group">
                                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                    <img
                                        src={image.url}
                                        alt={`Existing ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeExistingImage(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* New Images Preview */}
            {files.length > 0 && (
                <div className="mt-6">
                    <h4 className="font-medium mb-3">
                        Gambar baru ({files.length})
                        {files.length < minFiles && (
                            <span className="ml-2 text-sm text-amber-600">
                                • Minimal {minFiles} gambar diperlukan
                            </span>
                        )}
                    </h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {files.map((file, index) => {
                            const preview = previews[index]
                            const sizeKB = Math.round(file.size / 1024)

                            return (
                                <div key={index} className="relative group">
                                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                        {preview ? (
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* File Info */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="truncate">{file.name}</div>
                                        <div>{sizeKB} KB • WebP</div>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>

                                    {/* Compression Badge */}
                                    {sizeKB <= 120 && (
                                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
                                            <Check className="h-3 w-3" />
                                            {sizeKB}KB
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* Validation Summary */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                                <div className={`h-3 w-3 rounded-full ${totalImages >= minFiles ? 'bg-green-500' : 'bg-amber-500'}`} />
                                <span>
                                    {totalImages >= minFiles ? '✓' : '⚠'} {totalImages}/{minFiles} gambar minimal
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`h-3 w-3 rounded-full ${totalImages <= maxFiles ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span>
                                    {totalImages <= maxFiles ? '✓' : '✗'} {totalImages}/{maxFiles} gambar maksimal
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-green-500" />
                                <span>Kompresi otomatis ke WebP ≤{maxSizeKB}KB</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}