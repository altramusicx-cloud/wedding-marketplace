// app/(public)/layout.tsx - COMPLETE PUBLIC LAYOUT
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BottomNav } from '@/components/layout/bottom-nav'
import { Container } from '@/components/layout/container'
import { Toaster } from '@/components/ui/toaster'

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            {/* HEADER - Tampil di semua halaman public */}
            <Header />
            
            {/* MAIN CONTENT dengan Container */}
            <main className="min-h-screen">
                <Container>
                    {children}
                </Container>
            </main>
            
            {/* BOTTOM NAV - Mobile only */}
            <BottomNav />
            
            {/* FOOTER */}
            <Footer />
            
            {/* TOASTER */}
            <Toaster />
        </>
    )
}
