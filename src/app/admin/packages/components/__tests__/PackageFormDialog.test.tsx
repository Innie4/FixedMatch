import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PackageFormDialog } from '../PackageFormDialog'
import { vi } from 'vitest'

describe('PackageFormDialog', () => {
  const mockOnSave = vi.fn()
  const mockOnClose = vi.fn()

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSave: mockOnSave,
    initialData: null,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders create package form correctly', () => {
    render(<PackageFormDialog {...defaultProps} />)

    expect(screen.getByText('Create Package')).toBeInTheDocument()
    expect(screen.getByLabelText(/package name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByText(/durations & pricing/i)).toBeInTheDocument()
    expect(screen.getByText(/availability/i)).toBeInTheDocument()
  })

  it('renders edit package form with initial data', () => {
    const initialData = {
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
    }

    render(<PackageFormDialog {...defaultProps} initialData={initialData} />)

    expect(screen.getByText('Edit Package')).toBeInTheDocument()
    expect(screen.getByLabelText(/package name/i)).toHaveValue('Test Package')
    expect(screen.getByLabelText(/description/i)).toHaveValue('Test Description')
  })

  it('validates required fields', async () => {
    render(<PackageFormDialog {...defaultProps} />)

    const submitButton = screen.getByRole('button', { name: /create package/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/description is required/i)).toBeInTheDocument()
    })

    expect(mockOnSave).not.toHaveBeenCalled()
  })

  it('submits form with valid data', async () => {
    render(<PackageFormDialog {...defaultProps} />)

    await userEvent.type(screen.getByLabelText(/package name/i), 'Test Package')
    await userEvent.type(screen.getByLabelText(/description/i), 'Test Description')

    const submitButton = screen.getByRole('button', { name: /create package/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        name: 'Test Package',
        description: 'Test Description',
        durations: {
          twoWeeks: { price: 0, enabled: true },
          oneMonth: { price: 0, enabled: true },
          threeMonths: { price: 0, enabled: true },
          sixMonths: { price: 0, enabled: true },
        },
        countries: [],
        status: 'active',
      })
    })
  })

  it('handles duration price changes', async () => {
    render(<PackageFormDialog {...defaultProps} />)

    const twoWeeksPriceInput = screen.getByLabelText(/2 weeks price/i)
    await userEvent.type(twoWeeksPriceInput, '15')

    const submitButton = screen.getByRole('button', { name: /create package/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          durations: expect.objectContaining({
            twoWeeks: { price: 15, enabled: true },
          }),
        })
      )
    })
  })

  it('handles country selection', async () => {
    render(<PackageFormDialog {...defaultProps} />)

    const usCheckbox = screen.getByLabelText(/united states/i)
    const ukCheckbox = screen.getByLabelText(/united kingdom/i)

    await userEvent.click(usCheckbox)
    await userEvent.click(ukCheckbox)

    const submitButton = screen.getByRole('button', { name: /create package/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          countries: ['US', 'UK'],
        })
      )
    })
  })

  it('handles status toggle', async () => {
    render(<PackageFormDialog {...defaultProps} />)

    const statusSwitch = screen.getByRole('switch', { name: /status/i })
    fireEvent.click(statusSwitch)

    const submitButton = screen.getByRole('button', { name: /create package/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'inactive',
        })
      )
    })
  })
}) 