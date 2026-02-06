"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from "lucide-react"
import Image from "next/image"

interface ImageLightboxProps {
    images: string[]
    initialIndex?: number
    isOpen: boolean
    onClose: () => void
    productName?: string
}

export function ImageLightbox({
    images,
    initialIndex = 0,
    isOpen,
    onClose,
    productName = "Produk"
}: ImageLightboxProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex)
    const [zoomLevel, setZoomLevel] = useState(1)
    const [isDragging, setIsDragging] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    // Reset state ketika buka lightbox baru
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex)
            setZoomLevel(1)
            setPosition({ x: 0, y: 0 })
        }
    }, [isOpen, initialIndex])

    // Navigasi dengan keyboard
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return

            switch (e.key) {
                case "ArrowLeft":
                    handlePrev()
                    break
                case "ArrowRight":
                    handleNext()
                    break
                case "Escape":
                    onClose()
                    break
                case "+":
                case "=":
                    handleZoomIn()
                    break
                case "-":
                    handleZoomOut()
                    break
                case "0":
                    setZoomLevel(1)
                    setPosition({ x: 0, y: 0 })
                    break
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isOpen, currentIndex])

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
        setZoomLevel(1)
        setPosition({ x: 0, y: 0 })
    }

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
        setZoomLevel(1)
        setPosition({ x: 0, y: 0 })
    }

    const handleZoomIn = () => {
        setZoomLevel((prev) => Math.min(prev + 0.25, 3))
    }

    const handleZoomOut = () => {
        setZoomLevel((prev) => Math.max(prev - 0.25, 0.5))
    }

    const handleResetZoom = () => {
        setZoomLevel(1)
        setPosition({ x: 0, y: 0 })
    }

    const handleDownload = () => {
        const link = document.createElement("a")
        link.href = images[currentIndex]
        link.download = `${productName.replace(/[^a-z0-9]/gi, "_")}_${currentIndex + 1}.webp`
        link.click()
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        if (zoomLevel > 1) {
            setIsDragging(true)
            e.preventDefault()
        }
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || zoomLevel <= 1) return

        setPosition((prev) => ({
            x: prev.x + e.movementX,
            y: prev.y + e.movementY
        }))
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const currentImage = images[currentIndex]

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-black/95 border-0">
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
                    <div className="text-white">
                        <h3 className="font-medium truncate max-w-md">
                            {productName} - Gambar {currentIndex + 1} / {images.length}
                        </h3>
                        <p className="text-sm text-neutral-300">
                            {currentImage.split("/").pop()}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleDownload}
                            className="text-white hover:bg-white/20"
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="text-white hover:bg-white/20"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Main Image Container */}
                <div className="relative flex-1 flex items-center justify-center overflow-hidden p-4 pt-16 pb-24">
                    <div
                        className="relative"
                        style={{
                            transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                            transition: isDragging ? "none" : "transform 0.2s ease",
                            cursor: zoomLevel > 1 ? (isDragging ? "grabbing" : "grab") : "default"
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    >
                        <Image
                            src={currentImage}
                            alt={`Zoom ${productName} - gambar ${currentIndex + 1}`}
                            width={1200}
                            height={800}
                            className="max-w-full max-h-[70vh] object-contain"
                            unoptimized // Untuk image dari external URL
                            priority
                        />
                    </div>

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handlePrev}
                                className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </Button>
                        </>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="absolute bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Thumbnail Strip */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setCurrentIndex(index)
                                        setZoomLevel(1)
                                        setPosition({ x: 0, y: 0 })
                                    }}
                                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${currentIndex === index ? "border-blue-500 scale-105" : "border-transparent hover:border-neutral-400"}`}
                                >
                                    <Image
                                        src={img}
                                        alt={`Thumbnail ${index + 1}`}
                                        width={64}
                                        height={64}
                                        className="w-full h-full object-cover"
                                        unoptimized
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Zoom Controls */}
                        <div className="flex items-center gap-2 bg-black/50 rounded-lg p-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleZoomOut}
                                disabled={zoomLevel <= 0.5}
                                className="text-white hover:bg-white/20 h-8 w-8"
                            >
                                <ZoomOut className="h-4 w-4" />
                            </Button>

                            <div className="text-white text-sm min-w-[60px] text-center">
                                {Math.round(zoomLevel * 100)}%
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleZoomIn}
                                disabled={zoomLevel >= 3}
                                className="text-white hover:bg-white/20 h-8 w-8"
                            >
                                <ZoomIn className="h-4 w-4" />
                            </Button>

                            {zoomLevel > 1 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleResetZoom}
                                    className="text-white hover:bg-white/20 h-8 text-xs"
                                >
                                    Reset
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Zoom Instructions */}
                    {zoomLevel > 1 && (
                        <p className="text-center text-xs text-neutral-300 mt-2">
                            ?? Klik & drag untuk geser gambar | ESC untuk tutup
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}