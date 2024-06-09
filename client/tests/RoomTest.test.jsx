import React from 'react';
import { render, screen, fireEvent, waitFor, prettyDOM } from '@testing-library/react';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BrowserRouter } from 'react-router-dom';
import RoomAdmin, { update, Cama } from "../src/components/admins/RoomAdmin";

const API_URL = 'http://10.50.91.88:8008'

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
)

vi.mock('./Popup', () => ({
  __esModule: true,
  default: ({ trigger, type, id, fun, setTrigger, children }) => (
    <div>{trigger && <div>{children}</div>}</div>
  ),
}))

beforeEach(() => {
  vi.resetAllMocks()
})

describe('Update Component', () => {
  const setInfoM = 1
  const setInfoH = 2
  const setInfoA = 3
    
  it('Llama la API correcta', async () => {
    vi.spyOn(window, 'fetch').mockImplementationOnce(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    })
    
    update(setInfoM, setInfoH, setInfoA)
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/beds`)
  })
})

describe('Cama Component', () => {
  const defaultProps = {
    idCama: 1,
    idCliente: 1,
    color: '#8cbcfc',
    iconocama: 'icon.png',
    numCama: 1,
    nombre: 'John',
    carnet: '123456',
    apellidos: 'Doe',
    balance: 20,
    txtBalance: 'Debe: ',
    setInfoM: vi.fn(),
    setInfoH: vi.fn(),
    setInfoA: vi.fn(),
    admin: true,
  }
  
  beforeEach(() => {
    global.fetch = vi.fn();
  })
  
  const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route)
    return render(ui, { wrapper: BrowserRouter })
  }
  
  it('Render del componente', () => {
    renderWithRouter(<Cama {...defaultProps} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByAltText('...')).toBeInTheDocument()
    fireEvent.contextMenu(screen.getByText('1'))
    expect(screen.getByText('Debe: $20')).toBeInTheDocument()
  })
    
  it('Manejo del context menu', () => {
    renderWithRouter(<Cama {...defaultProps} />)
    const bedCard = screen.getByText('1')
    fireEvent.contextMenu(bedCard)
    expect(screen.getByText('Cama 1')).toBeInTheDocument()
  })
    
  it('Majeno de registro de pago', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true })
    
    renderWithRouter(<Cama {...defaultProps} />)
    fireEvent.contextMenu(screen.getByText('1'))

    fireEvent.mouseOver(screen.getByText('Debe: $20'))
    await waitFor(() => screen.getByTestId('payment-menu'))
    expect(screen.getByPlaceholderText('$20')).toBeInTheDocument()
    expect(screen.getByText('Pagar')).toBeInTheDocument()
    
    fireEvent.change(screen.getByPlaceholderText('$20'), { target: { value: '10' } })
    expect(screen.getByPlaceholderText('$20').value).toBe('10')
    fireEvent.click(screen.getByText('Pagar'))
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_URL}/beds/pagar`,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-type': 'application/json; charset=UTF-8' },
          body: JSON.stringify({
            id_cliente: defaultProps.idCliente,
            notas_p: 'Pago',
            monto_t: 10,
          }),
        })
      )
    })
  })

  it('Manejo de suma de servicios', async () => {
    renderWithRouter(<Cama {...defaultProps} />)
    fireEvent.contextMenu(screen.getByText('1'))
    
    fireEvent.mouseOver(screen.getByText('Servicios'))
    await waitFor(() => screen.getByTestId('services-menu'))
    
    fireEvent.click(screen.getByTestId('breakfast-plus'))
    expect(screen.getByTestId('breakfast-value').value).toBe('1')

    fireEvent.click(screen.getByTestId('breakfast-plus'))
    expect(screen.getByTestId('breakfast-value').value).toBe('2')
  })

  it('Manejo de resta de servicios', async () => {
    renderWithRouter(<Cama {...defaultProps} />)
    fireEvent.contextMenu(screen.getByText('1'))
    
    fireEvent.mouseOver(screen.getByText('Servicios'))
    await waitFor(() => screen.getByTestId('services-menu'))
    
    fireEvent.click(screen.getByTestId('breakfast-minus'))
    expect(screen.getByPlaceholderText('Desayuno: 0')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('breakfast-plus'))
    expect(screen.getByTestId('breakfast-value').value).toBe('1')

    fireEvent.click(screen.getByTestId('breakfast-minus'))
    expect(screen.getByTestId('breakfast-value').value).toBe('0')
  })
  
  it('Manejo de registro de servicios', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true })
    
    renderWithRouter(<Cama {...defaultProps} />)
    fireEvent.contextMenu(screen.getByText('1'))
    
    fireEvent.mouseOver(screen.getByText('Servicios'))
    await waitFor(() => screen.getByTestId('services-menu'))
    expect(screen.getByTestId('breakfast-value')).toBeInTheDocument()
    expect(screen.getByText('Registrar')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('breakfast-plus'))
    expect(screen.getByTestId('breakfast-value').value).toBe('1')
    fireEvent.click(screen.getByText('Registrar'))
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_URL}/beds/regServacio`,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-type': 'application/json; charset=UTF-8' },
          body: JSON.stringify({
            id_cliente: defaultProps.idCliente,
            id_servicio: 3,
            cant: '1',
          }),
        })
      )
    })
  })
})
