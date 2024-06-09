import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { useAuth } from '../src/auth/AuthProvider';
import { API_URL } from '../src/App';
import ProfileAdmin from '../src/components/admins/ProfileAdmin';

vi.mock('../src/auth/AuthProvider')

describe('ProfileAdmin Component', () => {
  const mockUser = { id_usuario: 1, nombre_u: 'Test Admin', admin: true }
  const mockAuth = {
    getUser: vi.fn(() => mockUser),
    getRefreshToken: vi.fn(() => 'mock-token'),
    signOut: vi.fn(),
  }

  beforeEach(() => {
    useAuth.mockReturnValue(mockAuth)
  })

  it('Render del componente', () => {
    render(
      <BrowserRouter>
        <ProfileAdmin />
      </BrowserRouter>
    )
    expect(screen.getByText('Test Admin')).toBeInTheDocument()
  })

  it('Render de los botones', () => {
    render(
      <BrowserRouter>
        <ProfileAdmin />
      </BrowserRouter>
    )

    console.log(mockAuth.getUser())
    expect(screen.getByRole('button', { name: /Crear un administrador/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Cambiar contraseña/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Cerrar sesión/i })).toBeInTheDocument()
  })

  it('Manejo de cerrar sesión', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    )

    render(
      <BrowserRouter>
        <ProfileAdmin />
      </BrowserRouter>
    )

    const signOutButton = screen.getByRole('button', { name: /Cerrar sesión/i })
    fireEvent.click(signOutButton)

    expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/signout/`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `Bearer mock-token`,
      },
    })
  })

  it('Fetch de información del usuario', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ admin: true }),
      })
    )

    render(
      <BrowserRouter>
        <ProfileAdmin />
      </BrowserRouter>
    )

    expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/infouser`, {
      method: 'POST',
      body: JSON.stringify({ id_u: mockUser.id_usuario }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
  })
})
