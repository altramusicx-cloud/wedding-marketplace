// __tests__/components/home/HeroSection.test.tsx
import { render, screen } from '@testing-library/react'
import { HeroSection } from '@/components/home/hero-section'

describe('HeroSection Component', () => {
  it('renders the wedding marketplace title', () => {
    render(<HeroSection />)

    // Cek judul utama - ada 2 elemen dengan "Temukan Vendor"
    const titleElements = screen.getAllByText(/Temukan Vendor/i)
    expect(titleElements.length).toBe(2) // 1 di heading, 1 di paragraf
    
    // Cek heading khusus
    expect(screen.getByText(/Pernikahan Terbaik/i)).toBeInTheDocument()
    
    // Cek subtitle lengkap
    expect(screen.getByText(/Temukan vendor pernikahan terpercaya di Kalimantan/i)).toBeInTheDocument()
  })

  it('displays the marketplace badge', () => {
    render(<HeroSection />)
    
    expect(screen.getByText(/Marketplace Wedding Kalimantan/i)).toBeInTheDocument()
  })

  it('has correct container styling', () => {
    const { container } = render(<HeroSection />)
    
    // Cek container-custom class
    const containerDiv = container.querySelector('.container-custom')
    expect(containerDiv).toBeInTheDocument()
    
    // Cek gradient background classes
    const heroDiv = container.firstChild as HTMLElement
    expect(heroDiv).toHaveClass('bg-gradient-to-br')
    expect(heroDiv).toHaveClass('from-blush/10')
    expect(heroDiv).toHaveClass('to-sage/10')
  })
})
