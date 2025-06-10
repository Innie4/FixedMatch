import { render, screen } from '@testing-library/react'
import { PackageDetailsDialog } from '../PackageDetailsDialog'
import { vi } from 'vitest'

describe('PackageDetailsDialog', () => {
  const mockOnClose = vi.fn()

  const mockPackage = {
    id: 1,
    name: 'Test Package',
    description: 'Test Description',
    durations: {
      twoWeeks: { price: 10, enabled: true },
      oneMonth: { price: 20, enabled: true },
      threeMonths: { price: 50, enabled: true },
      sixMonths: { price: 90, enabled: true },
    },
    countries: ['US', 'UK'],
    status: 'active' as const,
    subscribers: 100,
    revenue: 5000,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-02',
  }

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    package: mockPackage,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly with package data', () => {
    render(<PackageDetailsDialog {...defaultProps} />)

    expect(screen.getByText('Test Package')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('active')).toBeInTheDocument()
    expect(screen.getByText('United States, United Kingdom')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('5,000')).toBeInTheDocument()
    expect(screen.getByText('$10')).toBeInTheDocument()
  })

  it('renders global availability when no countries are selected', () => {
    const globalPackage = {
      ...mockPackage,
      countries: [],
    }

    render(<PackageDetailsDialog {...defaultProps} package={globalPackage} />)

    expect(screen.getByText('Global')).toBeInTheDocument()
  })

  it('renders disabled durations correctly', () => {
    const packageWithDisabledDurations = {
      ...mockPackage,
      durations: {
        ...mockPackage.durations,
        twoWeeks: { price: 10, enabled: false },
      },
    }

    render(<PackageDetailsDialog {...defaultProps} package={packageWithDisabledDurations} />)

    const twoWeeksElement = screen.getByText('2 Weeks').closest('div')
    expect(twoWeeksElement).toHaveClass('opacity-50')
  })

  it('does not render when package is null', () => {
    render(<PackageDetailsDialog {...defaultProps} package={null} />)

    expect(screen.queryByText('Test Package')).not.toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(<PackageDetailsDialog {...defaultProps} isOpen={false} />)

    expect(screen.queryByText('Test Package')).not.toBeInTheDocument()
  })

  it('formats dates correctly', () => {
    render(<PackageDetailsDialog {...defaultProps} />)

    expect(screen.getByText(/created jan 1, 2024/i)).toBeInTheDocument()
    expect(screen.getByText(/updated jan 2, 2024/i)).toBeInTheDocument()
  })
}) 