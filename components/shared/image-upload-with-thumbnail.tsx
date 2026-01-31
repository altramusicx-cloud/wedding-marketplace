"use client"

import { ImageUpload } from "@/components/shared/image-upload"
import { cn } from "@/lib/utils"

interface ImageUploadWithThumbnailProps {
  maxFiles?: number
  maxSizeMB?: number
  maxSizeKB?: number
  onFilesChange: (files: File[]) => void
  onThumbnailChange?: (thumbnailIndex: number) => void
  existingImages?: Array<{ url: string; id?: string }>
  compressToWebP?: boolean
  className?: string
  selectedThumbnailIndex?: number
}

export function ImageUploadWithThumbnail({
  maxFiles = 10,
  maxSizeMB = 8,
  maxSizeKB = 120,
  onFilesChange,
  onThumbnailChange,
  existingImages = [],
  compressToWebP = true,
  className,
  selectedThumbnailIndex = 0
}: ImageUploadWithThumbnailProps) {
  
  const handleThumbnailSelect = (index: number) => {
    onThumbnailChange?.(index)
  }

  return (
    <div className={className}>
      <ImageUpload
        maxFiles={maxFiles}
        maxSizeMB={maxSizeMB}
        maxSizeKB={maxSizeKB}
        onFilesChange={onFilesChange}
        existingImages={existingImages}
        compressToWebP={compressToWebP}
        selectedThumbnailIndex={selectedThumbnailIndex}
        onThumbnailSelect={handleThumbnailSelect}
      />
    </div>
  )
}
