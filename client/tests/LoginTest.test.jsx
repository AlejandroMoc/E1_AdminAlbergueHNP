import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from '../src/auth/AuthProvider';
import LoginAdmin from '../src/components/admins/LoginAdmin';

vi.mock('../src/auth/AuthProvider')
vi.mock('../src/components/universal/MyToast.jsx', () => ({
  successToast: vi.fn(),
}));
vi.mock('../../assets/vectors/logo_hnp.svg', () => 'logo_hnp.svg')

const mockSaveUser = vi.fn()

useAuth.mockReturnValue({
  isAuthenticated: false,
  saveUser: mockSaveUser,
})

const mockFetchError = () =>
  vi.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({ ok: false }))

describe('LoginAdmin Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Render del componente', () => {
    render(
      <MemoryRouter>
        <LoginAdmin />
      </MemoryRouter>
    )

    expect(screen.getByText('Administrador del Albergue')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Usuario')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument()
  })

  it('Manejo de cambios en el input', () => {
    render(
      <MemoryRouter>
        <LoginAdmin />
      </MemoryRouter>
    )

    const usernameInput = screen.getByPlaceholderText('Usuario')
    const passwordInput = screen.getByPlaceholderText('Contraseña')

    fireEvent.change(usernameInput, { target: { value: 'testUser' } })
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } })

    expect(usernameInput.value).toBe('testUser')
    expect(passwordInput.value).toBe('testPassword')
  })

  it('Manejo de credenciales incorrectas', async () => {
    mockFetchError()

    render(
      <MemoryRouter>
        <LoginAdmin />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText('Usuario'), {
      target: { value: 'wrongUser' },
    })
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: 'wrongPassword' },
    })
    fireEvent.click(screen.getByText('Iniciar sesión'))

    await waitFor(() => {
      expect(screen.getByText('Credenciales incorrectas. Intente de nuevo')).toBeInTheDocument()
    })
  })

  it('Manejo de credenciales correctas', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      saveUser: mockSaveUser,
    })

    render(
      <MemoryRouter>
        <LoginAdmin />
      </MemoryRouter>
    )

    expect(screen.queryByText('Iniciar sesión')).not.toBeInTheDocument()
  })
})
