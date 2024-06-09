import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import Popup from '../src/components/universal/Popup';

vi.mock('../../auth/AuthProvider', () => ({
  useAuth: () => ({
    getUser: () => ({ id_usuario: 123 }),
  }),
}))

describe('Popup Component', () => {
  const mockSetTrigger = vi.fn()
  const mockFun = vi.fn()

  const defaultProps = {
    trigger: true,
    setTrigger: mockSetTrigger,
    fun: mockFun,
    type: 0,
    id: 456,
  }

  it('Render de componente tipo 0', () => {
    render(<Popup {...defaultProps}>Popup Content</Popup>)
    expect(screen.getByText('Popup Content')).toBeInTheDocument()
    expect(screen.getByText('Aceptar')).toBeInTheDocument()
    expect(screen.getByText('Cancelar')).toBeInTheDocument()
  })

  it('Render de componente tipo 1', () => {
    render(<Popup {...defaultProps} type={1}>Popup Content</Popup>)
    expect(screen.getByText('Popup Content')).toBeInTheDocument()
    expect(screen.getByText('Vetar')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Razón de Veto:')).toBeInTheDocument()
  })

  it('Render de componente tipo 2', () => {
    render(<Popup {...defaultProps} type={2}>Popup Content</Popup>)
    expect(screen.getByText('Popup Content')).toBeInTheDocument()
    expect(screen.getByText('Aceptar')).toBeInTheDocument()
  })

  it('Manejo de aceptar tipo 0', () => {
    render(<Popup {...defaultProps}>Popup Content</Popup>)
    fireEvent.click(screen.getByText('Aceptar'))
    expect(mockFun).toHaveBeenCalledWith(456)
    expect(mockSetTrigger).toHaveBeenCalledWith({ trigger: false, type: -1 })
  })

  it('Manejo de aceptar tipo 1', () => {
    render(<Popup {...defaultProps} type={1}>Popup Content</Popup>)
    fireEvent.change(screen.getByPlaceholderText('Razón de Veto:'), { target: { value: 'Test Note' } })
    fireEvent.click(screen.getByText('Vetar'))
    // expect(mockFun).toHaveBeenCalledWith(123, 456, 'Test Note')
    expect(mockSetTrigger).toHaveBeenCalledWith({ trigger: false, type: -1 })
  })

  it('Manejo de aceptar tipo 2', () => {
    render(<Popup {...defaultProps} type={2}>Popup Content</Popup>)
    fireEvent.click(screen.getByText('Aceptar'))
    expect(mockFun).toHaveBeenCalledWith('')
    expect(mockSetTrigger).toHaveBeenCalledWith({ trigger: false, type: -1 })
  })

  it('Manejo de cancelar', () => {
    render(<Popup {...defaultProps}>Popup Content</Popup>)
    fireEvent.click(screen.getByText('Cancelar'))
    expect(mockSetTrigger).toHaveBeenCalledWith({ trigger: false, type: -1 })
  })

  it('Manejo de cancelar tipo 1', () => {
    render(<Popup {...defaultProps} type={1}>Popup Content</Popup>)
    fireEvent.change(screen.getByPlaceholderText('Razón de Veto:'), { target: { value: 'Test Note' } })
    expect(screen.getByDisplayValue('Test Note')).toBeInTheDocument()
  })
})
