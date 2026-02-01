// __tests__/components/layout/Container.test.tsx
import { render } from '@testing-library/react'
import { Container } from '@/components/layout/container'

describe('Container Component', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <Container>
        <div>Test Content</div>
      </Container>
    )
    
    expect(getByText('Test Content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <Container className="custom-class">
        <div>Test</div>
      </Container>
    )
    
    expect(container.firstChild).toHaveClass('custom-class')
    expect(container.firstChild).toHaveClass('mx-auto') // Default class
  })

  it('has default padding classes', () => {
    const { container } = render(
      <Container>
        <div>Test</div>
      </Container>
    )
    
    expect(container.firstChild).toHaveClass('px-4')
  })
})
