// components/home/hero-section.tsx
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-blush/10 to-sage/10">
            {/* REDUCED FURTHER: py-6 md:py-8 (dari py-8 md:py-12) */}
            <div className="container-custom py-6 md:py-8">
                <div className="max-w-2xl mx-auto text-center">
                    {/* Badge - lebih kecil */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border mb-4">
                        <Sparkles className="h-3 w-3 text-blush" />
                        <span className="text-xs font-medium">Marketplace Wedding Kalimantan</span>
                    </div>

                    {/* Heading - lebih kecil */}
                    <h1 className="text-2xl md:text-4xl font-heading font-bold text-charcoal mb-3">
                        Temukan Vendor
                        <span className="block text-blush">Pernikahan Terbaik</span>
                    </h1>

                    {/* Description - lebih kecil */}
                    <p className="text-sm md:text-base text-gray-600 mb-5 max-w-xl mx-auto leading-relaxed">
                        Temukan vendor pernikahan terpercaya di Kalimantan. Foto, dekorasi, catering, venue, dan lebih banyak lagi.
                    </p>


                </div>
            </div>

            {/* Decorative elements - lebih kecil */}
            <div className="absolute top-4 left-4 w-20 h-20 rounded-full bg-blush/10 blur-xl"></div>
            <div className="absolute bottom-4 right-4 w-24 h-24 rounded-full bg-sage/10 blur-xl"></div>
        </div>
    )
}