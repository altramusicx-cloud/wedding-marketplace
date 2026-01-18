// components/home/hero-section.tsx
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-blush/10 to-sage/10">
            <div className="container-custom py-16 md:py-24">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border mb-6">
                        <Sparkles className="h-4 w-4 text-blush" />
                        <span className="text-sm font-medium">Marketplace Wedding Pertama di Kalimantan</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-heading font-bold text-charcoal mb-6">
                        Temukan Vendor
                        <span className="block text-blush">Pernikahan Terbaik</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Ribuan calon pengantin telah menemukan vendor ideal mereka di WeddingMarket.
                        Dari venue, photographer, hingga catering — semua dalam satu platform.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="bg-blush hover:bg-blush-dark text-white">
                            <Link href="/categories">
                                Jelajahi Kategori
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href="/register?type=vendor">
                                Daftar sebagai Vendor
                            </Link>
                        </Button>
                    </div>

                    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <div className="text-2xl font-bold text-charcoal">500+</div>
                            <div className="text-gray-600 text-sm">Vendor Terdaftar</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-charcoal">50+</div>
                            <div className="text-gray-600 text-sm">Kota di Kalimantan</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-charcoal">98%</div>
                            <div className="text-gray-600 text-sm">Kepuasan Pengguna</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-charcoal">24/7</div>
                            <div className="text-gray-600 text-sm">Support WhatsApp</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-blush/10 blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-sage/10 blur-3xl"></div>
        </div>
    )
}