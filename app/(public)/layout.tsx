// app/(public)/layout.tsx - WITH HEADER
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BottomNav } from '@/components/layout/bottom-nav'
import { Container } from '@/components/layout/container'

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Header />
            <main className="min-h-screen">
                <Container>
                    {children}
                </Container>
            </main>
            <BottomNav />
            <Footer />
        </>
    )
}
