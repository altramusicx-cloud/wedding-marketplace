import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingBag, User, Menu } from 'lucide-react'

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container-custom flex h-16 items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blush">
                        <ShoppingBag className="h-6 w-6 text-charcoal" />
                    </div>
                    <Link href="/" className="text-xl font-bold text-charcoal">
                        Wedding<span className="text-blush">Market</span>
                    </Link>
                </div>

                {/* Navigation - Desktop */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/" className="text-sm font-medium hover:text-blush transition-colors">
                        Beranda
                    </Link>
                    <Link href="/categories" className="text-sm font-medium hover:text-blush transition-colors">
                        Kategori
                    </Link>
                    <Link href="/vendors" className="text-sm font-medium hover:text-blush transition-colors">
                        Vendor
                    </Link>
                    <Link href="/about" className="text-sm font-medium hover:text-blush transition-colors">
                        Tentang
                    </Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                    </Button>

                    <Button variant="ghost" size="icon">
                        <User className="h-5 w-5" />
                    </Button>

                    <Button className="bg-blush hover:bg-blush/90 text-charcoal">
                        Daftar Vendor
                    </Button>
                </div>
            </div>
        </header>
    )
}