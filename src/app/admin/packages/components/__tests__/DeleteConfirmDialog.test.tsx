import { render, screen, fireEvent } from '@testing-library/react'
import { DeleteConfirmDialog } from '../DeleteConfirmDialog'
import { vi } from 'vitest'

describe('DeleteConfirmDialog', () => {
  const mockOnClose = vi.fn()
  const mockOnConfirm = vi.fn()

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    packageName: 'Test Package',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    render(<DeleteConfirmDialog {...defaultProps} />)

    expect(screen.getByText('Delete Package')).toBeInTheDocument()
    expect(screen.getByText(/are you sure you want to delete the package/i)).toBeInTheDocument()
    expect(screen.getByText('Test Package')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete package/i })).toBeInTheDocument()
  })

  it('calls onClose when cancel button is clicked', () => {
    render(<DeleteConfirmDialog {...defaultProps} />)

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalled()
    expect(mockOnConfirm).not.toHaveBeenCalled()
  })

  it('calls onConfirm and onClose when delete button is clicked', () => {
    render(<DeleteConfirmDialog {...defaultProps} />)

    const deleteButton = screen.getByRole('button', { name: /delete package/i })
    fireEvent.click(deleteButton)

    expect(mockOnConfirm).toHaveBeenCalled()
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('does not render when isOpen is false', () => {
    render(<DeleteConfirmDialog {...defaultProps} isOpen={false} />)

    expect(screen.queryByText('Delete Package')).not.toBeInTheDocument()
  })
}) 