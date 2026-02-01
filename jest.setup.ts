// Fixed jest.setup.ts - No JSX in .ts file!
import '@testing-library/jest-dom';

// Polyfill untuk Node.js environment
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock untuk Next.js Image component
jest.mock('next/image', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: function NextImage(props: any) {
      const { src, alt, width, height, ...rest } = props;
      // Simple img tag untuk testing
      return React.createElement('img', {
        src,
        alt,
        width,
        height,
        ...rest,
        style: { ...props.style, objectFit: 'cover' }
      });
    },
  };
});

// Mock untuk Next.js Link
jest.mock('next/link', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: function NextLink({ children, href, ...props }: any) {
      return React.createElement('a', { href: href || '', ...props }, children);
    },
  };
});

// Mock untuk lucide-react icons
jest.mock('lucide-react', () => ({
  ArrowRight: function MockArrowRight(props: any) {
    const React = require('react');
    return React.createElement('svg', { ...props, 'data-testid': 'arrow-right' });
  },
  Sparkles: function MockSparkles(props: any) {
    const React = require('react');
    return React.createElement('svg', { ...props, 'data-testid': 'sparkles' });
  },
  Search: function MockSearch(props: any) {
    const React = require('react');
    return React.createElement('svg', { ...props, 'data-testid': 'search' });
  },
  __esModule: true,
}));

// Setup untuk testing-library
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Suppress specific warnings
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (typeof args[0] === 'string') {
      // Ignore specific React 18 warnings
      if (args[0].includes('ReactDOM.render is no longer supported')) return;
      if (args[0].includes('Warning: useLayoutEffect does nothing on the server')) return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
