// File: components/layout/footer.tsx
import Link from "next/link"
import { Heart, Phone, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
    const currentYear = new Date().getFullYear()

    const categories = [
        { name: "Venue", href: "/categories/venue" },
        { name: "Photographer", href: "/categories/photographer" },
        { name: "Catering", href: "/categories/catering" },
        { name: "Decoration", href: "/categories/decoration" },
        { name: "Wedding Dress", href: "/categories/wedding-dress" },
    ]

    const quickLinks = [
        { name: "Tentang Kami", href: "/about" },
        { name: "Cara Kerja", href: "/how-it-works" },
        { name: "Blog", href: "/blog" },
        { name: "FAQ", href: "/faq" },
        { name: "Kebijakan Privasi", href: "/privacy" },
    ]

    return (
        <footer className="bg-charcoal text-white mt-16">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blush">
                                <Heart className="h-6 w-6 text-charcoal" />
                            </div>
                            <span className="text-xl font-bold">
                                Wedding<span className="text-blush">Market</span>
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Marketplace wedding lokal pertama di Kalimantan yang membantu calon pengantin menemukan vendor terbaik.
                        </p>
                        <div className="flex gap-3">
                            <Button variant="outline" size="icon" className="border-gray-700 hover:bg-gray-800">
                                <span className="sr-only">Facebook</span>
                                <span className="text-sm">FB</span>
                            </Button>
                            <Button variant="outline" size="icon" className="border-gray-700 hover:bg-gray-800">
                                <span className="sr-only">Instagram</span>
                                <span className="text-sm">IG</span>
                            </Button>
                            <Button variant="outline" size="icon" className="border-gray-700 hover:bg-gray-800">
                                <span className="sr-only">TikTok</span>
                                <span className="text-sm">TT</span>
                            </Button>
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Kategori</h3>
                        <ul className="space-y-2">
                            {categories.map((category) => (
                                <li key={category.name}>
                                    <Link
                                        href={category.href}
                                        className="text-gray-400 hover:text-blush transition-colors text-sm"
                                    >
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Tautan Cepat</h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-blush transition-colors text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Hubungi Kami</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-gray-400 text-sm">
                                <Phone className="h-4 w-4 text-blush" />
                                <span>+62 812 3456 7890</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 text-sm">
                                <Mail className="h-4 w-4 text-blush" />
                                <span>hello@weddingmarket.co.id</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-400 text-sm">
                                <MapPin className="h-4 w-4 text-blush mt-0.5" />
                                <span>Jl. Wedding No. 123, Banjarmasin, Kalimantan Selatan</span>
                            </li>
                        </ul>

                        <div className="mt-6">
                            <Button className="w-full bg-blush hover:bg-blush/90 text-charcoal">
                                Daftar Sebagai Vendor
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        © {currentYear} WeddingMarket. Dibuat dengan ❤️ untuk pasangan Indonesia.
                        <span className="block md:inline mt-2 md:mt-0 md:ml-4">
                            Semua hak dilindungi undang-undang.
                        </span>
                    </p>
                </div>
            </div>
        </footer>
    )
}