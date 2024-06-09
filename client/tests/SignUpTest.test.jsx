import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignUpAdmin from '../src/components/admins/SignUpAdmin';

vi.mock('../universal/MyToast', () => ({
  successToast: vi.fn(),
  errorToast: vi.fn(),
  MyToastContainer: () => <div data-testid="toast-container" />
}))

describe('SignUpAdmin Component', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('Render del componente', () => {
    render(<SignUpAdmin />)
    expect(screen.getByPlaceholderText('Usuario')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument()
    expect(screen.getByText('Crear un administrador')).toBeInTheDocument()
    expect(screen.getByLabelText('Permisos de edición')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Registrar/i })).toBeInTheDocument()
  })

  it('Manejo de cambios del input', () => {
    render(<SignUpAdmin />)
    
    const usernameInput = screen.getByPlaceholderText('Usuario')
    const passwordInput = screen.getByPlaceholderText('Contraseña')

    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    expect(usernameInput.value).toBe('testuser')
    expect(passwordInput.value).toBe('password123')
  })

  it('Alerta para campos vacíos', async () => {
    render(<SignUpAdmin />)
    
    fireEvent.click(screen.getByRole('button', { name: /Registrar/i }))
    
    expect(await screen.findByText('ALERTA: Se deben ingresar los campos.')).toBeInTheDocument()
  })

  it('Alerta de username y password idénticas', async () => {
    render(<SignUpAdmin />)
    
    fireEvent.change(screen.getByPlaceholderText('Usuario'), { target: { value: 'samevalue' } })
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'samevalue' } })
    fireEvent.click(screen.getByRole('button', { name: /Registrar/i }))
    
    expect(await screen.findByText('ALERTA: Los campos no pueden ser iguales.')).toBeInTheDocument()
  })

  it('Manejo de registro exitoso', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })

    render(<SignUpAdmin />)
    
    fireEvent.change(screen.getByPlaceholderText('Usuario'), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /Registrar/i }))

    await waitFor(() => expect(screen.getByPlaceholderText('Usuario').value).toBe(''))
    await waitFor(() => expect(screen.getByPlaceholderText('Contraseña').value).toBe(''))
  })

  it('Alerta de usuario existente', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
    })

    render(<SignUpAdmin />)
    
    fireEvent.change(screen.getByPlaceholderText('Usuario'), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /Registrar/i }))

    await waitFor(() => expect(screen.queryByText('Usuario Existente')).toBeInTheDocument())
  })

  it('Manejo de checkbox admin', () => {
    render(<SignUpAdmin />)
    
    const checkbox = screen.getByLabelText('Permisos de edición')
    expect(checkbox.checked).toBe(false)
    
    fireEvent.click(checkbox)
    expect(checkbox.checked).toBe(true)
    
    fireEvent.click(checkbox)
    expect(checkbox.checked).toBe(false)
  })
})
