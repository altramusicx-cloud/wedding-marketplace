// File: components/product/product-gallery.tsx
"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import Image from 'next/image'

interface ProductGalleryProps {
    images: string[]
    productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [isZoomed, setIsZoomed] = useState(false)

    const mainImage = images[selectedIndex] || "/placeholder-image.jpg"

    const nextImage = () => {
        setSelectedIndex((prev) => (prev + 1) % images.length)
    }

    const prevImage = () => {
        setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 group">
                <Image
                    src={mainImage}
                    alt={`${productName} - Gambar ${selectedIndex + 1}`}
                    width={800}
                    height={800}
                    className="w-full h-full object-cover"
                />

                {/* Navigation Buttons */}
                {images.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg"
                            onClick={prevImage}
                            disabled={selectedIndex === 0}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg"
                            onClick={nextImage}
                            disabled={selectedIndex === images.length - 1}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </>
                )}

                {/* Zoom Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg"
                    onClick={() => setIsZoomed(true)}
                >
                    <ZoomIn className="h-5 w-5" />
                </Button>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                    {selectedIndex + 1} / {images.length}
                </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={cn(
                                "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                                selectedIndex === index
                                    ? "border-blush ring-2 ring-blush/20"
                                    : "border-gray-200 hover:border-gray-300"
                            )}
                        >
                            <Image
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Zoom Modal */}
            <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
                <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
                    <div className="relative h-[80vh]">
                        <Image
                            src={mainImage}
                            alt={`${productName} - Zoom`}
                            width={1200}
                            height={1200}
                            className="w-full h-full object-contain"
                            quality={100} // High quality untuk zoom
                        />
                        <div className="absolute top-4 right-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="bg-white/80 backdrop-blur-sm"
                                onClick={() => setIsZoomed(false)}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}