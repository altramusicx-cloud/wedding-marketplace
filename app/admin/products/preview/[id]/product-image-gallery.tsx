// app\admin\products\preview\[id]\product-image-gallery.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { ImageLightbox } from "@/components/shared/image-lightbox"

export function ProductImageGallery({ product, allImages }: { product: any, allImages: string[] }) {
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)

    const openLightbox = (index: number) => {
        setSelectedImageIndex(index)
        setLightboxOpen(true)
    }

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {allImages.map((url, index) => (
                    <button
                        key={index}
                        onClick={() => openLightbox(index)}
                        className="aspect-square rounded-lg overflow-hidden border bg-gray-100 relative group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all hover:shadow-md"
                    >
                        <Image
                            src={url}
                            alt={`${product.name} - gambar ${index + 1}`}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {url === product.thumbnail_url ? "⭐" : `#${index}`}
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
                                <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            <ImageLightbox
                images={allImages}
                initialIndex={selectedImageIndex}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                productName={product.name}
            />
        </>
    )
}