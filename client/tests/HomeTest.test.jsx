import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { useAuth } from '../src/auth/AuthProvider';
import HomeAdmin from '../src/components/admins/HomeAdmin';

vi.mock('../src/auth/AuthProvider', () => ({
  useAuth: vi.fn()
}))

describe('HomeAdmin Component', () => {
  const mockUser = {
    nombre_u: 'Test User'
  }
  
  beforeEach(() => {
    useAuth.mockReturnValue({
      getUser: () => mockUser
    })
  })

  it('Render del componente', () => {
    render(
      <BrowserRouter>
        <HomeAdmin />
      </BrowserRouter>
    )
    
    const welcomeMessage = screen.getByText(/Test User/i);
    expect(welcomeMessage).toBeInTheDocument();
  })

  it('Botnones con link', () => {
    render(
      <BrowserRouter>
        <HomeAdmin />
      </BrowserRouter>
    )

    const buttons = [
      { text: 'Registro de Nuevo Cliente', link: '/usernew', iconTestId: 'RiUserAddFill' },
      { text: 'Generación de Nuevo Reporte', link: '/reports', iconTestId: 'IoDocumentAttach' },
      { text: 'Administración de Camas', link: '/beds', iconTestId: 'IoIosBed' },
      { text: 'Administración de Clientes', link: '/userlist', iconTestId: 'IoIosListBox' }
    ]

    buttons.forEach(button => {
      const buttonElement = screen.getByText(new RegExp(button.text, 'i'))
      expect(buttonElement.closest('a')).toHaveAttribute('href', button.link)
    })
  })
})
