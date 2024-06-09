import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UserListAdmin, { vetarCliente, desvetarCliente, eliminarCliente, handleDateFormat, handleKeyDown } from "../src/components/admins/UserListAdmin";

const API_URL = 'http://10.50.91.88:8008'

vi.mock('./useAuth', () => ({
    useAuth: () => ({
        getUser: () => ({ id_usuario: 1 })
    })
}))

global.fetch = vi.fn()
const mockFetch = fetch


const adminInfoResponse = { admin: true }
const clientsResponse = [
  {
    id_cliente: 1,
    nombre_c: 'John',
    apellidos_c: 'Doe',
    carnet: '1234',
    vetado: false,
    tipo_cliente: true,
    fecha_i: '2023-01-01',
    lugar_o: 'New York',
    total: 100
  }
]

beforeEach(() => {
    mockFetch.mockClear()
    mockFetch.mockImplementation((url) => {
      if (url.includes('/infouser')) {
        return Promise.resolve({
          json: () => Promise.resolve(adminInfoResponse)
        })
      }
      if (url.includes('/allclients')) {
        return Promise.resolve({
          json: () => Promise.resolve(clientsResponse)
        })
      }
      return Promise.reject(new Error('Unknown API endpoint'))
    })
  })

describe('UserlistAdmin', () => {
    it('Mensaje de error date vacío', async () => {
        render(<UserListAdmin />)
        await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2))
        expect(screen.getAllByTestId('date-error-message').length).toBe(1)
    })

    it('Mensaje de error debt vacío', async () => {
        render(<UserListAdmin />)
        await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2))
        expect(screen.getAllByTestId('debt-error-message').length).toBe(1)
    })

    it('Mensaje de sin resultados cuando no hay datos', async () => {
        render(<UserListAdmin />)
        await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2))
        expect(screen.getByText('No existen resultados que coincidan.')).toBeInTheDocument()
    })

    it('Views', async () => {
        render(<UserListAdmin />)
        await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2))
    
        const viewRadio = screen.getByLabelText('Huéspedes')
    
        fireEvent.click(viewRadio)
    
        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('someclients'), expect.any(Object))
        })
    })
})

describe('Interacciones UserlistAdmin', () => {
    it('Cambia cuando se clickea otra view', async () => {
        render(<UserListAdmin />)
        await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2))
        fireEvent.click(screen.getByLabelText('Visitas Previas'))
        expect(screen.getByLabelText('Visitas Previas')).toBeChecked()
    })
})

describe('vetarCliente', () => {
    const id_u = 1
    const id_c = 2
    const n_v = 3
    
    it('Llama la API correcta', async () => {
        vi.spyOn(window, 'fetch').mockImplementationOnce(() => {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({}),
            })
        })
        
        vetarCliente(id_u, id_c, n_v)
        
        expect(fetch).toHaveBeenCalledWith(`${API_URL}/banclient`, {
            method: "POST",
            body: JSON.stringify({ id_u, id_c, n_v }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
    })
})

describe('desvetarCliente', () => {
    const id_c = 2
    
    it('Llama la API correcta', async () => {
        vi.spyOn(window, 'fetch').mockImplementationOnce(() => {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({}),
            })
        })
        
        desvetarCliente(id_c)
        
        expect(fetch).toHaveBeenCalledWith(`${API_URL}/unbanclient`, {
            method: "POST",
            body: JSON.stringify({ id_c }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
    })
})

describe('eliminarCliente', () => {
    const id_c = 2
    
    it('Llama la API correcta', async () => {
        vi.spyOn(window, 'fetch').mockImplementationOnce(() => {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({}),
            })
        })
        
        eliminarCliente(id_c)
        
        expect(fetch).toHaveBeenCalledWith(`${API_URL}/deleteclient`, {
            method: "POST",
            body: JSON.stringify({ id_c }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
    })
})

describe('handleDateFormat', () => {
    it('Formatea de forma correcta la fecha', () => {
        const date = '2024-05-31 12:26:37.381864'
        const localDate = handleDateFormat(date)
        expect(localDate).toBe('31/5/2024, 12:26:37')
    })
})

describe('handleKeyDowwn', () => {
    it('Previene letras de llamarse (A-Z, a-z)', () => {
        const preventDefaultMock = vi.fn();
        const event = { keyCode: 65 }; // 'A'
    
        handleKeyDown({ preventDefault: preventDefaultMock, ...event })
    
        expect(preventDefaultMock).toHaveBeenCalled()
    })
    
    it('Permite la llamada de números', () => {
        const preventDefaultMock = vi.fn();
        const event = { keyCode: 49 }; // '1'
    
        handleKeyDown({ preventDefault: preventDefaultMock, ...event })
    
        expect(preventDefaultMock).not.toHaveBeenCalled();
    })
})

describe('Rango de fechas', () => {
    it('Llamada exitosa', async () => {
        render(<UserListAdmin />)
        await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2))
    
        const startDatePicker = screen.getByPlaceholderText('Inicio (DD/MM/YY)')
        const endDatePicker = screen.getByPlaceholderText('Fin (DD/MM/YY)')
    
        fireEvent.change(startDatePicker, { target: { value: '01/01/21' } })
        fireEvent.change(endDatePicker, { target: { value: '31/12/21' } })
    
        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('someclients'), expect.any(Object))
        })
    })

    it('ALERTA: Se necesitan 2 fechas', async () => {
        render(<UserListAdmin />)
        await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2))
    
        const startDatePicker = screen.getByPlaceholderText('Inicio (DD/MM/YY)')
    
        fireEvent.change(startDatePicker, { target: { value: '01/01/21' } })
    
        await waitFor(() => {
            expect(screen.getByText('ALERTA: Se necesitan 2 fechas')).toBeInTheDocument()
        })
    })

    it('ALERTA: Fecha de inicio posterior a fecha de fin', async () => {
        render(<UserListAdmin />)
        await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2))
    
        const startDatePicker = screen.getByPlaceholderText('Inicio (DD/MM/YY)')
        const endDatePicker = screen.getByPlaceholderText('Fin (DD/MM/YY)')
    
        fireEvent.change(startDatePicker, { target: { value: '01/01/21' } })
        fireEvent.change(endDatePicker, { target: { value: '31/12/20' } })
    
        await waitFor(() => {
            expect(screen.getByText('ALERTA: Fecha de inicio posterior a fecha de fin')).toBeInTheDocument()
        })
    })

    it('ALERTA: Fecha anterior al año 2020', async () => {
        render(<UserListAdmin />)
        await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2))
    
        const startDatePicker = screen.getByPlaceholderText('Inicio (DD/MM/YY)')
        const endDatePicker = screen.getByPlaceholderText('Fin (DD/MM/YY)')
    
        fireEvent.change(startDatePicker, { target: { value: '01/01/19' } })
        fireEvent.change(endDatePicker, { target: { value: '31/12/21' } })
    
        await waitFor(() => {
            expect(screen.getByText('ALERTA: Fecha anterior al año 2020')).toBeInTheDocument()
        })
    })
})

describe('Rango de deudas', () => {
    it('Llamada exitosa', async () => {
        render(<UserListAdmin />)
        await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2))
    
        const minDebtInput = screen.getByPlaceholderText('Deuda Mínima')
        const maxDebtInput = screen.getByPlaceholderText('Deuda Máxima')
    
        fireEvent.change(minDebtInput, { target: { value: '100' } })
        fireEvent.change(maxDebtInput, { target: { value: '500' } })
    
        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('someclients'), expect.any(Object))
        })
    })

    it('ALERTA: Se necesitan 2 deudas', async () => {
        render(<UserListAdmin />)
        await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2))
    
        const minDebtInput = screen.getByPlaceholderText('Deuda Mínima')
    
        fireEvent.change(minDebtInput, { target: { value: '100' } })
    
        await waitFor(() => {
            expect(screen.getByText('ALERTA: Se necesitan 2 deudas')).toBeInTheDocument()
        })
    })

    it('ALERTA: Deuda menor a 0', async () => {
        render(<UserListAdmin />)
        await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2))
    
        const minDebtInput = screen.getByPlaceholderText('Deuda Mínima')
        const maxDebtInput = screen.getByPlaceholderText('Deuda Máxima')
    
        fireEvent.change(minDebtInput, { target: { value: '-100' } })
        fireEvent.change(maxDebtInput, { target: { value: '500' } })
    
        await waitFor(() => {
            expect(screen.getByText('ALERTA: Deuda menor a 0')).toBeInTheDocument()
        })
    })

    it('ALERTA: Deuda mayor a 10,000', async () => {
        render(<UserListAdmin />)
        await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2))
    
        const minDebtInput = screen.getByPlaceholderText('Deuda Mínima')
        const maxDebtInput = screen.getByPlaceholderText('Deuda Máxima')
    
        fireEvent.change(minDebtInput, { target: { value: '10001' } })
        fireEvent.change(maxDebtInput, { target: { value: '500' } })
    
        await waitFor(() => {
            expect(screen.getByText('ALERTA: Deuda mayor a 10,000')).toBeInTheDocument()
        })
    })

    it('ALERTA: Deuda mínima mayor a deuda máxima', async () => {
        render(<UserListAdmin />)
        await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2))
    
        const minDebtInput = screen.getByPlaceholderText('Deuda Mínima')
        const maxDebtInput = screen.getByPlaceholderText('Deuda Máxima')
    
        fireEvent.change(minDebtInput, { target: { value: '500' } })
        fireEvent.change(maxDebtInput, { target: { value: '100' } })
    
        await waitFor(() => {
            expect(screen.getByText('ALERTA: Deuda mínima mayor a deuda máxima')).toBeInTheDocument()
        })
    })
})
